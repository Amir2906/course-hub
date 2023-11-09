const router = require('express').Router();
const { enrollInCourse, getEnrolledCourses, updateEnrollment, enrolledCourseDetails } = require('../controllers/enrollmentController.js');

router.get('/:studentId', getEnrolledCourses);
router.get('/:studentId/:courseId', enrolledCourseDetails);
router.post('/:studentId/:courseId', enrollInCourse);
router.put('/status/:studentId/:courseId', updateEnrollment)

module.exports = router;