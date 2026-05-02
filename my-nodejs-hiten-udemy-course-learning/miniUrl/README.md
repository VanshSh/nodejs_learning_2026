# MiniUrl - URL Shortener

## What is this project

MiniUrl is a URL shortening service built with Node.js and Express. It allows users to create short URLs from long ones, manage their URLs, and provides redirection functionality. The application includes user authentication, allowing users to sign up, log in, and manage their own shortened URLs securely.

## What libraries are we using and WHY

- **Express** (`^4.22.1`): Web framework for Node.js. Chosen for its simplicity, middleware support, and robust routing capabilities for building REST APIs.
- **Drizzle ORM** (`^0.45.2`): Type-safe ORM for database operations. Selected for its excellent TypeScript support, query builder, and schema definitions that prevent runtime errors.
- **pg** (`^8.20.0`): PostgreSQL client. Used as the database driver for connecting to PostgreSQL database.
- **jsonwebtoken** (`^9.0.3`): For JWT token creation and validation. Essential for implementing stateless authentication.
- **nanoid** (`^5.1.11`): For generating unique short codes. Provides URL-safe, collision-resistant IDs that are perfect for short URLs.
- **zod** (`^4.3.6`): Schema validation library. Used for runtime type checking and validation of request bodies, ensuring data integrity.
- **dotenv** (`^17.4.2`): Environment variable management. Critical for securely storing sensitive configuration like database URLs and JWT secrets.

Dev dependencies:
- **@types/express**, **@types/node**, **@types/pg**: TypeScript type definitions for better development experience.
- **drizzle-kit** (`^0.31.10`): Database migration and schema management tool for Drizzle ORM.
- **tsx** (`^4.21.0`): TypeScript execution tool for development.

## Explain the structure of the project

This project follows a modular architecture with clear separation of concerns:

- **Routes**: Handle HTTP requests and responses, delegate business logic to services
- **Services**: Contain business logic and database operations
- **Models**: Define database schemas using Drizzle ORM
- **Middlewares**: Handle cross-cutting concerns like authentication
- **Utils**: Provide utility functions for hashing, token management
- **Validations**: Define request validation schemas using Zod
- **Database**: Configuration and connection setup

## File structure and usecase of each file and explain important function in those files use case of those function

```
miniUrl/
├── docker-compose.yml          # Docker setup for PostgreSQL database
├── drizzle.config.js           # Drizzle ORM configuration for migrations
├── index.js                    # Main application entry point
├── package.json                # Project dependencies and scripts
├── db/
│   └── index.js                # Database connection setup using Drizzle
├── middlewares/
│   └── auth.middlewares.js     # Authentication middleware functions
├── models/
│   ├── index.js                # Exports all database models
│   ├── url.model.js            # URL table schema definition
│   └── user.model.js           # User table schema definition
├── routes/
│   ├── url.routes.js           # URL-related API endpoints
│   └── user.routes.js          # User authentication endpoints
├── services/
│   ├── url.service.js          # URL business logic and database operations
│   └── user.service.js         # User business logic and database operations
├── utils/
│   ├── hash.js                 # Password hashing utilities
│   └── token.js                # JWT token creation and validation
└── validations/
    └── request.validation.js   # Request body validation schemas
```

### Key Files Explanation:

**index.js**: Main entry point that sets up Express app, middleware, routes, and starts the server.

**db/index.js**: Creates and exports the database connection using Drizzle ORM.

**models/user.model.js**: Defines the users table schema with fields like id, firstname, lastname, email, password, salt, timestamps.

**models/url.model.js**: Defines the urls table schema with shortCode, targetUrl, userId (foreign key), timestamps.

**routes/user.routes.js**:
- `POST /signup`: Validates input, checks for existing user, hashes password, creates user
- `POST /login`: Validates credentials, verifies password hash, returns JWT token

**routes/url.routes.js**:
- `POST /shorten`: Creates short URL (authenticated)
- `GET /codes`: Lists user's URLs (authenticated)
- `DELETE /:id`: Deletes user's URL (authenticated)
- `GET /:shortCode`: Redirects to target URL (public)

**middlewares/auth.middlewares.js**:
- `authenticationMiddleware`: Checks for Bearer token, validates JWT, sets req.user
- `ensureAuthenticated`: Ensures user is authenticated for protected routes

**services/user.service.js**:
- `getUserByEmail`: Retrieves user by email for authentication
- `createUser`: Inserts new user into database

**services/url.service.js**:
- `insertUrl`: Creates new short URL, generates code if not provided using nanoid

**utils/hash.js**:
- `hashPasswordWithSalt`: Hashes passwords with HMAC SHA256 and salt for security

**utils/token.js**:
- `createUserToken`: Signs JWT with user payload
- `validateUserToken`: Verifies and decodes JWT tokens

**validations/request.validation.js**: Zod schemas for validating API request bodies.

## Create the flow of the project

1. **User Registration**:
   - User sends POST /user/signup with firstname, lastname, email, password
   - Request validated with Zod schema
   - Check if user exists, hash password with salt, create user
   - Return user ID

2. **User Login**:
   - User sends POST /user/login with email, password
   - Validate request, retrieve user by email
   - Hash provided password with user's salt, compare with stored hash
   - If valid, create JWT token with userId, return token

3. **Create Short URL** (Authenticated):
   - User sends POST /shorten with url and optional code, Bearer token in header
   - Auth middleware validates token, sets req.user
   - Validate request body
   - Generate short code (nanoid if not provided)
   - Insert URL with userId into database
   - Return created URL data

4. **List User URLs** (Authenticated):
   - GET /codes with Bearer token
   - Auth middleware validates token
   - Query database for URLs where userId matches
   - Return list of user's URLs

5. **Delete URL** (Authenticated):
   - DELETE /:id with Bearer token
   - Auth middleware validates token
   - Delete URL where id matches and userId matches current user

6. **URL Redirection** (Public):
   - GET /:shortCode (no auth required)
   - Query database for URL with matching shortCode
   - If found, redirect to targetUrl
   - If not found, return 404

## How to run the project

### Prerequisites
- Node.js (v16 or higher)
- Docker and Docker Compose

### Setup Steps

1. **Clone the repository and navigate to the project directory**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory with:
   ```
   DATABASE_URL=postgresql://postgres:admin@localhost:6432/miniurl
   JWT_SECRET_KEY=your-secret-key-here
   PORT=3000
   ```

4. **Start the PostgreSQL database**:
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**:
   ```bash
   npm run db:push
   ```

6. **Start the application**:
   ```bash
   npm start
   ```

The server will start on port 3000 (or PORT from env). You can also use `npm run db:studio` to open Drizzle Studio for database management.

### API Endpoints

- `GET /health_check` - Health check
- `POST /user/signup` - User registration
- `POST /user/login` - User login
- `POST /shorten` - Create short URL (requires auth)
- `GET /codes` - List user's URLs (requires auth)
- `DELETE /:id` - Delete URL (requires auth)
- `GET /:shortCode` - Redirect to original URL