from app.database import get_connection

try:
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT current_database();")
    result = cursor.fetchone()

    print("SUCCESS: Database module is working!")
    print(f"Connected database: {result[0]}")

    cursor.close()
    connection.close()

except Exception as error:
    print("DATABASE CONNECTION FAILED.")
    print(error)
