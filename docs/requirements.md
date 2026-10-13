# SocialLite — Requirements Document

**Project:** SocialLite (X/Twitter Lite MVP)
**Programme:** MSc Software Engineering
**Module:** Software Engineering Workshop
**Document:** Requirements Specification
**Version:** 1.0

## 1. Project Overview

SocialLite is a lightweight social media web application inspired by platforms such as X (formerly Twitter). It allows users to register, log in, publish text-based posts, view a shared feed, and interact with posts.

The application uses a React frontend, a FastAPI backend, and a PostgreSQL database. The backend exposes API endpoints used by the frontend, while PostgreSQL provides persistent storage for application data.

The objective is to deliver a working Minimum Viable Product (MVP) that demonstrates software engineering practices, including requirements analysis, version control, testing, containerisation, and continuous integration.

## 2. Scope

### 2.1 In Scope

The MVP is intended to include:

* User registration and authentication.
* Secure password hashing.
* Login and logout.
* Creating text-based posts.
* Viewing posts in a shared feed.
* Displaying each post's author, content, and creation date.
* Displaying the newest posts first.
* Persistent storage of users and posts.
* Authentication and authorisation for protected operations.
* Automated tests and a continuous integration workflow.
* Docker-based local execution.

Additional implemented features include liking posts, commenting on posts, editing one's own posts, and deleting one's own posts or comments. These features should be tested and documented in line with the final implementation.

### 2.2 Out of Scope

Unless added later, the MVP does not include:

* Direct messaging between users.
* Image or video uploads.
* Real-time notifications.
* Recommendation algorithms.
* Mobile applications.
* Third-party social media integrations.

## 3. Stakeholders and Users

| Stakeholder       | Interest                                                                    |
| ----------------- | --------------------------------------------------------------------------- |
| Application users | Register, authenticate, publish posts, and interact with content.           |
| Developer         | Implement, test, maintain, and document the application.                    |
| Assessor          | Evaluate the MVP and the software engineering practices used to develop it. |

## 4. Functional Requirements

Functional requirements describe what the application must do.

| ID    | Requirement                                                                                                                  | Priority |
| ----- | ---------------------------------------------------------------------------------------------------------------------------- | -------- |
| FR-01 | The system shall allow a new user to register an account with the required registration details.                             | Must     |
| FR-02 | The system shall validate registration input and reject invalid or duplicate account details.                                | Must     |
| FR-03 | The system shall store passwords as secure hashes rather than plaintext.                                                     | Must     |
| FR-04 | The system shall allow registered users to log in with valid credentials.                                                    | Must     |
| FR-05 | The system shall reject login attempts with invalid credentials without revealing sensitive account information.             | Must     |
| FR-06 | The system shall allow an authenticated user to log out by ending or removing the active client-side authentication session. | Must     |
| FR-07 | The system shall allow an authenticated user to create a text-based post.                                                    | Must     |
| FR-08 | The system shall allow users to view posts in a shared feed.                                                                 | Must     |
| FR-09 | Each post shall display its author's identity, text content, and creation date or timestamp.                                 | Must     |
| FR-10 | The feed shall display the newest posts first.                                                                               | Must     |
| FR-11 | The system shall persist user and post data in a database so that it remains available after an application restart.         | Must     |
| FR-12 | The backend shall protect operations that require authentication and reject unauthenticated requests.                        | Must     |
| FR-13 | The system shall associate each post with its author.                                                                        | Must     |
| FR-14 | The system shall allow a user to like and unlike a post, subject to the application's defined rules.                         | Should   |
| FR-15 | The system shall allow users to view and add comments to posts.                                                              | Should   |
| FR-16 | The system shall restrict post editing and deletion to the post's owner.                                                     | Should   |
| FR-17 | The system shall restrict comment deletion to the comment's owner, subject to the implemented authorisation rules.           | Should   |
| FR-18 | The system shall provide meaningful feedback when an operation succeeds or fails.                                            | Should   |

**Priority definitions**

* **Must:** Essential to the assessed MVP.
* **Should:** Valuable additional functionality that should be completed if time permits.

## 5. Non-Functional Requirements

Non-functional requirements describe how well the system should operate.

| ID     | Requirement                                                                                                               | Verification                                                                         |
| ------ | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| NFR-01 | Security: Passwords shall not be stored in plaintext.                                                                     | Inspect the authentication implementation and stored password values.                |
| NFR-02 | Security: Protected API operations shall verify authentication on the server.                                             | Send requests with missing, invalid, and valid authentication credentials.           |
| NFR-03 | Security: Users shall not be able to edit or delete another user's content where ownership restrictions apply.            | Attempt to modify content owned by another user.                                     |
| NFR-04 | Data persistence: Users and posts shall remain stored after the application is restarted.                                 | Create records, restart the application, and retrieve the records.                   |
| NFR-05 | Reliability: Invalid input and expected application errors shall be handled without an unhandled server failure.          | Test invalid requests and confirm appropriate error responses.                       |
| NFR-06 | Maintainability: Frontend, backend, and database responsibilities shall be organised into identifiable components.        | Inspect the project structure and architecture documentation.                        |
| NFR-07 | Usability: The interface shall provide understandable navigation, forms, and feedback messages.                           | Complete registration, login, posting, and feed-viewing tasks through the interface. |
| NFR-08 | Compatibility: The application shall be runnable in the documented development environment.                               | Follow the README setup instructions on a compatible machine.                        |
| NFR-09 | Testability: Core application behaviour shall be covered by automated tests.                                              | Run the project's automated test suite and review the results.                       |
| NFR-10 | Delivery: The CI workflow shall install dependencies, run tests, and build the application as required by the assessment. | Inspect a successful CI run triggered by a push to GitHub.                           |

