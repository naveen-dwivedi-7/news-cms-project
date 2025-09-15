// db.js
const mongoose = require("mongoose");

const uri = "mongodb+srv://dwivedinaveen34_db_user:6wHBVxHPGbfUZJeU@news.n2jeaby.mongodb.net/news?retryWrites=true&w=majority&appName=news";

async function connectDB() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Mongoose connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // exit if connection fails
  }
}

module.exports = connectDB;
