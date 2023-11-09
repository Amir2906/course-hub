# Course Hub

Course Hub is a MERN stack web app with Redux and Material-UI, enabling users to discover, enroll in, and track courses. It offers user authentication, personalized dashboards, course details, and search functionality.


## Getting Started

1. **Clone the repository:**

   ```sh
   git clone https://github.com/Amir2906/course-hub.git
   ```
2. **Set up your MongoDB database and provide the connection string.**

    - Make sure you have MongoDB installed and running. 

3. **Backend:**

    ```sh
    $ cd server

    Create a .env file.

    .env file:
       PORT=
       ACCESS_TOKEN_SECRET=
       REFRESH_TOKEN_SECRET=
       DATABASE_URI=
    ```
    Inside the server directory, install dependencies and start the server:

    ```sh
    $ yarn install or npm install
    $ yarn start or npm start
    ```

4. **Frontend:**

    Inside the client directory, install dependencies and start the frontend:
    ```sh
    $ cd client
    $ yarn install or npm install
    $ yarn start or npm start
    ```

## Features

- **User Authentication**: Users can log in and log out securely. Only authenticated users can access their dashboard and enroll in courses.

- **Course Listing**: Explore a vast selection of online courses. Find courses by name, instructor, or keywords.

- **Course Details**: Get in-depth information about each course, including the instructor's name, course description, enrollment status, duration, schedule, location, prerequisites, and a detailed syllabus.

- **Enrollment**: Enroll in your favorite courses, and they will be added to your personal dashboard for easy access.

- **Dashboard**: A personalized dashboard displays all your enrolled courses, including course name, instructor, a course thumbnail, due date, and a progress bar.

- **Mark Courses as Completed**: Track your progress by marking courses as completed directly from your dashboard.

- **Search Courses**: Easily find courses by searching for keywords, course names, or instructor names. The search is case-insensitive and offers advanced filtering options.

- **Responsive Design**: Works well on all devices.

## Tech Stack

- **Frontend**: React, Redux, Material-UI, tailwind

- **Backend**: Node.js, Express.js, MongoDB

- **Authentication**: JSON Web Tokens (JWT)