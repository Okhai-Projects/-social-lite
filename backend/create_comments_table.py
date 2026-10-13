from app.database import get_connection


def create_comments_table():
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
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
                """
            )

            cursor.execute(
                """
                CREATE INDEX IF NOT EXISTS idx_comments_post_created
                ON comments (post_id, created_at);
                """
            )

        connection.commit()
        print("Comments table created successfully!")

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()


if __name__ == "__main__":
    create_comments_table()