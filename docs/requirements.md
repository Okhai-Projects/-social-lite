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

| ID    | Requirement                                                                         | Priority |
| :---- | :---------------------------------------------------------------------------------- | :------: |
| FR-01 | Users can register an account with the required details.                            |   Must   |
| FR-02 | The system validates registration details and rejects invalid or duplicate entries. |   Must   |
| FR-03 | Passwords are stored as secure hashes, not plaintext.                               |   Must   |
| FR-04 | Registered users can log in with valid credentials.                                 |   Must   |
| FR-05 | Invalid login attempts are rejected without exposing sensitive information.         |   Must   |
| FR-06 | Users can log out and end their active client-side session.                         |   Must   |
| FR-07 | Authenticated users can create text-based posts.                                    |   Must   |
| FR-08 | Users can view posts in a shared feed.                                              |   Must   |
| FR-09 | Each post displays its author's identity, content, and creation date.               |   Must   |
| FR-10 | Posts appear in newest-first order.                                                 |   Must   |
| FR-11 | User and post data persist in the database after application restarts.              |   Must   |
| FR-12 | Protected backend operations reject unauthenticated requests.                       |   Must   |
| FR-13 | Every post is associated with its author.                                           |   Must   |
| FR-14 | Users can like and unlike posts.                                                    |  Should  |
| FR-15 | Users can view and add comments to posts.                                           |  Should  |
| FR-16 | Only post owners can edit or delete their posts.                                    |  Should  |
| FR-17 | Comment deletion is restricted according to comment ownership rules.                |  Should  |
| FR-18 | The application provides clear success and error feedback.                          |  Should  |

**Priority:** Must = essential for the MVP; Should = additional functionality.

## 5. Non-Functional Requirements

| ID     | Category        | Requirement                                                         | Verification                                 |
| :----- | :-------------- | :------------------------------------------------------------------ | :------------------------------------------- |
| NFR-01 | Security        | Passwords must be stored as hashes.                                 | Inspect stored password values.              |
| NFR-02 | Security        | Protected API endpoints must validate authentication.               | Test requests with and without valid tokens. |
| NFR-03 | Authorisation   | Users cannot modify another user's posts.                           | Test ownership restrictions.                 |
| NFR-04 | Persistence     | User and post data must survive application restarts.               | Restart the app and retrieve saved data.     |
| NFR-05 | Reliability     | Invalid requests must produce appropriate errors.                   | Submit invalid API requests.                 |
| NFR-06 | Maintainability | Frontend, backend, and database responsibilities must be separated. | Review the project structure.                |
| NFR-07 | Usability       | Forms and actions must provide understandable feedback.             | Test common user workflows.                  |
| NFR-08 | Compatibility   | Setup instructions must allow another developer to run the app.     | Follow the README on a compatible machine.   |
| NFR-09 | Testability     | Core behaviour must have automated tests.                           | Run the test suite.                          |
| NFR-10 | Delivery        | CI must run tests and build the application.                        | Review a successful CI workflow.             |

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

The following criteria define how the main requirements will be tested.

| ID    | Related Requirement | Acceptance Criteria                                                     |
| :---- | :------------------ | :---------------------------------------------------------------------- |
| AC-01 | FR-01, FR-02        | Valid registration succeeds; invalid or duplicate details are rejected. |
| AC-02 | FR-03               | Passwords are stored as hashes, not plaintext.                          |
| AC-03 | FR-04, FR-05        | Valid credentials allow login; invalid credentials are rejected.        |
| AC-04 | FR-06               | Logging out removes the active token from the client.                   |
| AC-05 | FR-07               | An authenticated user can create a post and see it in the feed.         |
| AC-06 | FR-08, FR-09        | Posts show their content, author, and creation date.                    |
| AC-07 | FR-10               | Newer posts appear before older posts.                                  |
| AC-08 | FR-11               | Saved users and posts remain available after an application restart.    |
| AC-09 | FR-12               | Protected endpoints reject requests without valid authentication.       |
| AC-10 | FR-14               | Users can like a post and remove their like.                            |
| AC-11 | FR-15               | Users can add comments and retrieve a post's comments.                  |
| AC-12 | FR-16               | Owners can edit or delete their posts; other users cannot.              |
| AC-13 | FR-17               | Comment owners can delete their comments; unauthorised users cannot.    |
| AC-14 | FR-18               | Successful actions and common errors produce understandable feedback.   |
| AC-15 | NFR-06              | Frontend, backend, and database responsibilities are identifiable.      |
| AC-16 | NFR-08              | A developer can run the application by following the README.            |
| AC-17 | NFR-09              | Automated tests run and report their results.                           |
| AC-18 | NFR-10              | CI runs the required checks and build successfully after a push.        |
| AC-19 | Delivery            | The documented Docker workflow builds and starts the required services. |

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
