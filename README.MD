# 📚 Complete Node.js Learning Course - Comprehensive Guide

This document covers all projects in the `nodejs-course-code-main` directory with detailed explanations of what, why, and how each project works.

---

## Table of Contents
1. [hello-world](#1-hello-world)
2. [01-modules](#2-01-modules)
3. [modules](#3-modules)
4. [http-server](#4-http-server)
5. [02-http](#5-02-http)
6. [03-http](#6-03-http)
7. [01-express](#7-01-express)
8. [express-book-store](#8-express-book-store)
9. [authentication-01](#9-authentication-01)
10. [authentication-session](#10-authentication-session)
11. [node-mongo](#11-node-mongo)
12. [project-url-shortner](#12-project-url-shortner)

---

## 1. hello-world

### 📋 What & Why
**Purpose:** Entry point to Node.js fundamentals. Demonstrates the difference between JavaScript environments (Browser vs Node.js).

### 🔍 How It Works

**File:** `script.js`
```javascript
console.log('Hello from script.js file');

const a = 1;
const b = 2;
const sum = a + b;

console.log('Sum is v9', sum);

// 2 different environments to run JS
// Browser (JS, Browser API - fetch, alert, setTimeout via WebAPI)
// NodeJS (JS, Extra APIs like fs, built-in setTimeout)
```

### 📦 Packages Used
- None (Pure JavaScript)

### 💡 Key Learning Points
- Node.js is a runtime environment for executing JavaScript outside the browser
- Node.js has additional APIs unavailable in browsers (like `fs` module)
- Both environments support `setTimeout`, but it's a WebAPI in browsers and native in Node.js
- Basic variable declaration and console logging

---

## 2. 01-modules

### 📋 What & Why
**Purpose:** Understand Node.js module system and demonstrate blocking vs non-blocking I/O operations using the File System (`fs`) module.

### 🔍 How It Works

**notes.txt** - Quick reference:
```
Modules I am writing:
1. Built In Modules (fs, http, path, etc.)
2. 3rd Party (External Modules) - npm install
3. Custom (My own) Modules

Focus: File System (fs)
```

**index.js** - Synchronous File Operations (Blocking):
```javascript
const fs = require('node:fs');

const contents = fs.readFileSync('notes.txt', 'utf-8');
// Reads file synchronously - blocks code execution until file is read

// fs.writeFileSync('copy.txt', 'hey', 'utf-8');
// fs.appendFileSync('copy.txt', '\n\nhey', 'utf-8');
// fs.mkdirSync('games/xyz/a', { recursive: true });
// fs.rmdirSync('games');

fs.unlinkSync('copy.txt'); // Delete file
```

**script.js** - Asynchronous File Operations (Non-Blocking):
```javascript
const fs = require('node:fs');

console.log('Start of Script');

// SYNC (Blocking) - Example commented out
// const contents = fs.readFileSync('notes.txt', 'utf-8');  // ❌ BLOCKS
// // If file is 1GB and takes 1min, everything waits
// console.log('Contents', contents);

// ASYNC (Non-Blocking) - Uses callback
fs.readFile('notes.txt', 'utf-8', function (error, data) {
  if (error) console.log(error);
  else console.log('Content got', data);
});

console.log('End of Script');
// This prints BEFORE file is read because readFile is async
// Output: Start → End → Content got (after file loads)
```

### 📦 Packages Used
- `@types/node: ^22.9.0` - TypeScript definitions for Node.js

### 💡 Key Learning Points

**Synchronous (Blocking) Operations:**
- `fs.readFileSync(path, encoding)` - Read file immediately
- `fs.writeFileSync(path, content, encoding)` - Write to file immediately
- `fs.appendFileSync(path, content, encoding)` - Append to file
- `fs.mkdirSync(path, options)` - Create directories
- `fs.rmdirSync(path)` - Remove directory
- `fs.unlinkSync(path)` - Delete file
- **Problem:** If file is large (1GB), it blocks all other code

**Asynchronous (Non-Blocking) Operations:**
- `fs.readFile(path, encoding, callback)` - Read asynchronously
- **Callback function:** `(error, data) => { ... }`
- **Advantage:** Code continues executing while file is being read
- **Pattern:** Check for error first, then process data

**Execution Order Example:**
```
1. console.log('Start of Script')     ✅ Prints immediately
2. fs.readFile(...) called            ✅ Initiates read (non-blocking)
3. console.log('End of Script')       ✅ Prints immediately
4. File loads                         ⏳ After loading
5. Callback executes                  ✅ Prints 'Content got...'
```

---

## 3. modules

### 📋 What & Why
**Purpose:** Create custom reusable modules using CommonJS. Learn named exports and default exports pattern.

### 🔍 How It Works

**math.js** - Module Definition:
```javascript
// Named Exports
exports.add = function add(a, b) {
  return a + b;
};

exports.sub = function sub(a, b) {
  return a - b;
};

exports.mul = function mul(a, b) {
  return a * b;
};

exports.div = function div(a, b) {
  return a / b;
};

// Default Export (Overwrites all previous exports)
module.exports = function () {
  console.log('Hey, I am default');
};

// Note: Only the DEFAULT export is accessible when importing
// Named exports become inaccessible after default export assignment
```

**index.js** - Module Usage:
```javascript
const value = require('./math');

value(); // Calls the default export
// Output: "Hey, I am default"

// To use named exports, must be set before default export:
// const math = require('./math');
// console.log(math.add(5, 3)); // 8
```

### 📦 Packages Used
- `@types/node: ^22.9.0` - TypeScript definitions

### 💡 Key Learning Points

**CommonJS Module System:**
- `require('./path')` - Import a module
- `exports.functionName = ...` - Named export
- `module.exports = ...` - Default export
- **Important:** Only ONE default export per module
- If you set `module.exports`, it overwrites `exports`

**Module Pattern:**
```javascript
// Pattern 1: Named Exports (Best for multiple functions)
exports.func1 = () => {};
exports.func2 = () => {};

// Pattern 2: Default Export (One main function)
module.exports = () => {};

// Pattern 3: Mix (But risky - default overwrites named)
exports.namedFunc = () => {};
module.exports = defaultFunc; // ❌ Named exports become inaccessible
```

---

## 4. http-server

### 📋 What & Why
**Purpose:** Build simplest possible HTTP server using Node.js built-in `http` module. Understand request/response cycle.

### 🔍 How It Works

```javascript
const http = require('node:http');

// Step 1: Create server with request handler
const server = http.createServer(function (req, res) {
  // req: Request object (contains info about incoming request)
  // res: Response object (used to send response back)
  
  console.log('I got an incoming request');
  // Could connect to database here (db.query())

  // Step 2: Write response
  res.writeHead(200); // 200 = HTTP status code (OK)
  res.end('Thanks for visiting my server :)'); // Send response body & end
});

// Step 3: Listen on port 8000
server.listen(8000, function () {
  console.log(`Http server is up and running on port 8000`);
});
```

### 📦 Packages Used
- None (Built-in `http` module)

### 💡 Key Learning Points

**HTTP Status Codes:**
- `200` - OK (Success)
- `201` - Created (Resource created)
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

**Request Object (`req`):**
- `req.url` - Requested path
- `req.method` - HTTP method (GET, POST, etc.)
- `req.headers` - Headers sent by client
- `req.body` - Request body (for POST)

**Response Object (`res`):**
- `res.writeHead(statusCode)` - Set HTTP status
- `res.write(data)` - Write response body
- `res.end(data)` - Send final response and close
- `res.json(data)` - Send JSON (Express only)

**Flow:**
```
Client sends request → Server receives in callback →
Server sends response → Client receives response
```

---

## 5. 02-http

### 📋 What & Why
**Purpose:** Build HTTP server with basic routing. Handle different URLs with switch statements.

### 🔍 How It Works

```javascript
const http = require('node:http');

const server = http.createServer(function (req, res) {
  console.log(`Incoming request at [${Date.now()}]`);
  console.log(req.url); // Example: "/" or "/contact-us"

  // Routing: Check requested URL and respond accordingly
  switch (req.url) {
    case '/':
      res.writeHead(200);
      return res.end(`Homepage`);

    case '/contact-us':
      res.writeHead(200);
      return res.end(`Contact Me at piyushgarg.dev@gmail.com`);

    case '/about':
      res.writeHead(200);
      return res.end('I am a software engineer');
    
    default:
      res.writeHead(404); // 404 = Not Found
      return res.end("You're lost");
  }
});

server.listen(8000, () => console.log(`Server is running on PORT: 8000`));
```

### 📦 Packages Used
- None (Built-in modules)

### 💡 Key Learning Points

**Routing Concept:**
- Check `req.url` to determine which endpoint was called
- Return different responses for different paths
- Handle unknown routes with `default` case (404 status)

**URL Patterns:**
- `/` - Root/Homepage
- `/contact-us` - Contact page
- `/about` - About page
- Any other path - Not Found (404)

---

## 6. 03-http

### 📋 What & Why
**Purpose:** Build HTTP server handling both GET and POST requests. Log all incoming requests with timestamps to a file.

### 🔍 How It Works

```javascript
const http = require('node:http');
const fs = require('node:fs');

const server = http.createServer((req, res) => {
  const method = req.method; // GET, POST, PUT, DELETE, etc.
  const path = req.url;

  // Log every request with timestamp
  const log = `\n[${Date.now()}]: ${method} ${path}`;
  fs.appendFileSync('log.txt', log, 'utf-8');

  // Route by HTTP method first
  switch (method) {
    case 'GET': {
      // Handle GET requests
      switch (path) {
        case '/':
          return res.writeHead(200).end('Hello from the server 👋🏻');
        case '/contact-us':
          return res
            .writeHead(200)
            .end('Email: piyushgarg.dev@gmail.com | Phone: +91 99999 99999');
        case '/tweet':
          return res.writeHead(200).end('Tweet-1\nTweet-2');
      }
      break;
    }

    case 'POST': {
      // Handle POST requests
      switch (path) {
        case '/tweet':
          return res.writeHead(201).end('Your tweet was created'); // 201 = Created
      }
      break;
    }
  }

  // Route not found
  return res.writeHead(404).end('You\'re lost!');
});

server.listen(8000, () => console.log(`Http server is running on PORT 8000`));
```

**task.md** - Requirements:
1. GET `/` - Return simple hello message
2. GET `/contact-us` - Return email and phone
3. GET `/tweet` - Return all tweets
4. POST `/tweet` - Create new tweet (fake DB)
5. Log all requests to `log.txt` with timestamp

### 📦 Packages Used
- Built-in `http` and `fs` modules

### 💡 Key Learning Points

**HTTP Methods:**
- `GET` - Retrieve data (safe, idempotent)
- `POST` - Create new resource
- `PUT` - Update existing resource
- `DELETE` - Remove resource

**Status Code Patterns:**
- `200` - GET request successful
- `201` - POST request successful (resource created)
- `404` - Resource not found
- `400` - Bad request

**Request Logging:**
```javascript
const log = `\n[${Date.now()}]: ${method} ${path}`;
fs.appendFileSync('log.txt', log, 'utf-8');
// Output in log.txt:
// [1699564800000]: GET /
// [1699564801000]: POST /tweet
// [1699564802000]: GET /tweet
```

---

## 7. 01-express

### 📋 What & Why
**Purpose:** Introduction to Express.js framework. Learn cleaner routing syntax compared to native HTTP module.

### 🔍 How It Works

```javascript
const express = require('express');

// Create Express application
const app = express();

// Define routes with simpler syntax than http module
app.get('/', function (req, res) {
  res.end('Homepage');
});

app.get('/contact-us', function (req, res) {
  res.end('You can contact me at my email address');
});

app.get('/tweets', (req, res) => {
  res.end('Here are your tweets');
});

// POST request handling
app.post('/tweets', (req, res) => {
  res.status(201).end('Tweet Created Success'); // Chainable API
});

// Listen on port 8000
app.listen(8000, () => console.log(`Server is running on PORT 8000`));
```

### 📦 Packages Used
```json
{
  "dependencies": {
    "express": "^4.21.1"
  },
  "devDependencies": {
    "@types/express": "^5.0.0",
    "@types/node": "^22.9.0"
  }
}
```

### 💡 Key Learning Points

**Why Express?**
- Simpler routing: `app.get()`, `app.post()` vs switch statements
- Chainable API: `res.status(201).end()`
- Built-in middleware system
- Route parameters and query strings support
- JSON handling out of the box

**Express Routing Syntax:**
```javascript
app.get(path, callback)   // GET request
app.post(path, callback)  // POST request
app.put(path, callback)   // PUT request
app.delete(path, callback) // DELETE request

// Callback parameters
(req, res, next) => {
  // req = incoming request
  // res = outgoing response
  // next = call next middleware
}
```

**Comparison with Native HTTP:**

| Feature     | Native HTTP          | Express                   |
| ----------- | -------------------- | ------------------------- |
| Routing     | Switch statements    | `app.get()`, `app.post()` |
| Status Code | `res.writeHead(201)` | `res.status(201)`         |
| Response    | `res.end()`          | `res.json()`, `res.end()` |
| Middleware  | Manual               | Built-in `app.use()`      |

---

## 8. express-book-store

### 📋 What & Why
**Purpose:** Build complete CRUD API (Create, Read, Update, Delete) for a book store. Demonstrate middleware, routing, in-memory database, and error handling.

### 🔍 How It Works

**Project Structure:**
```
express-book-store/
├── index.js              (Server setup)
├── db/
│   └── book.js          (In-memory database)
├── routes/
│   └── book.routes.js   (Book API endpoints)
├── middlewares/
│   └── logger.js        (Request logging)
└── package.json
```

**db/book.js** - In-Memory Database:
```javascript
// Simple in-memory array (resets when server restarts)
exports.BOOKS = [
  { id: 1, title: 'Book One', author: 'Author One' },
  { id: 2, title: 'Book Two', author: 'Author Two' },
];
```

**middlewares/logger.js** - Request Logging Middleware:
```javascript
const fs = require('node:fs');

exports.loggerMiddleware = function (req, res, next) {
  // Intercept request, log details
  const log = `\n[${Date.now()}] ${req.method} ${req.path}`;
  fs.appendFileSync('logs.txt', log, 'utf-8');
  
  // Pass to next middleware/route handler
  next();
};
```

**index.js** - Server Setup:
```javascript
const express = require('express');
const { loggerMiddleware } = require('./middlewares/logger');
const bookRouter = require('./routes/book.routes');

const app = express();
const PORT = 8000;

// Middlewares (executed in order)
app.use(express.json()); // Parse JSON request bodies
app.use(loggerMiddleware); // Log all requests

// Routes
app.use('/books', bookRouter); // Mount router at /books path

app.listen(PORT, () => console.log(`Http server is running on PORT ${PORT}`));
```

**routes/book.routes.js** - API Endpoints:
```javascript
const express = require('express');
const { BOOKS } = require('../db/book');

const router = express.Router();

// GET /books - Fetch all books
router.get('/', (req, res) => {
  res.json(BOOKS);
});

// GET /books/:id - Fetch specific book
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id); // Path parameter

  // Validation: ID must be number
  if (isNaN(id))
    return res.status(400).json({ error: `id must be of type number` });

  // Find book by ID
  const book = BOOKS.find((e) => e.id === id);

  // Error handling: Book not found
  if (!book)
    return res.status(404).json({ error: `Book with id ${id} does not exists!` });

  return res.json(book);
});

// POST /books - Create new book
router.post('/', (req, res) => {
  const { title, author } = req.body; // Extract from request body

  // Validation
  if (!title || title === '')
    return res.status(400).json({ error: 'title is required' });

  if (!author || author === '')
    return res.status(400).json({ error: 'author is required' });

  // Generate new ID
  const id = BOOKS.length + 1;

  // Create book object
  const book = { id, title, author };
  BOOKS.push(book); // Add to database

  return res.status(201).json({ message: 'Book created success', id });
});

// DELETE /books/:id - Remove book
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id))
    return res.status(400).json({ error: `id must be of type number` });

  // Find index of book to delete
  const indexToDelete = BOOKS.findIndex((e) => e.id === id);

  if (indexToDelete < 0)
    return res.status(404).json({ error: `Book with id ${id} does not exists!` });

  // Remove from array
  BOOKS.splice(indexToDelete, 1);

  return res.status(200).json({ message: 'book deleted' });
});

module.exports = router;
```

### 📦 Packages Used
```json
{
  "dependencies": {
    "express": "^4.21.1"
  },
  "devDependencies": {
    "@types/express": "^5.0.0",
    "@types/node": "^22.9.0"
  }
}
```

### 💡 Key Learning Points

**Middleware Concept:**
- Functions that intercept requests
- Execute in order with `app.use()`
- Must call `next()` to pass control
- Common middlewares: logging, authentication, JSON parsing

```javascript
app.use(express.json()); // Parse JSON bodies
app.use(authMiddleware); // Check authentication
app.use(loggerMiddleware); // Log requests
```

**Router Pattern:**
- `express.Router()` - Create separate router
- Mount at path: `app.use('/path', router)`
- Organizes routes in separate files

**CRUD Operations:**
| Operation  | HTTP Method | Endpoint           | Status |
| ---------- | ----------- | ------------------ | ------ |
| **C**reate | POST        | /books             | 201    |
| **R**ead   | GET         | /books, /books/:id | 200    |
| **U**pdate | PUT         | /books/:id         | 200    |
| **D**elete | DELETE      | /books/:id         | 200    |

**Path Parameters:**
```javascript
router.get('/:id', (req, res) => {
  const id = req.params.id; // Extract from URL
  // /books/5 → id = "5"
});
```

**Error Handling Pattern:**
```javascript
if (condition) {
  return res.status(400).json({ error: 'message' });
}
// Continue if valid
```

---

## 9. authentication-01

### 📋 What & Why
**Purpose:** Understand token-based authentication fundamentals. Learn how authentication tokens work as "parking tokens" for users.

### 🔍 How It Works

```javascript
import express from 'express';

const app = express();
const PORT = 8000;

app.use(express.json());

// In-memory storage
const DIARY = {};      // Maps token → user data
const EMAILS = new Set(); // Track used emails

// Signup endpoint - Create account and issue token
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  // Check if email already registered
  if (EMAILS.has(email)) {
    return res.status(400).json({ error: 'Email already taken' });
  }

  // Create token (simple: timestamp)
  // Real apps use JWT, OAuth, etc.
  const token = `${Date.now()}`;

  // Store user data with token as key
  DIARY[token] = { name, email, password };
  EMAILS.add(email);

  return res.json({ status: 'success', token });
});

// Authenticated endpoint - Get user data
app.post('/me', (req, res) => {
  const { token } = req.body;

  // Validation
  if (!token) {
    return res.status(400).json({ error: 'Missing Token' });
  }

  if (!(token in DIARY)) {
    return res.status(400).json({ error: 'Invalid Token' });
  }

  // Return user data
  const entry = DIARY[token];
  return res.json({ data: entry });
});

// Protected endpoint - Access private data
app.post('/private-data', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Missing Token' });
  }

  if (!(token in DIARY)) {
    return res.status(400).json({ error: 'Invalid Token' });
  }

  const entry = DIARY[token];
  return res.json({ data: { privateData: 'Access Granted' } });
});

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
```

### 📦 Packages Used
```json
{
  "dependencies": {
    "express": "^4.21.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.22",
    "@types/node": "^22.15.21"
  }
}
```

### 💡 Key Learning Points

**Token Concept (Parking Analogy):**
```
User says: "Here is my car (credentials). Please park it and give me a token."
Server: Issues token (receipt) to user
User later: "Here is my token. Can I access my private data?"
Server: Looks up token → "Yes, here's your data"
```

**Authentication Flow:**
```
1. User sends credentials (email, password) → /signup
2. Server validates, creates token
3. Server stores token → user data mapping
4. Server returns token to user
5. User sends token with subsequent requests
6. Server validates token
7. Server returns protected data
```

**Simple Token (⚠️ Not Secure):**
```javascript
const token = `${Date.now()}`; // Just timestamp
// Problems:
// - No encryption
// - Easy to forge
// - No signature verification
// - No expiration
// - Passwords stored in plain text
```

**Better Approach (used in later projects):**
- Use JWT (JSON Web Tokens) - Cryptographically signed
- Hash passwords with bcrypt or HMAC
- Add token expiration
- Use HTTPS in production

---

## 10. authentication-session

### 📋 What & Why
**Purpose:** Production-level JWT authentication with PostgreSQL database and Drizzle ORM. Learn session management with real database storage.

### 🔍 How It Works

**Project Structure:**
```
authentication-session/
├── index.js                      (Server setup)
├── routes/
│   ├── user.routes.js           (Login/Signup)
│   └── admin.routes.js          (Admin endpoints)
├── middlewares/
│   └── auth.middleware.js       (JWT validation)
├── db/
│   └── schema.js                (Database schema)
├── utils/
│   ├── hash.js                  (Password hashing)
│   └── token.js                 (JWT creation/validation)
├── docker-compose.yml           (PostgreSQL container)
├── drizzle.config.js            (ORM configuration)
└── package.json
```

**index.js** - Server Setup:
```javascript
import express from 'express';
import userRouter from './routes/user.routes.js';
import adminRouter from './routes/admin.routes.js';
import { authenticationMiddleware } from './middlewares/auth.middleware.js';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());
app.use(authenticationMiddleware); // Apply JWT validation to all routes

app.get('/', (req, res) => {
  return res.json({ status: 'Server is up and running' });
});

app.use('/user', userRouter);  // Login/Signup
app.use('/admin', adminRouter); // Protected admin routes

app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
```

**middlewares/auth.middleware.js** - JWT Validation:
```javascript
import { validateUserToken } from '../utils/token.js';

export function authenticationMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) return next(); // No token = public route

  if (!authHeader.startsWith('Bearer'))
    return res.status(400).json({ error: 'Must use Bearer token' });

  // Extract token from "Bearer <token>"
  const [_, token] = authHeader.split(' ');

  // Validate and decode token
  const payload = validateUserToken(token);

  // Attach user to request object
  req.user = payload;
  next();
}

export function ensureAuthenticated(req, res, next) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Must be logged in' });
  }
  next();
}
```

### 📦 Packages Used
```json
{
  "dependencies": {
    "express": "4.x",
    "jsonwebtoken": "^9.0.2",
    "pg": "^8.16.0",
    "drizzle-orm": "^0.44.1",
    "dotenv": "^16.5.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.31.1",
    "tsx": "^4.19.4",
    "@types/express": "4.x",
    "@types/node": "^22.15.29",
    "@types/pg": "^8.15.2"
  }
}
```

### 💡 Key Learning Points

**JWT Token Structure:**
```
JWT = header.payload.signature

Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsIm5hbWUiOiJKb2huIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

Decoded:
- Header: { "alg": "HS256", "typ": "JWT" }
- Payload: { "id": "123", "name": "John" }
- Signature: Cryptographic hash of header + payload
```

**Auth Token Pattern:**
```javascript
// Signup
1. Client sends { email, password }
2. Server hashes password with salt
3. Server stores hash in database
4. Server creates JWT token with user ID
5. Server returns token to client

// Authenticated Request
1. Client sends request with "Authorization: Bearer <token>"
2. Server validates JWT signature
3. Server extracts user ID from token payload
4. Server checks if user exists in database
5. Server processes request
```

**Drizzle ORM (Type-Safe SQL):**
```javascript
// Traditional SQL:
SELECT * FROM users WHERE email = $1

// Drizzle ORM:
const user = await db
  .select()
  .from(usersTable)
  .where(eq(usersTable.email, email));
// Type-safe, prevents SQL injection
```

**Docker Compose for PostgreSQL:**
```yaml
services:
  postgres:
    image: postgres:latest
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: auth_db
    ports:
      - "5432:5432"
```

---

## 11. node-mongo

### 📋 What & Why
**Purpose:** MongoDB integration using Mongoose ORM. Learn database schema design and password hashing with crypto module.

### 🔍 How It Works

**Project Structure:**
```
node-mongo/
├── index.js                 (Server setup)
├── connection.js            (MongoDB connection)
├── models/
│   └── user.model.js       (User schema)
├── routes/
│   └── user.routes.js      (Auth endpoints)
├── middlewares/
│   └── auth.middleware.js  (JWT validation)
└── package.json
```

**connection.js** - Database Connection:
```javascript
import mongoose from 'mongoose';

export const connectMongoDB = async (connectionURL) => {
  const connection = await mongoose.connect(connectionURL);
  return connection;
  // Connection URL format:
  // mongodb://username:password@host:port/database
  // Or for MongoDB Atlas cloud: mongodb+srv://...
};
```

**models/user.model.js** - User Schema:
```javascript
import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // No duplicate emails
    },
    password: {
      type: String,
      required: true,
      // Note: Should be hashed before storing
    },
    salt: {
      type: String,
      required: true,
      // Random value used in password hashing
    },
  },
  { timestamps: true } // Auto-adds createdAt, updatedAt
);

export const User = model('user', userSchema);
export default User;
```

**index.js** - Server Setup:
```javascript
import 'dotenv/config';
import express from 'express';
import { connectMongoDB } from './connection.js';
import userRouter from './routes/user.routes.js';
import { authMiddleware } from './middlewares/auth.middleware.js';

const app = express();
const PORT = process.env.PORT ?? 8000;

// Connect to MongoDB
connectMongoDB(process.env.MONGODB_URL).then(() =>
  console.log(`MongoDB Connected`)
);

app.use(express.json());
app.use(authMiddleware);

app.use('/user', userRouter); // Login/Signup endpoints

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
```

**routes/user.routes.js** - Authentication (Conceptual):
```javascript
// Signup flow:
1. User sends { name, email, password }
2. Generate random salt (randomBytes)
3. Hash password: HMAC_SHA256(password + salt)
4. Store { name, email, hashedPassword, salt } in MongoDB
5. Create JWT token with userId
6. Return token to user

// Login flow:
1. User sends { email, password }
2. Find user in MongoDB by email
3. Retrieve stored salt
4. Hash provided password with salt: HMAC_SHA256(password + salt)
5. Compare with stored hash
6. If match: Create JWT token and return
7. If no match: Return 401 Unauthorized

// Password never stored in plain text
// Only hash is stored
// Only authenticated users can access /user routes
```

### 📦 Packages Used
```json
{
  "dependencies": {
    "express": "4.x",
    "mongoose": "^8.15.1",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.5.0"
  },
  "devDependencies": {
    "@types/express": "4.x",
    "@types/node": "^22.15.29"
  }
}
```

### 💡 Key Learning Points

**MongoDB vs SQL:**
| Feature    | MongoDB             | SQL (PostgreSQL) |
| ---------- | ------------------- | ---------------- |
| Schema     | Flexible (Document) | Rigid (Table)    |
| Query      | JavaScript-like     | SQL language     |
| Scaling    | Horizontal          | Vertical         |
| Data Model | JSON documents      | Rows/Columns     |

**Mongoose Schema:**
```javascript
const schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const Model = model('collection_name', schema);
```

**HMAC-SHA256 Password Hashing:**
```javascript
// Pseudo-code
import crypto from 'crypto';

function hashPassword(password, salt) {
  return crypto
    .createHmac('sha256', salt)
    .update(password)
    .digest('hex');
}

// Generate random salt
const salt = crypto.randomBytes(16).toString('hex');

// Hash password
const hash = hashPassword('myPassword123', salt);

// Store: { email, hash, salt } in database
// When user logs in:
const inputHash = hashPassword(inputPassword, salt);
if (inputHash === storedHash) {
  // Passwords match!
}
```

**Timestamps Auto-Management:**
```javascript
{ timestamps: true }
// Automatically adds:
// createdAt: When document was created
// updatedAt: When document was last modified
```

---

## 12. project-url-shortner

### 📋 What & Why
**Purpose:** Full-stack production-level URL shortening service. Combines all learned concepts: JWT auth, PostgreSQL with Drizzle ORM, validation, password hashing, and micro-services architecture.

**Real-world Features:**
- ✅ User registration and login with password hashing
- ✅ JWT token-based authentication
- ✅ Create shortened URLs with custom or auto-generated codes
- ✅ Redirect to original URL via short code
- ✅ User isolation (users can only manage their own URLs)
- ✅ Database validation with Zod schemas
- ✅ PostgreSQL with Drizzle ORM (type-safe)

### 🔍 How It Works

**Project Structure:**
```
project-url-shortner/
├── index.js                           (Server setup)
├── db/
│   └── index.js                      (Drizzle configuration)
├── models/
│   ├── user.model.js                 (User table schema)
│   └── url.model.js                  (URL table schema)
├── routes/
│   ├── user.routes.js                (Login/Signup)
│   └── url.routes.js                 (URL CRUD)
├── middlewares/
│   └── auth.middleware.js            (JWT validation)
├── services/
│   └── user.service.js               (Database queries)
├── utils/
│   ├── hash.js                       (Password hashing)
│   ├── token.js                      (JWT creation/validation)
│   └── error.js                      (Error handling)
├── validation/
│   ├── request.validation.js         (Zod schemas)
│   └── token.validation.js           (JWT payload schema)
├── docker-compose.yml                (PostgreSQL container)
├── drizzle.config.js                 (ORM config)
└── package.json
```

**models/user.model.js** - User Table:
```javascript
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  salt: varchar('salt', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
});
```

**models/url.model.js** - URL Table:
```javascript
import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { usersTable } from './user.model.js';

export const urlsTable = pgTable('urls', {
  id: uuid().primaryKey().defaultRandom(),
  
  shortCode: varchar('code', { length: 155 }).notNull().unique(),
  // Example: "abc123" for https://example.com/abc123
  
  targetURL: text('target_url').notNull(),
  // Original URL: https://github.com/some/very/long/url/to/repo
  
  userId: uuid('user_id')
    .references(() => usersTable.id) // Foreign key
    .notNull(),
  // Links URL to user who created it
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
});
```

**index.js** - Server Setup:
```javascript
import 'dotenv/config';
import express from 'express';
import { authenticationMiddleware } from './middlewares/auth.middleware.js';
import userRouter from './routes/user.routes.js';
import urlRouter from './routes/url.routes.js';

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());
app.use(authenticationMiddleware); // Attach user to req if token provided

app.get('/', (req, res) => {
  return res.json({ status: 'Server is up and running...' });
});

app.use('/user', userRouter);  // Public: /user/signup, /user/login
app.use(urlRouter);            // All URL routes

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
```

**middlewares/auth.middleware.js** - JWT Validation:
```javascript
import { validateUserToken } from '../utils/token.js';

export function authenticationMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) return next(); // No token = continue

  if (!authHeader.startsWith('Bearer'))
    return res.status(400).json({ error: 'Authorization header must start with Bearer' });

  // Extract token: "Bearer <token>" → <token>
  const [_, token] = authHeader.split(' ');

  const payload = validateUserToken(token);

  // Attach user to request object
  req.user = payload;
  next();
}

export function ensureAuthenticated(req, res, next) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'You must be logged in to access this resource' });
  }
  next();
}
```

**routes/url.routes.js** - URL Shortening API:
```javascript
import express from 'express';
import { shortenPostRequestBodySchema } from '../validation/request.validation.js';
import { nanoid } from 'nanoid'; // Generate short codes
import { db } from '../db/index.js';
import { urlsTable } from '../models/index.js';
import { ensureAuthenticated } from '../middlewares/auth.middleware.js';
import { and, eq } from 'drizzle-orm';

const router = express.Router();

// POST /shorten - Create shortened URL (Authenticated)
router.post('/shorten', ensureAuthenticated, async function (req, res) {
  // Validate request body with Zod
  const validationResult = await shortenPostRequestBodySchema.safeParseAsync(
    req.body
  );

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error });
  }

  const { url, code } = validationResult.data;

  // Use provided code or generate 6-char code
  const shortCode = code ?? nanoid(6);

  // Insert into database
  const [result] = await db
    .insert(urlsTable)
    .values({
      shortCode,
      targetURL: url,
      userId: req.user.id, // Attach to logged-in user
    })
    .returning({
      id: urlsTable.id,
      shortCode: urlsTable.shortCode,
      targetURL: urlsTable.targetURL,
    });

  return res.status(201).json({
    id: result.id,
    shortCode: result.shortCode,
    targetURL: result.targetURL,
  });
});

// GET /codes - Get all URLs created by user (Authenticated)
router.get('/codes', ensureAuthenticated, async function (req, res) {
  const codes = await db
    .select()
    .from(urlsTable)
    .where(eq(urlsTable.userId, req.user.id)); // Only user's URLs

  return res.json({ codes });
});

// DELETE /:id - Delete URL (Authenticated)
router.delete('/:id', ensureAuthenticated, async function (req, res) {
  const id = req.params.id;
  
  // Delete only if user owns the URL
  await db
    .delete(urlsTable)
    .where(and(
      eq(urlsTable.id, id),
      eq(urlsTable.userId, req.user.id) // Prevent other users from deleting
    ));

  return res.status(200).json({ deleted: true });
});

// GET /:shortCode - Redirect to original URL (Public)
router.get('/:shortCode', async function (req, res) {
  const code = req.params.shortCode;

  // Find URL by short code
  const [result] = await db
    .select({
      targetURL: urlsTable.targetURL,
    })
    .from(urlsTable)
    .where(eq(urlsTable.shortCode, code));

  if (!result) {
    return res.status(404).json({ error: 'Invalid URL' });
  }

  // Redirect to original URL
  return res.redirect(result.targetURL);
});

export default router;
```

**utils/hash.js** - Password Hashing:
```javascript
import crypto from 'crypto';

export function createUserHash(password, salt) {
  return crypto
    .createHmac('sha256', salt)
    .update(password)
    .digest('hex');
}

// In signup: 
// const salt = crypto.randomBytes(16).toString('hex');
// const hashedPassword = createUserHash(password, salt);
// store { email, hashedPassword, salt }
```

**utils/token.js** - JWT Token Management:
```javascript
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const tokenPayloadSchema = z.object({
  id: z.string(),
  email: z.string().email(),
});

export function generateUserToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET
  );
}

export function validateUserToken(token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return tokenPayloadSchema.parse(decoded);
}
```

**validation/request.validation.js** - Request Schemas:
```javascript
import { z } from 'zod';

export const signupRequestBodySchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be 8+ chars'),
});

export const loginRequestBodySchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string(),
});

export const shortenPostRequestBodySchema = z.object({
  url: z.string().url('Invalid URL'),
  code: z.string().optional(), // User can provide custom code
});
```

**routes/user.routes.js** - Signup/Login (Conceptual):
```javascript
// POST /user/signup
1. Validate { email, password } with Zod
2. Check if email already exists in database
3. Generate random salt
4. Hash password: HMAC_SHA256(password + salt)
5. Insert into users table: { email, hashedPassword, salt }
6. Create JWT token with user ID
7. Return token to client

// POST /user/login
1. Validate { email, password } with Zod
2. Find user by email in database
3. Retrieve stored salt
4. Hash provided password with salt
5. Compare with stored hash
6. If match: Create JWT and return
7. If no match: Return 401 Unauthorized
```

### 📦 Packages Used
```json
{
  "dependencies": {
    "express": "4.x",
    "jsonwebtoken": "^9.0.2",
    "pg": "^8.16.0",
    "drizzle-orm": "^0.44.2",
    "dotenv": "^16.5.0",
    "nanoid": "^5.1.5",        // Generate short codes
    "zod": "^3.25.56"          // Schema validation
  },
  "devDependencies": {
    "drizzle-kit": "^0.31.1",
    "tsx": "^4.19.4",
    "@types/express": "4.x",
    "@types/node": "^22.15.30",
    "@types/pg": "^8.15.4"
  }
}
```

### 💡 Key Learning Points

**Architecture Pattern:**
```
Client Request
    ↓
Express Middleware (authenticationMiddleware)
    ↓
Route Handler
    ↓
Validation (Zod)
    ↓
Business Logic
    ↓
Database Query (Drizzle ORM)
    ↓
Response
```

**Data Flow - Creating Shortened URL:**
```
User (logged in with JWT token)
    ↓
POST /shorten { url: "...", code: "optional" }
    ↓
authenticationMiddleware validates JWT → req.user = { id, email }
    ↓
shortenPostRequestBodySchema validates request body
    ↓
nanoid(6) generates short code if not provided
    ↓
db.insert() → PostgreSQL inserts URL with userId
    ↓
Return { id, shortCode, targetURL }
```

**Data Flow - Public Redirect:**
```
User clicks shortened link
    ↓
GET /abc123
    ↓
db.select() → PostgreSQL finds URL by shortCode
    ↓
res.redirect(originalURL)
    ↓
Browser redirects to original URL
```

**Security Features:**
- ✅ Passwords hashed with HMAC-SHA256 + random salt
- ✅ JWT tokens with secret key verification
- ✅ User isolation (users can only manage their own data)
- ✅ Input validation with Zod schemas
- ✅ Database constraints (unique emails, unique short codes)
- ✅ Type-safe queries with Drizzle ORM (prevents SQL injection)

**Nanoid for Short Codes:**
```javascript
import { nanoid } from 'nanoid';

nanoid(6) // Generates: "abc123" (random 6-char string)
// Characters: A-Z, a-z, 0-9, _, -
// 64^6 = 68 billion possible combinations
// Very low collision chance
```

**Zod Validation Benefits:**
```javascript
const schema = z.object({
  url: z.string().url(),
  code: z.string().optional(),
});

// If request doesn't match schema:
// {
//   error: {
//     issues: [
//       { path: ['url'], message: 'Invalid url' }
//     ]
//   }
// }
```

---

## 📊 Learning Progression Summary

### Phase 1: Fundamentals (hello-world → 01-modules)
- Learn Node.js basics
- Understand async/sync operations
- Master file system operations

### Phase 2: Module System (modules)
- Create reusable code
- Export/import patterns
- CommonJS vs ES Modules

### Phase 3: HTTP Servers (http-server → 03-http)
- Build servers from scratch
- Route requests by URL/method
- Log requests

### Phase 4: Express Framework (01-express → express-book-store)
- Learn Express syntax
- Middleware concept
- CRUD operations
- Error handling

### Phase 5: Authentication (authentication-01 → authentication-session)
- Token-based auth
- JWT (JSON Web Tokens)
- Password hashing
- Session management

### Phase 6: Database Integration (node-mongo → project-url-shortner)
- MongoDB + Mongoose
- PostgreSQL + Drizzle ORM
- Data validation
- User isolation

---

## 🚀 Key Concepts Reference

### HTTP Methods
- **GET:** Retrieve data (safe, idempotent)
- **POST:** Create new resource (not idempotent)
- **PUT/PATCH:** Update existing resource
- **DELETE:** Remove resource

### Status Codes
- **2xx:** Success (200 OK, 201 Created)
- **4xx:** Client error (400 Bad Request, 404 Not Found, 401 Unauthorized)
- **5xx:** Server error (500 Internal Server Error)

### Middleware Flow
```
app.use(middleware1) ← Executes for every request
app.use(middleware2) ← Executes after middleware1
app.use(middleware3)
app.get('/route', handler) ← Route handler
```

### Password Security
```
Plain Password: "MySecurePass123"
    ↓ (generate random salt)
Salt: "a1b2c3d4e5f6g7h8"
    ↓ (HMAC-SHA256)
Hash: "5e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b"
    ↓ (store in database)
Database: { email, hash, salt }
```

### JWT Token Structure
```
Header.Payload.Signature

Header: Algorithm (HS256) and Token Type (JWT)
Payload: User data (id, email, roles)
Signature: HMAC(Header + Payload, secret)

Benefits:
✅ Stateless (no server-side storage)
✅ Self-contained (all info in token)
✅ Secure (signature verification)
✅ Portable (can use across services)
```

---

## 📚 Project Difficulty Progression

```
Difficulty Level (easy → hard)

1. hello-world          ⭐
2. 01-modules           ⭐⭐
3. modules              ⭐⭐
4. http-server          ⭐⭐
5. 02-http              ⭐⭐⭐
6. 03-http              ⭐⭐⭐
7. 01-express           ⭐⭐⭐
8. express-book-store   ⭐⭐⭐⭐
9. authentication-01    ⭐⭐⭐⭐
10. authentication-session ⭐⭐⭐⭐⭐
11. node-mongo          ⭐⭐⭐⭐⭐
12. project-url-shortner ⭐⭐⭐⭐⭐⭐
```

---

## 🎓 What You've Learned

✅ **Fundamentals:** Node.js runtime, JavaScript execution environment  
✅ **File System:** Async/sync file operations, error handling  
✅ **HTTP:** Server creation, request/response cycle, routing  
✅ **Express:** Framework basics, routing, middleware  
✅ **CRUD:** Create, Read, Update, Delete operations  
✅ **Authentication:** Token-based auth, JWT, password hashing  
✅ **Databases:** MongoDB (Mongoose), PostgreSQL (Drizzle ORM)  
✅ **Security:** Password hashing, token validation, user isolation  
✅ **Validation:** Zod schemas, input verification  
✅ **Architecture:** Modular code, separation of concerns  

---

## 🔗 Running the Projects

### Basic Projects (No dependencies)
```bash
cd hello-world
node script.js
```

### Projects with npm
```bash
cd 01-modules
npm install
node index.js
```

### Express Projects
```bash
cd express-book-store
npm install
npm start
```

### Database Projects
```bash
cd project-url-shortner
npm install
docker-compose up -d  # Start PostgreSQL
npm run db:push       # Run migrations
npm run dev           # Start server
```

---

## 📝 Notes

- **In-Memory vs Database:** Early projects use in-memory storage (arrays, objects). Later projects use real databases.
- **Async/Await:** Some files use callbacks, others use async/await. Both are valid JavaScript patterns.
- **Password Storage:** NEVER store passwords in plain text. Always hash them.
- **Environment Variables:** Use `.env` files for secrets (API keys, database URLs, JWT secret).
- **Type Safety:** Consider using TypeScript for larger projects (Drizzle provides good support).

---

## 🚀 Next Steps

After mastering these projects:
1. Add database validation with constraints
2. Implement rate limiting for APIs
3. Add email verification for signup
4. Implement password reset flow
5. Add role-based access control (RBAC)
6. Create comprehensive tests with Jest
7. Deploy to production (Vercel, Heroku, AWS)
8. Add caching with Redis
9. Implement pagination for large datasets
10. Create API documentation with Swagger/OpenAPI

---

**Happy Learning! 🎉**
