const bcrypt = require('bcrypt');
const Student = require('../models/Student');

module.exports.addStudent = async (req, res) => {
  // Create a new student document based on the request body
  const { id, name, email, password } = req.body;
  if (!id || !name || !email || !password)
    return res.status(400).json({ 'message': 'All fields are mandatory.' });

  const duplicate = await Student.findOne({ id: id }).exec();
  if (duplicate)
    return res.sendStatus(409); // conflict

  try {
    // encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);
    // create and store store the new user
    const result = await Student.create({
      ...req.body,
      password: hashedPwd
    });
    console.log(result);
    res.status(201).json({ 'success': `New user ${id} created.` })

  } catch (err) {
    res.status(500).json({ 'message': err.message });
  }
}