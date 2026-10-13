from fastapi.middleware.cors import CORSMiddleware
import os
from pathlib import Path
from datetime import datetime, timedelta, timezone

import jwt
import psycopg
from dotenv import load_dotenv
from argon2 import PasswordHasher
from argon2.exceptions import (
    HashingError,
    InvalidHashError,
    VerificationError,
    VerifyMismatchError,
)
from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field

from app.database import get_connection
ENV_FILE = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(ENV_FILE)

app = FastAPI(
title="SocialLite API",
version="1.0.0",
)

app.add_middleware(
CORSMiddleware,
allow_origins=[
"http://localhost:5173",
"http://localhost:5174",
"http://localhost:5175",
"http://127.0.0.1:5173",
"http://127.0.0.1:5174",
"http://127.0.0.1:5175",
],
allow_credentials=True,
allow_methods=["*"],
allow_headers=["*"],
)

password_hasher = PasswordHasher()


def get_jwt_secret():
    secret = os.getenv("JWT_SECRET")
    if not secret or secret == "replace_this_with_a_long_random_secret":
        raise RuntimeError("JWT_SECRET is missing or not configured.")
    return secret


def create_access_token(user_id: int, username: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user_id),
        "username": username,
        "iat": now,
        "exp": now + timedelta(minutes=30),
    }
    return jwt.encode(
        payload,
        get_jwt_secret(),
        algorithm=os.getenv("JWT_ALGORITHM", "HS256"),
    )


class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=8, max_length=128)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


@app.post("/api/auth/register", status_code=status.HTTP_201_CREATED)
def register_user(request: RegisterRequest):
    password_hash = password_hasher.hash(request.password)

    try:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO users (username, email, password_hash)
                    VALUES (%s, %s, %s)
                    RETURNING id, username, email, created_at;
                    """,
                    (request.username, request.email, password_hash),
                )
                user = cursor.fetchone()

        return {
            "message": "Registration successful",
            "user": {
                "id": user[0],
                "username": user[1],
                "email": user[2],
                "created_at": user[3],
            },
        }

    except psycopg.errors.UniqueViolation:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username or email is already registered.",
        )
    except psycopg.Error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to register user at this time.",
        )


@app.post("/api/auth/login")
def login_user(request: LoginRequest):
    try:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT id, username, password_hash
                    FROM users
                    WHERE username = %s;
                    """,
                    (request.username,),
                )
                user = cursor.fetchone()

    except psycopg.Error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to log in at this time.",
        )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password.",
        )

    try:
        password_hasher.verify(user[2], request.password)
    except (VerifyMismatchError, VerificationError, InvalidHashError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password.",
        )

    token = create_access_token(user[0], user[1])

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "expires_in": 1800,
        "user": {
            "id": user[0],
            "username": user[1],
        },
}

security = HTTPBearer()


class CreatePostRequest(BaseModel):
    content: str = Field(min_length=1, max_length=280)


class PostUpdate(BaseModel):
    content: str = Field(min_length=1, max_length=280)


class CommentCreate(BaseModel):
    content: str = Field(min_length=1, max_length=2000)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            get_jwt_secret(),
            algorithms=[os.getenv("JWT_ALGORITHM", "HS256")],
        )
        user_id = int(payload["sub"])
        username = payload["username"]

        return {"id": user_id, "username": username}

    except (jwt.InvalidTokenError, KeyError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token.",
            headers={"WWW-Authenticate": "Bearer"},
        )


@app.post("/api/posts", status_code=status.HTTP_201_CREATED)
def create_post(
    request: CreatePostRequest,
    current_user: dict = Depends(get_current_user),
):
    content = request.content.strip()

    if not content:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Post content cannot be empty.",
        )

    try:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO posts (user_id, content)
                    VALUES (%s, %s)
                    RETURNING id, user_id, content, created_at;
                    """,
                    (current_user["id"], content),
                )
                post = cursor.fetchone()

        return {
            "message": "Post created successfully",
            "post": {
                "id": post[0],
                "user_id": post[1],
                "content": post[2],
                "created_at": post[3],
                "username": current_user["username"],
            },
        }

    except psycopg.Error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create post at this time.",
        )


@app.get("/api/posts")
def get_posts():
    try:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT
                        posts.id,
                        posts.content,
                        posts.created_at,
                        users.id,
                        users.username
                    FROM posts
                    JOIN users ON posts.user_id = users.id
                    ORDER BY posts.created_at DESC, posts.id DESC;
                    """
                )
                rows = cursor.fetchall()

        return {
            "posts": [
                {
                    "id": row[0],
                    "content": row[1],
                    "created_at": row[2],
                    "user_id": row[3],
                    "username": row[4],
                }
                for row in rows
            ]
        }

    except psycopg.Error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to retrieve posts at this time.",
        )

