from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_post_without_authentication():
    response = client.post(
"/api/posts",
json={"content": "My first SocialLite post"},
)

    assert response.status_code in [401, 403]

def test_login_with_nonexistent_user():
    response = client.post(
    "/api/auth/login",
    json={
    "username": "user_does_not_exist",
    "password": "WrongPassword123!",
},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid username or password."

def test_register_with_invalid_email():
    response = client.post(
        "/api/auth/register",
        json={
            "username": "testuser123",
            "email": "not-an-email",
            "password": "SecurePass123!",
        },
    )

    assert response.status_code == 422

def test_create_post_too_long():
    from app.main import CreatePostRequest
    from pydantic import ValidationError

    try:
        CreatePostRequest(content="A" * 281)
        assert False, "Expected validation to reject content longer than 280 characters"
    except ValidationError:
        pass

def test_register_with_short_password():
    response = client.post(
        "/api/auth/register",
        json={
            "username": "testuser456",
            "email": "testuser456@example.com",
            "password": "abc12",
        },
    )

    assert response.status_code == 422


def test_create_access_token():
    import os
    import jwt
    from app.main import create_access_token


    os.environ["JWT_SECRET"] = "test_secret_key_for_sociallite_123456789"
    os.environ["JWT_ALGORITHM"] = "HS256"

    token = create_access_token(1, "testuser")

    payload = jwt.decode(
    token,
    os.environ["JWT_SECRET"],
    algorithms=["HS256"],
)

    assert payload["sub"] == "1"
    assert payload["username"] == "testuser"

def test_create_post_with_invalid_token():
    response = client.post(
    "/api/posts",
    json={"content": "Testing an invalid token"},
    headers={"Authorization": "Bearer invalid.token.value"},
)

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid or expired access token."

def test_create_post_with_expired_token():
    import os
    import jwt
    from datetime import datetime, timedelta, timezone

    secret = os.environ["JWT_SECRET"]

    expired_token = jwt.encode(
    {
        "sub": "1",
        "username": "testuser",
        "iat": datetime.now(timezone.utc) - timedelta(hours=2),
        "exp": datetime.now(timezone.utc) - timedelta(hours=1),
    },
    secret,
    algorithm="HS256",
)

    response = client.post(
    "/api/posts",
    json={"content": "Testing an expired token"},
    headers={"Authorization": f"Bearer {expired_token}"},
)

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid or expired access token."

