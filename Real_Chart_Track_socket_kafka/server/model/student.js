const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
  },
  shortId: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Register = mongoose.model("Live", studentSchema);

module.exports = Register;