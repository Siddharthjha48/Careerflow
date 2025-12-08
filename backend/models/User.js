import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['recruiter', 'user'],
    default: 'user',
  },
  bio: {
    type: String,
    default: '',
  },
  skills: {
    type: String,
    default: '',
  },
  experience: {
    type: String,
    default: '',
  },
  resume: {
    type: String,
    default: '',
  },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
