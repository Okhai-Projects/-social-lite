# SocialLite — Product Backlog

## 1. Purpose

This product backlog lists the user stories and development tasks for SocialLite. Items are prioritised according to their importance to the Minimum Viable Product (MVP).

**Priority levels:**

* **Must:** Essential for the core MVP.
* **Should:** Important additional functionality.
* **Could:** Optional improvement if time permits.

**Status definitions:**

* **To Do:** Not yet verified as complete.
* **In Progress:** Currently being worked on.
* **Done:** Implemented and verified.

Statuses must be updated to reflect the actual project state before submission.

## 2. Product Backlog

| ID    | User Story                                                                                                     | Priority | Acceptance Criteria                                                         | Status    |
| ----- | -------------------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------- | --------- |
| US-01 | As a visitor, I want to register an account so that I can use SocialLite.                                      | Must     | Valid details create an account; invalid or duplicate details are rejected. | To verify |
| US-02 | As a registered user, I want to log in so that I can access protected features.                                | Must     | Valid credentials allow login; invalid credentials are rejected.            | To verify |
| US-03 | As a user, I want my password stored securely so that it is not saved as plaintext.                            | Must     | Passwords are stored as hashes.                                             | To verify |
| US-04 | As a logged-in user, I want to log out so that I can end my active session.                                    | Must     | Logging out removes the active client-side token.                           | To verify |
| US-05 | As a logged-in user, I want to create a post so that I can share text with other users.                        | Must     | A valid post is saved and appears in the feed.                              | To verify |
| US-06 | As a user, I want to view a shared feed so that I can read posts.                                              | Must     | The feed displays available posts with their authors and content.           | To verify |
| US-07 | As a user, I want to see when posts were created so that I can understand their order.                         | Must     | Each post displays its creation date, and newer posts appear first.         | To verify |
| US-08 | As a user, I want my posts to remain saved so that data is available after restarting the application.         | Must     | Saved posts and users remain available after a restart.                     | To verify |
| US-09 | As an authenticated user, I want protected operations to require authentication so that access is restricted.  | Must     | Unauthenticated requests to protected endpoints are rejected.               | To verify |
| US-10 | As a user, I want to like and unlike posts so that I can express appreciation.                                 | Should   | A user can add and remove a like.                                           | To verify |
| US-11 | As a user, I want to comment on posts so that I can participate in discussions.                                | Should   | A user can add a comment and view comments.                                 | To verify |
| US-12 | As a post owner, I want to edit or delete my post so that I can manage my content.                             | Should   | Owners can edit or delete their posts; other users cannot.                  | To verify |
| US-13 | As a user, I want clear feedback so that I understand whether an action succeeded.                             | Should   | Successful actions and common errors produce understandable messages.       | To verify |
| US-14 | As a developer, I want automated tests so that I can check application behaviour.                              | Must     | The documented test command runs and reports results.                       | To verify |
| US-15 | As a developer, I want CI to run tests and build the application so that changes can be checked automatically. | Must     | The GitHub Actions workflow completes the required checks successfully.     | To verify |
| US-16 | As a developer, I want Docker instructions so that the application can be run consistently.                    | Must     | The documented Docker workflow builds and starts the required services.     | To verify |

## 3. Development Tasks

| Task ID | Task                                                     | Related Stories     | Priority |
| ------- | -------------------------------------------------------- | ------------------- | -------- |
| T-01    | Define functional and non-functional requirements.       | US-01 to US-16      | Must     |
| T-02    | Design the frontend, backend, and database architecture. | US-05 to US-09      | Must     |
| T-03    | Implement account registration and authentication.       | US-01, US-02, US-03 | Must     |
| T-04    | Implement logout and protected API operations.           | US-04, US-09        | Must     |
| T-05    | Implement post creation and feed retrieval.              | US-05, US-06, US-07 | Must     |
| T-06    | Configure persistent database storage.                   | US-08               | Must     |
| T-07    | Implement and verify additional post interactions.       | US-10 to US-13      | Should   |
| T-08    | Write and execute automated tests.                       | US-14               | Must     |
| T-09    | Configure and verify the CI workflow.                    | US-15               | Must     |
| T-10    | Configure and verify Docker-based execution.             | US-16               | Must     |
| T-11    | Complete the README and assessment documentation.        | All                 | Must     |
| T-12    | Review the repository and prepare submission evidence.   | All                 | Must     |

## 4. Prioritisation Approach

The backlog prioritises account security, authentication, post creation, feed display, and persistent storage because these features form the core MVP.

Automated testing, CI, and Docker are also high-priority items because they are explicit assessment requirements.

Additional interactions such as likes and comments are lower priority than the essential MVP functionality.

## 5. Backlog Maintenance

The backlog should be reviewed as development progresses. Priorities and statuses should reflect the current implementation and test results. A feature should only be marked Done after it has been implemented and verified against its acceptance criteria.
