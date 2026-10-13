# SocialLite

SocialLite is a web-based social posting application developed as an MSc Software Engineering practical assessment. It provides user authentication and a feed where users can create and interact with posts.

## Features

The application is designed to support:

* User registration and login.
* Authenticated access to protected operations.
* Viewing posts in a feed.
* Creating posts.
* Displaying post authors and timestamps.
* Persistent storage using PostgreSQL.
* Additional social interactions, including likes and comments, where implemented.

Refer to the application and automated tests to verify the availability of individual features.

## Technology Stack

* **Frontend:** React and Vite
* **Backend:** Python and FastAPI
* **Database:** PostgreSQL
* **Authentication:** JWT-based authentication
* **Testing:** Pytest
* **Version control:** Git and GitHub
* **Containerisation:** Docker and Docker Compose

## Project Structure

```text
social-lite/
├── backend/                 # FastAPI backend and tests
├── frontend/                # React frontend
├── docs/
│   ├── requirements.md      # Requirements and acceptance criteria
│   ├── methodology.md       # Development methodology
│   ├── backlog.md           # Product backlog and user stories
│   └── architecture-and-adr.md
├── compose.yaml             # Docker Compose configuration
├── .gitignore
└── README.md
```

## Prerequisites

For local development without Docker, install:

* Python 3.10 or a compatible version supported by the project dependencies.
* Node.js and npm.
* PostgreSQL.
* Git.

Docker Desktop is required if using Docker Compose.

## Running Locally

### 1. Configure the backend

Open a terminal in the project root and navigate to the backend:

```powershell
cd backend
```

Create and activate a Python virtual environment if one does not already exist:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install the backend dependencies using the dependency file present in the backend directory. For example, if `requirements.txt` exists:

```powershell
python -m pip install -r requirements.txt
```

Configure the required environment variables in the backend `.env` file. Use the project's example configuration, if available, to identify the required database and authentication settings. Do not commit real credentials or secret keys.

Ensure PostgreSQL is running and the configured database exists.

### 2. Start the backend API

From the `backend` directory, run:

```powershell
python -m uvicorn app.main:app --reload
```

The API should be available at:

* API: `http://127.0.0.1:8000`
* Interactive API documentation: `http://127.0.0.1:8000/docs`

### 3. Start the frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite in the terminal. The development server has been configured to use port `5175` in this project, if that port is available.

## Running Tests

From the backend directory, run:

```powershell
python -m pytest -q
```

Review the test results to confirm whether the tests pass in your environment.

## Running with Docker

The repository includes a `compose.yaml` file intended to support containerised execution.

From the project root, inspect and validate the configuration before starting the services:

```powershell
docker compose config
```

If the configuration is valid and Docker Desktop is running, start the application with:

```powershell
docker compose up --build
```

The actual service names, ports, environment variables, and startup requirements are defined in `compose.yaml`. Confirm these details before relying on Docker deployment.

## Documentation

* [Requirements and acceptance criteria](docs/requirements.md)
* [Development methodology](docs/methodology.md)
* [Product backlog](docs/backlog.md)
* [Architecture and ADR](docs/architecture-and-adr.md)

## Development and Quality Assurance

The project uses Git for version control and is intended to use automated tests and continuous integration to support verification. Test results and CI status should be checked before treating a build as successful.

## Limitations and Future Improvements

Potential improvements include expanding automated test coverage, improving error handling and accessibility, strengthening deployment configuration, and extending the application's social features.

## Academic Integrity

This project was developed for academic assessment. Implementation details, testing results, and any permitted AI assistance should be reviewed and disclosed in accordance with the institution's academic integrity policy.
