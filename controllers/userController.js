const userModel = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createError = require("http-errors");

// Render login page
const loginPage = async (req, res) => {
  res.render('admin/login', { layout: false });
};

// Handle login
const adminLogin = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // 1️⃣ Find user
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(401).send("Invalid username or password");
    }

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid username or password");
    }

    // 3️⃣ Generate JWT token
    const token = jwt.sign(
      { id: user._id, fullname: user.fullname, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 4️⃣ Save token in httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1h
    });

    // 5️⃣ Redirect to dashboard
    return res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

// Logout
const logout = async (req, res) => {
  res.clearCookie('token');
  res.redirect('/admin/');
};

// Dashboard
const dashboard = async (req, res) => {
  res.render('admin/dashboard', { role: req.role });
};

// Settings page
const settings = async (req, res) => {
  res.render("admin/settings");
};

// List all users
const allUser = async (req, res) => {
  const users = await userModel.find();
  res.render('admin/users', { users, role: req.role});
};

// Add user page
const addUserPage = async (req, res) => {
  res.render('admin/users/create', {role: req.role });
};

// Create user
const addUser = async (req, res) => {
  const { fullname, username, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  await userModel.create({
    fullname,
    username,
    password: hashedPassword,
    role,
  });

  res.redirect('/admin/users');
};

// Edit user page
const updateUserPage = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).send('User Not Found');
    }
    res.render('admin/users/update', { user, role: req.role });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Update user
const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const { fullname, password, role } = req.body;

  try {
    const user = await userModel.findById(id);
    if (!user) {
      return next(createError(404, 'User not found'));
    }

    user.fullname = fullname || user.fullname;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    user.role = role || user.role;

    await user.save();

    res.redirect('/admin/users');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Delete user
const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await userModel.findByIdAndDelete(id);
    if (!user) {
      return next(createError(404, 'User not found'));
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  loginPage,
  adminLogin,
  logout,
  dashboard,
  allUser,
  addUserPage,
  addUser,
  updateUserPage,
  updateUser,
  deleteUser,
  settings
};
