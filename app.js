// app.js
const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const cookieParser=require('cookie-parser');
const flash=require('connect-flash');
require("dotenv").config();

const connectDB = require("./config/db"); // ✅ use db.js instead of inline mongoose
// const userRoutes = require("./routes/userRoutes"); // ✅ your MVC routes

const app = express();

// Middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for form submissions
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts);
app.use(cookieParser());
app.set("layout", "layout");
// after you set up sessions / authentication middleware
// app.use((req, res, next) => {
//   res.locals.user = req.user || null; // available in all EJS templates
//   next();
// });

// View Engine
app.set("view engine", "ejs");

// Database Connection
connectDB(); // ✅ connects once when app starts

// Routes
// app.use("/api/users", userRoutes); // ✅ MVC user routes (register, login, get users)

// Admin routes (with admin layout)
app.use("/admin", (req, res, next) => {
  res.locals.layout = "admin/layout";
  next();
});
// Make logged-in user available in all EJS templates
// app.use((req, res, next) => {
//   res.locals.user = req.session.user || null; // or req.user if using Passport
//   next();
// });

app.use("/admin", require("./routes/admin"));

// Frontend routes
app.use("/", require("./routes/frontend"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
