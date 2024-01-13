const router = require('express').Router();
const { addStudent } = require('../controllers/studentController');

router.post('/add', addStudent);

module.exports = router;