@app.post("/api/posts/{post_id}/like")
def like_post(
    post_id: int,
    current_user: dict = Depends(get_current_user),
):
    try:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    "SELECT id FROM posts WHERE id = %s;",
                    (post_id,),
                )
                if cursor.fetchone() is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Post not found.",
                    )

                cursor.execute(
                    """
                    INSERT INTO post_likes (user_id, post_id)
                    VALUES (%s, %s)
                    ON CONFLICT (user_id, post_id) DO NOTHING;
                    """,
                    (current_user["id"], post_id),
                )

                cursor.execute(
                    "SELECT COUNT(*) FROM post_likes WHERE post_id = %s;",
                    (post_id,),
                )
                like_count = cursor.fetchone()[0]

        return {"post_id": post_id, "likes": like_count, "liked": True}

    except psycopg.Error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to like this post.",
        )


@app.delete("/api/posts/{post_id}/like")
def unlike_post(
    post_id: int,
    current_user: dict = Depends(get_current_user),
):
    try:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    "SELECT id FROM posts WHERE id = %s;",
                    (post_id,),
                )
                if cursor.fetchone() is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Post not found.",
                    )

                cursor.execute(
                    """
                    DELETE FROM post_likes
                    WHERE user_id = %s AND post_id = %s;
                    """,
                    (current_user["id"], post_id),
                )

                cursor.execute(
                    "SELECT COUNT(*) FROM post_likes WHERE post_id = %s;",
                    (post_id,),
                )
                like_count = cursor.fetchone()[0]

        return {"post_id": post_id, "likes": like_count, "liked": False}

    except psycopg.Error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to unlike this post.",
        )

@app.delete("/api/posts/{post_id}")
def delete_post(
    post_id: int,
    current_user: dict = Depends(get_current_user),
):
    try:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    DELETE FROM posts
                    WHERE id = %s AND user_id = %s
                    RETURNING id;
                    """,
                    (post_id, current_user["id"]),
                )

                deleted_post = cursor.fetchone()

                if deleted_post is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Post not found or you are not allowed to delete it.",
                    )

        return {
            "message": "Post deleted successfully.",
            "post_id": deleted_post[0],
        }

    except psycopg.Error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to delete this post.",
        )
@app.put("/api/posts/{post_id}")
def update_post(
    post_id: int,
    post: PostUpdate,
    current_user: dict = Depends(get_current_user),
):
    content = post.content.strip()

    if not content:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Post content cannot be empty.",
        )

    try:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    UPDATE posts
                    SET content = %s
                    WHERE id = %s AND user_id = %s
                    RETURNING id, content;
                    """,
                    (content, post_id, current_user["id"]),
                )
                updated_post = cursor.fetchone()

                if updated_post is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Post not found or you are not allowed to edit it.",
                    )

        return {
            "message": "Post updated successfully.",
            "post_id": updated_post[0],
            "content": updated_post[1],
        }

    except psycopg.Error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to update this post.",
        )


class CommentCreate(BaseModel):
    content: str = Field(min_length=1, max_length=2000)


@app.get("/api/posts/{post_id}/comments")
def get_comments(post_id: int):
    try:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    "SELECT id FROM posts WHERE id = %s;",
                    (post_id,),
                )
                if cursor.fetchone() is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Post not found.",
                    )

                cursor.execute(
                    """
                    SELECT
                        comments.id,
                        comments.content,
                        comments.created_at,
                        users.id,
                        users.username
                    FROM comments
                    JOIN users ON comments.user_id = users.id
                    WHERE comments.post_id = %s
                    ORDER BY comments.created_at ASC, comments.id ASC;
                    """,
                    (post_id,),
                )
                rows = cursor.fetchall()

        return {
            "comments": [
                {
                    "id": row[0],
                    "content": row[1],
                    "created_at": row[2],
                    "user_id": row[3],
                    "username": row[4],
                }
                for row in rows
            ]
        }

    except psycopg.Error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to retrieve comments.",
        )


@app.post("/api/posts/{post_id}/comments", status_code=status.HTTP_201_CREATED)
def create_comment(
    post_id: int,
    comment: CommentCreate,
    current_user: dict = Depends(get_current_user),
):
    content = comment.content.strip()

    if not content:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Comment cannot be empty.",
        )

    try:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    "SELECT id FROM posts WHERE id = %s;",
                    (post_id,),
                )
                if cursor.fetchone() is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Post not found.",
                    )

                cursor.execute(
                    """
                    INSERT INTO comments (post_id, user_id, content)
                    VALUES (%s, %s, %s)
                    RETURNING id, created_at;
                    """,
                    (post_id, current_user["id"], content),
                )
                row = cursor.fetchone()

        return {
            "id": row[0],
            "post_id": post_id,
            "user_id": current_user["id"],
            "username": current_user["username"],
            "content": content,
            "created_at": row[1],
        }

    except psycopg.Error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create comment.",
        )
     
    
@app.delete("/api/comments/{comment_id}")
def delete_comment(
    comment_id: int,
    current_user: dict = Depends(get_current_user),
):
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    DELETE FROM comments
                    WHERE id = %s AND user_id = %s
                    RETURNING id
                    """,
                    (comment_id, current_user["id"]),
                )
                deleted_comment = cur.fetchone()
        if deleted_comment is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found or you do not have permission to delete it.",
        )

        return {"message": "Comment deleted successfully."}

    except psycopg.Error:
        raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Unable to delete comment.",
    )
