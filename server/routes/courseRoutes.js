const router = require('express').Router();
const { getAllCourses, getCourseDetails, coursePagination, searchCourses } = require('../controllers/courseController');

router.get('/', getAllCourses);
router.get('/:courseId', getCourseDetails);
router.get('/pages', coursePagination);
module.exports = router;