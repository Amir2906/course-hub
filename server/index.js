require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();
const courseRoutes = require('./routes/courseRoutes.js');
const studentRoutes = require('./routes/studentRoutes.js');
const enrollmentRoutes = require('./routes/enrollmentRoutes.js');
const loginRoutes = require('./routes/loginRoutes.js')
const logoutRoute = require('./routes/logout')
const verifyJWT = require('./middleware/verifyJWT.js')

app.use(cors());

// built in middleware to handle urlencoded data
// in other words, form data
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

mongoose
    .connect(process.env.DATABASE_URI)
    .then(() => {
        console.log(`app is connected to database`);
    })
    .catch(err => {
        console.log({message: err.message});
    })

app.use('/api/login', loginRoutes);
app.use('/api/logout', logoutRoute);

app.use(verifyJWT);
app.use('/api/student', studentRoutes);
app.use('/api/enroll', enrollmentRoutes)
app.use('/api/courses', courseRoutes);

app.listen(process.env.PORT, console.log(`server running on port ${process.env.PORT}`));
