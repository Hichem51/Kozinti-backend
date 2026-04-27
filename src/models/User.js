const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 80,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password_hash: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: ["admin", "chef", "user"],
    default: "user",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  logged_in_at: {
    type: Date,
    default: null,
  },
});

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password_hash;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