## 6. Assumptions and Constraints

### 6.1 Assumptions

* Users have access to a modern web browser.
* Users have an internet or local network connection to access the running application.
* Each user is expected to use their own account credentials.
* The application is intended as an educational MVP rather than a production-scale social network.
* PostgreSQL is the persistent database used by the application.
* The React frontend communicates with the FastAPI backend through HTTP API requests.

### 6.2 Constraints

* The project must satisfy the supplied assessment brief and marking rubric.
* The project must be maintained in a GitHub repository.
* Docker must support the documented local execution workflow.
* The CI workflow must perform the required dependency installation, testing, and build steps.
* Development time and the scope of an MVP limit the number of features that can be included.
* Secrets such as database passwords and signing keys must not be committed to the public repository.

## 7. Acceptance Criteria

Acceptance criteria define observable conditions used to determine whether requirements have been satisfied.

| ID    | Related requirements  | Acceptance criteria                                                                                                      |
| ----- | --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| AC-01 | FR-01, FR-02          | A user can register using valid details. Invalid or duplicate details are rejected with a clear error.                   |
| AC-02 | FR-03, NFR-01         | A registered user's password is stored as a hash, not as the original plaintext password.                                |
| AC-03 | FR-04, FR-05          | Valid credentials allow login; invalid credentials are rejected.                                                         |
| AC-04 | FR-06                 | After logout, the client no longer uses the previous authentication token for protected requests.                        |
| AC-05 | FR-07                 | An authenticated user can submit a valid post and see it appear in the feed.                                             |
| AC-06 | FR-08, FR-09          | The feed displays post content, author identity, and creation date or timestamp.                                         |
| AC-07 | FR-10                 | When posts have different creation times, the newest post appears before older posts.                                    |
| AC-08 | FR-11, NFR-04         | A created user and post can still be retrieved after restarting the application, provided the database data is retained. |
| AC-09 | FR-12, NFR-02         | Requests to protected endpoints without valid authentication are rejected by the backend.                                |
| AC-10 | FR-14                 | A user can like a post and remove their like according to the application's rules.                                       |
| AC-11 | FR-15                 | A user can add a comment to a post and retrieve the post's comments.                                                     |
| AC-12 | FR-16, NFR-03         | The post owner can edit or delete their own post; another user cannot do so.                                             |
| AC-13 | FR-17                 | A comment owner can delete their own comment; an unauthorised user cannot delete it.                                     |
| AC-14 | FR-18, NFR-05, NFR-07 | Successful actions and common errors produce understandable feedback in the interface or API response.                   |
| AC-15 | NFR-06                | The project contains identifiable frontend, backend, and database components with documented responsibilities.           |
| AC-16 | NFR-08                | A new developer can follow the README to configure and run the application.                                              |
| AC-17 | NFR-09                | The automated test suite completes and reports its results.                                                              |
| AC-18 | NFR-10                | A GitHub Actions workflow runs the required checks and build successfully after a push.                                  |
| AC-19 | Delivery constraints  | The documented Docker workflow builds and starts the application and its required services.                              |

## 8. Requirements Verification Approach

Requirements shall be verified using a combination of:

* **Automated API tests:** Verify registration, authentication, post operations, authorisation, and expected error responses.
* **Manual user-interface tests:** Verify navigation, form validation, feed display, and feedback messages.
* **Database checks:** Verify password hashing, relationships between users and posts, and persistence.
* **Restart tests:** Verify that stored users and posts remain available after application restarts.
* **CI checks:** Verify that automated tests and application build steps pass.
* **Docker checks:** Verify that the documented container-based execution process works.

A requirement shall only be marked as fully satisfied when the corresponding behaviour has been verified against the running implementation.

## 9. Risks and Open Questions

* Password hashing and token validation must be reviewed to confirm that authentication is secure.
* Database persistence must be verified by restarting the application and checking retained data.
* The implementation of logout must be checked to ensure the client removes its active token.
* Docker and CI workflows must be executed successfully before they are described as complete.
* Additional features such as comments, likes, editing, and deletion must be tested against their ownership rules.
* The final requirements should be updated if implementation decisions change during development.

## 10. Conclusion

This document establishes the functional and non-functional requirements for SocialLite and defines acceptance criteria for evaluating the MVP. It provides a basis for implementation, testing, project planning, and assessment evidence.

The document should be maintained alongside the source code so that it continues to reflect the application's actual behaviour.
