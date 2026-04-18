# Task Manager Backend API

**Student Name:** Quincy Rasegojwa
**Student Number:** 24019861
**Module:** INFS 202
**Project:** Midterm Backend Project

## Description
A Node.js and Express REST API for the Task Manager application. 
Includes JWT authentication and SQLite database storage.

## Technologies Used
- Node.js
- Express
- SQLite (better-sqlite3)
- JWT (jsonwebtoken)
- bcryptjs
- CORS
- dotenv

## API Endpoints

### Auth
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login and get token

### Tasks (requires JWT token)
- GET /api/tasks - Get all tasks
- GET /api/tasks/:id - Get single task
- POST /api/tasks - Add new task
- PUT /api/tasks/:id - Update task
- DELETE /api/tasks/:id - Delete task
- PATCH /api/tasks/:id/toggle - Toggle complete

## Live URL
https://task-backend-vm0m.onrender.com

## Frontend URL
https://task-frontend-silk-two.vercel.app

## Setup Instructions
1. Clone the repository
2. Run `npm install`
3. Create a `.env` file with JWT_SECRET and PORT
4. Run `node server.js`