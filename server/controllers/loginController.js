const Student = require('../models/Student')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    // console.log(req.body);
    if (!email || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    try {
        // Find the student by their email
        const student = await Student.findOne({ email });

        if (!student) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the stored hash
        const passwordMatch = await bcrypt.compare(password, student.password);

        if (passwordMatch) {
            // Generate an access token
            const accessToken = jwt.sign(
                { id: student.id, email: student.email },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );

            // Set the token as an HTTP-only cookie
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: true,
            });
            
            res.status(201).json({ message: 'Logged in successfully', token: accessToken, id: student.id, generatedAt: Date.now() });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { handleLogin };