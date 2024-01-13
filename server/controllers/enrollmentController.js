const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course')
const Student = require('../models/Student')

module.exports.getEnrolledCourses = async (req, res) => {
    const { studentId } = req.params;

    try {
        // Find the student's enrolled courses
        const enrolledCourses = await Enrollment.find({ studentId });

        // Extract the course IDs from the enrollments
        const courseIds = enrolledCourses.map(enrollment => enrollment.courseId);

        // Retrieve course details for the enrolled courses
        const courses = await Course.find(
            { id: { $in: courseIds } },
            { id: 1, name: 1, instructor: 1, thumbnail: 1, duration: 1, syllabus: 1, likes: 1, dislikes: 1 }
        );

        // Prepare the response data with required fields
        const enrolledCourseDetails = enrolledCourses.map(enrollment => {
            const course = courses.find(c => c.id === enrollment.courseId);
            return {
                id: course.id,
                name: course.name,
                instructor: course.instructor,
                thumbnail: course.thumbnail,
                duration: course.duration,
                enrolledAt: enrollment.enrolledAt,
                progress: enrollment.progress,
                isLiked: enrollment.isLiked,
                isDisliked: enrollment.isDisliked,
                status: enrollment.status,
                likes: course.likes,
                dislikes: course.dislikes
            };
        });

        // console.log(enrolledCourseDetails);
        res.json(enrolledCourseDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports.enrollInCourse = async (req, res) => {
    const { studentId, courseId } = req.params;

    try {
        // Check if the enrollment already exists
        const existingEnrollment = await Enrollment.findOne({ studentId, courseId }).exec();
        if (existingEnrollment) {
            return res.status(409).json({ message: 'Student is already enrolled in this course.' });
        }

        const course = await Course.findOne({ id: courseId }).exec();
        if (!course) {
            return res.status(400).json({ message: 'Course id is not valid.' });
        }
        const student = await Student.findOne({ id: studentId }).exec();
        if (!student) {
            return res.status(400).json({ message: 'Student id is not valid.' });
        }
        // Create a new enrollment
        const newEnrollment = new Enrollment({
            studentId,
            courseId
        });

        // Save the enrollment to the database
        await newEnrollment.save();

        res.status(201).json({ message: 'Enrolled successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.updateEnrollment = async (req, res) => {
    const { studentId, courseId } = req.params;

    try {
        // Check if the student is enrolled in the course
        const enrollment = await Enrollment.findOne({ studentId, courseId }).exec();
        if (!enrollment) {
            return res.status(400).json({ message: 'Student is not enrolled in this course.' });
        }

        // Update the enrollment status to 'Completed'
        enrollment.status = 'Completed';
        enrollment.progress = 100;
        await enrollment.save();

        res.json({ message: 'Course marked as completed.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports.enrolledCourseDetails = async (req, res) => {
    const { studentId, courseId } = req.params;

    try {
        // Check if the student is enrolled in the course
        const enrollment = await Enrollment.findOne({ studentId, courseId }).exec();
        if (!enrollment) {
            return res.status(400).json({ message: 'Student is not enrolled in this course.' });
        }

        // If the student is enrolled, fetch the course details
        const course = await Course.findOne({ id: courseId }).exec();
        if (!course) {
            return res.status(400).json({ message: 'Course id is not valid.' });
        }

        // Return the course details to the student's dashboard
        res.json({
            name: course.name,
            instructor: course.instructor,
            duration: course.duration,
            thumbnail: course.thumbnail
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.toggleLike = async (req, res) => {
    const { courseId, studentId } = req.params;
    // console.log(req.params);
    try {
        const enrollment = await Enrollment.findOne({ courseId, studentId });
        // console.log(enrollment);
        if (enrollment.isDisliked) {
            // Remove from disliked courses
            await Enrollment.updateOne({ courseId, studentId }, { isDisliked: false });
            // Update dislikes count in the Course model
            await Course.updateOne({ id: courseId }, { $inc: { dislikes: -1 } });
        }

        await Enrollment.updateOne({ courseId, studentId }, { isLiked: !enrollment.isLiked });
        const update = enrollment.isLiked ? { $inc: { likes: -1 } } : { $inc: { likes: 1 } };
        await Course.updateOne({ id: courseId }, update);

        res.json({ message: `Course liked status updated successfully` });
    } catch (error) {
        console.error('Error toggling like status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports.toggleDislike = async (req, res) => {
    const { courseId, studentId } = req.params;

    try {
        const enrollment = await Enrollment.findOne({ courseId, studentId });

        if (enrollment.isLiked) {
            // Remove from liked courses
            await Enrollment.updateOne({ courseId, studentId }, { isLiked: false });
            // Update likes count in the Course model
            await Course.updateOne({ id: courseId }, { $inc: { likes: -1 } });
        }

        await Enrollment.updateOne({ courseId, studentId }, { isDisliked: !enrollment.isDisliked });
        const update = enrollment.isDisliked ? { $inc: { dislikes: -1 } } : { $inc: { dislikes: 1 } };
        await Course.updateOne({ id: courseId }, update);

        res.json({ message: `Course disliked status updated successfully` });
    } catch (error) {
        console.error('Error toggling dislike status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}