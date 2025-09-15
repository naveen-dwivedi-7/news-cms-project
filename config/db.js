// db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
   const mongoose = require("mongoose");

    mongoose.connect("mongodb://127.0.0.1:27017/mydb");

    console.log("✅ MongoDB Connected...");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Stop app if DB fails
  }
};

module.exports = connectDB;
