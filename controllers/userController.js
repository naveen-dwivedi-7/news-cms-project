const userModel = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createError = require("http-errors");
const newsModel = require('../models/News');
const categoryModel = require('../models/Category');
const settingModel = require('../models/Setting');
const fs = require('fs')
const { validationResult } = require('express-validator')


// Render login page
const loginPage = async (req, res) => {
  res.render('admin/login',{
    layout: false,
    errors: 0
  })
};

// Handle login
const adminLogin = async (req, res, next) => {
   const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return res.status(400).json({ errors: errors.array() });
    return res.render('admin/login',{
      layout: false,
      errors: errors.array()
    })
  }
  const { username, password } = req.body;

  try {
    // 1️⃣ Find user
    const user = await userModel.findOne({ username });
    if (!user) {
        return next(createError('Invalid username or password', 401));    }

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return next(createError('Invalid username or password', 401));    }

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
  try {
    let articleCount;
    if (req.role == 'author') {
      articleCount = await newsModel.countDocuments({ author: req.id });
    } else {
      articleCount = await newsModel.countDocuments();
    }

    const categoryCount = await categoryModel.countDocuments();
    const userCount = await userModel.countDocuments();

    res.render('admin/dashboard', {
      role: req.role,
      fullname: req.fullname,
      articleCount,
      categoryCount,
      userCount
    });
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error');

  }
};

// Settings page
const settings = async (req, res) => {
try {
    const settings = await settingModel.findOne() || {};
// res.render("admin/settings", { role: req.role, settings });
    res.render('admin/settings', { role: req.role , settings})
  } catch (error) {
    console.error(error)
  }
};


 const saveSettings = async (req, res, next) => {
   const { website_title, footer_description } = req.body;
  const website_logo = req.file?.filename;

  try {
    let setting = await settingModel.findOne();
    if(!setting){
      setting = new settingModel();
    }
    setting.website_title = website_title;
    setting.footer_description = footer_description;

    if(website_logo){
      if(setting.website_logo){
        const logoPath = `./public/uploads/${setting.website_logo}`;
        if (fs.existsSync(logoPath)) {
          fs.unlinkSync(logoPath);
        }
      }
      setting.website_logo = website_logo;
    }

    await setting.save();
    res.redirect('/admin/settings');
  } catch (error) {
    console.error(error)
    // res.status(500).send('Internal Server Error');
    next(error);

  }
}
// List all users
const allUser = async (req, res) => {
  const users = await userModel.find();
  res.render('admin/users', { users, role: req.role });
};

// Add user page
const addUserPage = async (req, res) => {
  res.render('admin/users/create' , { role: req.role, errors: 0 })
};

// Create user
const addUser = async (req, res) => {
  const errors = validationResult(req); 
   if (!errors.isEmpty()) {
    return res.render('admin/users/create',{
      role: req.role,
      errors: errors.array()
    })
  }
  await userModel.create(req.body)
  res.redirect('/admin/users')
};

// Edit user page
const updateUserPage = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await userModel.findById(id);
    if (!user) {
        return next(createError('User not found', 404));
    }
    res.render('admin/users/update', { user , role:req.role, errors:0 })
  } catch (error) {
    // res.status(500).send('Internal Server Error');
    next(error);

  }
};

// Update user
const updateUser = async (req, res, next) => {
  const id = req.params.id;

   const errors = validationResult(req); 
   if (!errors.isEmpty()) {
    return res.render('admin/users/update',{
      user:req.body,
      role: req.role,
      errors: errors.array()
    })
  }
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
     // res.status(500).send('Internal Server Error');
    next(error);

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
    // res.status(500).send('Internal Server Error');
    next(error);

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
  settings,
  saveSettings
};
