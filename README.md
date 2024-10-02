Logee Registration Backend

This project is the backend service for Logee, a platform designed to streamline the registration process for businesses and users. It is built using Node.js and Express, with MongoDB as the database. The backend handles authentication, business registration, and user management, providing a secure and scalable environment for handling various requests.

Features

    User Authentication: Secured using JWT (JSON Web Tokens) to protect user data and ensure that only authorized users can access specific endpoints.
    Business Registration: Allows businesses to register by submitting required information, including company documents, with file upload support.
    Database Management: Utilizes MongoDB for data storage, with Mongoose for schema-based object modeling.
    Error Handling: Comprehensive error handling middleware ensures a smooth user experience and robust backend operations.
    Test Suite: Unit tests using Jest and Supertest to verify the functionality of various controllers and business logic.

Technologies Used

    Node.js: Server-side JavaScript runtime.
    Express.js: Web framework for Node.js.
    MongoDB: NoSQL database used for data storage.
    Mongoose: ODM (Object Data Modeling) library for MongoDB and Node.js.
    JWT (JSON Web Token): For securing user authentication.
    Jest & Supertest: For testing the API endpoints.

Key Functionalities
    
    User Authentication:
        User login and registration are secured using JWT, ensuring only authorized users have access to the system.
    Business Registration:
        Businesses can submit their company details, including name, bank information, and registration documents, which are uploaded and stored.
        The backend processes these requests, storing the data securely in MongoDB.
    CRUD Operations:
        Full support for Create, Read, Update, and Delete operations for both users and businesses.
    Database Integration:
        Mongoose is used for schema management, ensuring efficient data validation and interaction with MongoDB.

API Endpoints Authentication
    POST /api/auth/register: Register a new user.
    POST /api/auth/login: Login to receive an authentication token.

Users
    GET /api/users: Get all registered users.
    GET /api/users/:id: Get user details by ID.
    PUT /api/users/:id: Update user information.

Business
    POST /api/business/register: Register a new business.
    GET /api/business: Get a list of all registered businesses.

The application is deployed on Google Cloud Platform (GCP) for high availability and scalability. You can access the live deployment here: [Logee B2B Registration Back-End](https://logeeregistbe-210399500671.asia-east1.run.app/)
