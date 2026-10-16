
from app.database import get_connection


def init_db():
    """Create the database tables required by SocialLite."""

    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(50) NOT NULL UNIQUE,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password_hash TEXT NOT NULL,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );
            """)

            cursor.execute("""
                CREATE TABLE IF NOT EXISTS posts (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL
                        REFERENCES users(id) ON DELETE CASCADE,
                    content VARCHAR(280) NOT NULL
                        CHECK (char_length(trim(content)) > 0),
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );
            """)

            cursor.execute("""
                CREATE TABLE IF NOT EXISTS post_likes (
                    user_id INTEGER NOT NULL
                        REFERENCES users(id) ON DELETE CASCADE,
                    post_id INTEGER NOT NULL
                        REFERENCES posts(id) ON DELETE CASCADE,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    PRIMARY KEY (user_id, post_id)
                );
            """)

            cursor.execute("""
                CREATE TABLE IF NOT EXISTS comments (
                    id SERIAL PRIMARY KEY,
                    post_id INTEGER NOT NULL
                        REFERENCES posts(id) ON DELETE CASCADE,
                    user_id INTEGER NOT NULL
                        REFERENCES users(id) ON DELETE CASCADE,
                    content TEXT NOT NULL
                        CHECK (char_length(trim(content)) > 0),
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );
            """)

            cursor.execute("""
                CREATE INDEX IF NOT EXISTS idx_posts_created_at
                ON posts (created_at DESC);
            """)

            cursor.execute("""
                CREATE INDEX IF NOT EXISTS idx_comments_post_created
                ON comments (post_id, created_at);
            """)

        connection.commit()

    print("SocialLite database tables initialized successfully.")


if __name__ == "__main__":
    init_db()

