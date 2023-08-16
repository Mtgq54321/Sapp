const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');

exports.registerUser = async (req, res) => {
  try {
    const { username, password, email, pfp } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ username, password: hashedPassword, email, pfp});
    await user.save();
    res.status(201).send('User registered successfully.');
  } catch (error) {
    res.status(500).send('Error registering user.');
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send('User not found.');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid password.');

    const token = jwt.sign({ _id: user._id }, 'your-secret-key');
    res.header('Authorization', token).send('Logged in successfully.');
  } catch (error) {
    res.status(500).send('Error logging in.');
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found.');
    res.send(user);
  } catch (error) {
    res.status(500).send('Error fetching user.');
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, password, pfp } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, password: hashedPassword, pfp },
      { new: true }
    );

    if (!updatedUser) return res.status(404).send('User not found.');
    res.send(updatedUser);
  } catch (error) {
    res.status(500).send('Error updating user.');
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).send('User not found.');
    res.send('User deleted successfully.');
  } catch (error) {
    res.status(500).send('Error deleting user.');
  }
};