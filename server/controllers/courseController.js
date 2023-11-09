const Course = require('../models/Course');

module.exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.json(courses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.getCourseDetails = async (req, res) => {
    const courseId = req.params.courseId;

    try {
        // Find the course by ID
        const course = await Course.findOne({ id: courseId });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Return course details as JSON response
        res.json(course);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports.coursePagination = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Calculate the offset based on the page and limit
        const offset = (page - 1) * limit;

        const courses = await Course.find()
            .skip(offset)
            .limit(limit)
            .exec();

        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};