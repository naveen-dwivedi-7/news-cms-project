const jwt = require('jsonwebtoken');

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.redirect('/admin/');

    const tokenData = jwt.verify(token, process.env.JWT_SECRET);

    req.role = tokenData.role;
    req.fullname = tokenData.fullname;

    // Make role available in all EJS templates
    res.locals.role = req.role;
    res.locals.fullname = req.fullname;

    next();
  } catch (error) {
    res.status(401).send('Unauthorized: Invalid token');
  }
};

module.exports = isLoggedIn;
