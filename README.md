# SocialLite

SocialLite is a web-based social posting application developed as an MSc Software Engineering practical assessment. It provides user authentication and a feed where users can create posts.

## Features

* User registration and login
* JWT-based authentication
* Authenticated access to protected operations
* Viewing posts in a feed
* Creating posts
* Displaying post authors and timestamps
* Persistent storage using PostgreSQL
* Automated backend tests

Additional social interactions, such as likes and comments, may be added as future improvements.

## Technology Stack

* **Frontend:** React and Vite
* **Backend:** Python and FastAPI
* **Database:** PostgreSQL
* **Authentication:** JSON Web Tokens (JWT)
* **Testing:** Pytest
* **Version Control:** Git and GitHub
* **Containerisation:** Docker and Docker Compose

## Project Structure

```text
social-lite/
├── backend/
│   ├── app/
│   ├── tests/
│   ├── Dockerfile
│   ├── init_db.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── docs/
│   ├── requirements.md
│   ├── methodology.md
│   ├── backlog.md
│   └── architecture-and-adr.md
├── compose.yaml
└── README.md
```

## Prerequisites

To run the application using Docker, install:

* Docker Desktop
* Git

Ensure Docker Desktop is running before starting the application.

## Running with Docker Compose

Docker Compose starts the frontend, backend API, and PostgreSQL database.

### 1. Clone the repository

```bash
git clone https://github.com/Okhai-Projects/-social-lite.git
cd -social-lite
```

If Git creates a directory with a different name, change into that directory instead.

### 2. Start the application

From the project root, run:

```bash
docker compose up --build -d
```

This builds the application images and starts the services in the background.

### 3. Access the application

Once the containers have started, open:

* **SocialLite frontend:** http://localhost:8080
* **Backend API:** http://localhost:8000
* **Interactive API documentation:** http://localhost:8000/docs

The first startup may take a few minutes while Docker downloads images, installs dependencies, and initializes the database.

### 4. Check the services

To view the status of the containers, run:

```bash
docker compose ps
```

To view application logs, run:

```bash
docker compose logs
```

To view logs for a specific service, run:

```bash
docker compose logs backend
```

### 5. Stop the application

Run the following command from the project root:

```bash
docker compose down
```

This stops and removes the containers while retaining the named database volume. Avoid `docker compose down -v` unless you intend to delete the stored database data.

## Running Locally Without Docker

Local development requires Python, Node.js, npm, and PostgreSQL.

### Backend

From the project root, navigate to the backend:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Configure the backend environment variables in the local `.env` file. Set the database connection details to match your local PostgreSQL installation. Keep real credentials and production secrets out of version control.

Start the backend:

```powershell
python -m uvicorn app.main:app --reload
```

The API documentation should be available at http://127.0.0.1:8000/docs.

### Frontend

Open a second terminal and navigate to the frontend directory:

```powershell
cd frontend
npm install
npm run dev
```

Open the development URL printed by Vite.

## Running Tests

From the backend directory, run:

```bash
python -m pytest -q
```

Review the test output to determine whether all tests pass.

## Documentation

* [Requirements and Acceptance Criteria](docs/requirements.md)
* [Development Methodology](docs/methodology.md)
* [Product Backlog](docs/backlog.md)
* [Architecture and Architecture Decision Records](docs/architecture-and-adr.md)

## Development and Quality Assurance

Git and GitHub are used for version control. Automated tests and continuous integration help verify the application during development. Test results should be reviewed before changes are considered verified.

## Limitations and Future Improvements

Potential improvements include expanding automated test coverage, improving accessibility and error handling, strengthening production deployment configuration, and adding further social features.

## Academic Integrity

This project was developed for academic assessment. Any use of AI assistance should be reviewed and disclosed in accordance with the institution's academic integrity policy.
