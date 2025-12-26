# Inkwell

Inkwell is a full-stack note taking app that helps users add, organize and manage their notes.

## Features:

- User Authentication: Secure signup and login, Persistent session with JWT
- CRUD Operation with Notes: Create, Read, Update and Delete operations for notes
- Organization Features: Ability to pin important notes and add custom tags for better categorization
- Search Option: Ability to search in relation to title, content and tags
- Responsive Design: A responsive UI that works on mobile, tablet and laptop

## Tech Stack:

**Frontend**: React, Vite, TailwindCSS, Axios

- I chose React with Vite because it is faster and efficient to setup than using create-react-app.
- I chose TailwindCSS because it is more customizable and flexible. It also helps to make the website/components responsive in an easy way.

**Backend**: Node.js, Express.js, PostgresSQL, JWT

- I used Node.js and Express.js to make a proper REST API in order to control all the data models, authentication log and API call and requests.
- I used Neon's Serverless PostgreSQL because it has a pretty good free tier and has good features such as automatic scaling and so on. I specifically chose PostgreSQL for its flexibility(to use many datatypes) and ability to support JSON.
- Also, I used the pg library to implement Raw SQL for simplicity and ability to control all the features.
  JWT was used for authentication using a middleware to authenticate every request related to a note model as it is easier and efficient to send data by masking it using the JWT.

**Deployment**: Frontend and Backend both deployed on Render(Static and Web Service), PostgreSQL connected using NEON

- The frontend is deployed as a static site and the backend is deployed as a Web Service on Render for simplicity.

## Project Setup

**Required:**

- Node.js 21+
- PostgresSQL(running locally(databaseCredentials) or a remote instance(connectionString))
- Git

**Setup instructions:**

1.  Clone the repository

    ```bash
    git clone https://github.com/pradhan-bigyan/inkwell.git
    cd inkwell
    ```

2.  Backend Setup

    ```bash
    cd backend
    npm install
    ```

    create a `.env` file in backend and set the keys as:
    `JWT_SECRET="secretKeyHere"`
    `CONNECTION_STRING="connectionStrHere"`
    `PORT=8000` (or any port you want)

3.  Database Setup

    - Create a database
    - Run/Execute the SQL code(in the db/setupDatabase) to create users and notes table

4.  Frontend Setup

    ```bash
    cd ..
    cd frontend
    npm install
    ```

    - update the the baseUrl in axiosInstance if necessary

5.  Run the app
    - Backend: (go to backend directory) `npm start`
    - Frontend: (go to frontend directory) `npm run dev`
    - App will be available at `http://localhost:5173`

The Schema Design for the users and notes tables are in the inkwell/backend/db/schema.sql

The API-documentation for the Inkwell API made using POSTMAN is linked below:
[https://documenter.getpostman.com/view/47219965/2sBXVZpEzb](https://documenter.getpostman.com/view/47219965/2sBXVZpEzb)

**Final Project Structure:**
The overall file structure of the INKWELL project is:
<img src="/projectStructure/projStr.png" width="200" height="auto" alt="main file structure">
<img src="/projectStructure/backendStr.png" width="200" height="auto" alt="backend file structure">
<img src="/projectStructure/frontendStr.png" width="200" height="auto" alt="frontend file structure">

**Notes:**

- Parameterized queries are used to prevent SQL injection and no string concatenations is used.
- Packages such as helemt and express-rate-limiter are used in order to furthur solidify the API security
- Using cors only the localhost url and the url of the site deployed on render are allowed to make request to the API.

This project is licensed under the MIT License.
