const mongoose=require("mongoose")


const DB = "mongodb+srv://jugal786:jugal786@cluster0.sgg8t.mongodb.net/ones?retryWrites=true&w=majority";
// const DB = process.env.DATABASE; // Correct usage

async function connectDB() {
  try {
    if (!DB) {
      throw new Error("Database URL not provided. Please set the DATABASE environment variable.");
    }
    console.log("Connecting to MongoDB...");
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1); // Exit process if DB connection fails
  }
}


module.exports = connectDB;