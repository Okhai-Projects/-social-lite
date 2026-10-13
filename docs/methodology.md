# SocialLite — Development Methodology

## 1. Introduction

The SocialLite project was developed using an iterative and incremental approach. This approach supports the development of a Minimum Viable Product (MVP) by dividing the work into manageable tasks and implementing the most important features first.

The methodology was selected to support the assessment requirements, limited development time, continuous testing, and the gradual improvement of the application.

## 2. Selected Methodology

An Agile-inspired iterative approach was selected for SocialLite.

Instead of attempting to develop the entire application in one stage, the work was organised around individual features and deliverables. These included requirements analysis, frontend development, backend API development, database integration, authentication, testing, and deployment preparation.

Each stage built upon the previous work, allowing functionality to be checked and improved throughout development.

## 3. Reasons for the Choice

### 3.1 Flexibility

The project includes several interconnected components, including a React frontend, FastAPI backend, and PostgreSQL database. An iterative approach makes it easier to address integration problems as they arise.

### 3.2 Early Delivery of Core Features

The approach prioritises essential MVP functionality, including registration, login, creating posts, viewing the feed, and persistent storage. Additional features can be developed after the core requirements have been addressed.

### 3.3 Continuous Testing

Testing can be performed as individual features are implemented. Automated tests and continuous integration help identify problems before submission.

### 3.4 Manageable Workload

Breaking the assessment into requirements, backlog, architecture, implementation, testing, and deployment tasks makes progress easier to track and review.

### 3.5 Support for Feedback

The application can be reviewed after each significant development stage. Problems discovered during testing can be used to guide subsequent improvements.

## 4. Application to SocialLite

The iterative approach was applied through the following stages:

1. **Requirements analysis:** Identify the functional and non-functional requirements and define acceptance criteria.
2. **Planning:** Identify user stories, prioritise features, and organise development tasks.
3. **Architecture and design:** Separate the frontend, backend API, and database responsibilities.
4. **Implementation:** Develop the application features and connect the frontend to the backend.
5. **Testing:** Verify authentication, post operations, access control, and expected application behaviour.
6. **Integration and delivery:** Maintain the code in GitHub and prepare Docker and continuous integration workflows.
7. **Review:** Check the implementation against the requirements and identify remaining issues.

These stages are iterative rather than strictly linear; testing results and implementation issues can lead to revisions.

## 5. Advantages and Limitations

### Advantages

* Core functionality can be prioritised.
* Problems can be identified earlier.
* Requirements and implementation can be refined during development.
* Progress can be demonstrated through Git commits and working features.
* Testing can be incorporated throughout development.

### Limitations

* Frequent changes can require additional integration and regression testing.
* Without clear priorities, additional features can distract from essential requirements.
* Limited development time can restrict the amount of testing and documentation completed.

These limitations are addressed by prioritising the assessment's essential requirements and verifying the final application before submission.

## 6. Conclusion

An Agile-inspired iterative approach was appropriate for SocialLite because it supports incremental delivery, continuous testing, and manageable development tasks.

The approach also aligns with the project's use of GitHub, automated testing, and continuous integration. The final result should be evaluated against the defined requirements and acceptance criteria rather than assuming that every planned feature is complete.
