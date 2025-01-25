# Full Stack Application - Monitoring HTTP Responses

This repository contains a full-stack application that monitors HTTP responses, stores them in a database, and displays the data in real-time through a frontend dashboard. It utilizes Node.js, Express, MongoDB, React, Vite, Redux, and Socket.io for real-time communication. The backend periodically pings an external API, stores the responses, and broadcasts new data to clients connected to the frontend.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
   - [Backend](#backend)
   - [Frontend](#frontend)
3. [Setup Instructions](#setup-instructions)
4. [CI/CD Pipeline](#cicd-pipeline)
5. [Testing Strategy](#testing-strategy)
6. [Future Improvements](#future-improvements)
7. [Assumptions and Decisions](#assumptions-and-decisions)
8. [Technologies Used](#technologies-used)
9. [License](#license)

---

## Overview

This application is designed to monitor HTTP responses by periodically sending requests to a remote endpoint (`httpbin.org/anything`) every 5 minutes. It stores the responses in a MongoDB database and provides an API to fetch historical data. The frontend, built with React and Vite, displays this data in real-time.

---

## Architecture

### Backend

The backend consists of a Node.js application using Express for the REST API, MongoDB as the database, and Socket.io for broadcasting real-time data. It follows the Service, DAO, and Controller pattern:

- **Service**: Handles core business logic like fetching data from external APIs.
- **DAO (Data Access Object)**: Handles direct interaction with the database.
- **Controller**: Responsible for managing HTTP requests and interacting with services.

#### Backend Features:
1. **Pinging httpbin.org**: A service that sends requests to the `httpbin.org/anything` endpoint every 5 minutes.
2. **Data Storage**: Stores the JSON response data in MongoDB.
3. **Real-time Updates**: Uses Socket.io to broadcast new data to the frontend.
4. **Historical Data**: Provides an API to retrieve the stored data.

#### Backend Directory Structure:

backend/ ├── src/ │ ├── controllers/ # Request handlers │ ├── services/ # Core business logic │ ├── dao/ # Data access layer │ ├── models/ # Mongoose models │ ├── routes/ # API routes │ └── server.ts # Main entry point ├── package.json ├── tsconfig.json └── .env # Environment variables

csharp
Copy
Edit

### Frontend

The frontend is a React application built with Vite, showcasing a dashboard that displays response data in a tabular format and supports real-time updates using WebSockets.

#### Frontend Features:
1. **Dashboard**: Displays the response data.
2. **Real-Time Updates**: Uses Socket.io to receive live updates as new data is fetched.
3. **State Management**: Uses Redux for global state management.

#### Frontend Directory Structure:

frontend/ ├── src/ │ ├── components/ # React components │ ├── redux/ # Redux store, actions, reducers │ ├── App.tsx # Main React component │ ├── index.tsx # React entry point ├── package.json ├── tsconfig.json └── vite.config.ts # Vite config

yaml
Copy
Edit

---

## Setup Instructions

### Prerequisites:
1. **Node.js**: Make sure you have Node.js installed (preferably the version mentioned in `.nvmrc` or `package.json`).
2. **MongoDB**: Ensure MongoDB is running locally or use a cloud-based MongoDB service.

### Backend Setup:
1. Navigate to the backend directory:
   ```bash
   cd backend
Install dependencies:
bash
Copy
Edit
npm install
Start the backend in development mode:
bash
Copy
Edit
npm run dev
Frontend Setup:
Navigate to the frontend directory:
bash
Copy
Edit
cd frontend
Install dependencies:
bash
Copy
Edit
npm install
Start the frontend in development mode:
bash
Copy
Edit
npm run dev
Once both servers are running, the frontend will be available at http://localhost:3000, and the backend at http://localhost:5000.

CI/CD Pipeline
The project uses GitHub Actions for continuous integration and deployment.

CI/CD Workflow:
Frontend Job:

Installs dependencies.
Runs linting, tests, and coverage reports.
Deploys to the Vercel platform.
Backend Job:

Installs dependencies.
Runs linting, tests, and coverage reports.
Deploys to the Render platform.
Example GitHub Actions Workflow:
yaml
Copy
Edit
name: CI/CD Pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v2
      - name: Install Dependencies (Frontend)
        working-directory: ./frontend
        run: |
          npm install
      - name: Run Linting (Frontend)
        working-directory: ./frontend
        run: |
          npm run lint
      - name: Run Tests (Frontend)
        working-directory: ./frontend
        run: |
          npm run test:coverage
      - name: Deploy to Vercel (Frontend)
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-params: "--prod"

  backend:
    runs-on: ubuntu-latest
    needs: frontend
    steps:
      - name: Checkout Code
        uses: actions/checkout@v2
      - name: Install Dependencies (Backend)
        working-directory: ./backend
        run: |
          npm install
      - name: Run Linting (Backend)
        working-directory: ./backend
        run: |
          npm run lint
      - name: Run Tests (Backend)
        working-directory: ./backend
        run: |
          npm run test:coverage
      - name: Deploy to Render (Backend)
        uses: render-examples/deploy-render-action@v0.0.1
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
Testing Strategy
Core Components to Test:
Backend: The core functionality of the backend is ensuring data is fetched from the external API and stored correctly in the database. Unit tests for service and DAO layers and integration tests for the /api/data endpoint are important.
Frontend: Testing the real-time updates on the dashboard and ensuring data is displayed correctly.
Testing Tools:
Backend: Jest for unit and integration testing.
Frontend: Jest and React Testing Library for component testing.
Future Improvements
Error Handling: Implement more comprehensive error handling on both the backend and frontend.
Database Indexing: Optimize MongoDB queries by implementing proper indexing for historical data.
Frontend Improvements: Add pagination to the data table for better handling of large datasets.
Assumptions and Decisions
The backend is designed to ping an external API at regular intervals (every 5 minutes). This frequency can be modified as needed.
Socket.io is used for real-time updates because it provides simple and effective communication between the frontend and backend.
MongoDB was chosen as the database for ease of integration and flexibility with JSON data.
Technologies Used
Backend: Node.js, Express, MongoDB, TypeScript, Jest, Socket.io
Frontend: React, Vite, Redux, TypeScript, Jest
CI/CD: GitHub Actions, Vercel (Frontend), Render (Backend)
License
This project is licensed under the MIT License - see the LICENSE file for details.

sql
Copy
Edit

This is your full `README.md` documentation that you can copy and paste into your project. Make sure to replace any placeholders or secret keys with actual values where applicable.






