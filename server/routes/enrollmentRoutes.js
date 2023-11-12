const router = require('express').Router();
const { enrollInCourse, getEnrolledCourses, updateEnrollment, enrolledCourseDetails, toggleLike, toggleDislike } = require('../controllers/enrollmentController.js');

router.get('/:studentId', getEnrolledCourses);
router.get('/:studentId/:courseId', enrolledCourseDetails);
router.post('/:studentId/:courseId', enrollInCourse);
router.put('/status/:studentId/:courseId', updateEnrollment);
router.post('/toggle-like/:studentId/:courseId', toggleLike);
router.post('/toggle-dislike/:studentId/:courseId', toggleDislike);
module.exports = router;