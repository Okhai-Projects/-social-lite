import os
from pathlib import Path

import psycopg
from dotenv import load_dotenv

ENV_FILE = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(ENV_FILE)

def get_connection():
    """Open and return a connection to the SocialLite database."""

    password = os.getenv("DB_PASSWORD")

    if not password:
        raise ValueError(
            "DB_PASSWORD is missing. Please check backend/.env."
        )

    connection = psycopg.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "5432")),
        dbname=os.getenv("DB_NAME", "sociallite"),
        user=os.getenv("DB_USER", "postgres"),
        password=password,
        connect_timeout=5,
    )

    return connection

