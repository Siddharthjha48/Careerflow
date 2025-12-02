import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Job from './models/Job.js';
import bcrypt from 'bcrypt';

dotenv.config();

const jobs = [
  {
    company: 'Google',
    position: 'Frontend Engineer',
    status: 'interview',
    jobType: 'full-time',
    jobLocation: 'Bangalore, KA',
  },
  {
    company: 'Netflix',
    position: 'Senior UI Engineer',
    status: 'pending',
    jobType: 'remote',
    jobLocation: 'Mumbai, MH',
  },
  {
    company: 'Microsoft',
    position: 'Full Stack Developer',
    status: 'offer',
    jobType: 'full-time',
    jobLocation: 'Hyderabad, TS',
  },
  {
    company: 'Airbnb',
    position: 'Software Engineer, Product',
    status: 'declined',
    jobType: 'full-time',
    jobLocation: 'Gurgaon, HR',
  },
  {
    company: 'Spotify',
    position: 'Web Developer',
    status: 'pending',
    jobType: 'remote',
    jobLocation: 'Remote (India)',
  },
  {
    company: 'Apple',
    position: 'iOS Developer',
    status: 'interview',
    jobType: 'full-time',
    jobLocation: 'Hyderabad, TS',
  },
  {
    company: 'Amazon',
    position: 'SDE II',
    status: 'pending',
    jobType: 'full-time',
    jobLocation: 'Bangalore, KA',
  },
  {
    company: 'Meta',
    position: 'React Engineer',
    status: 'pending',
    jobType: 'remote',
    jobLocation: 'Gurgaon, HR',
  },
  {
    company: 'Tesla',
    position: 'Software Engineer',
    status: 'interview',
    jobType: 'full-time',
    jobLocation: 'Pune, MH',
  },
  {
    company: 'Twitter',
    position: 'Frontend Developer',
    status: 'pending',
    jobType: 'remote',
    jobLocation: 'Bangalore, KA',
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // Create a recruiter user
    const recruiterEmail = 'admin11@gmail.com';
    let recruiter = await User.findOne({ email: recruiterEmail });

    if (!recruiter) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('123', salt);
      recruiter = await User.create({
        name: 'Recruiter Admin',
        email: recruiterEmail,
        password: hashedPassword,
        role: 'recruiter',
      });
      console.log('Created recruiter user: admin11@gmail.com / 123');
    } else {
      console.log('Using existing recruiter user:', recruiterEmail);
    }

    // Delete existing jobs created by this recruiter (optional, to avoid dupes if run multiple times)
    await Job.deleteMany({ createdBy: recruiter._id });

    // Add jobs
    const jobsWithUser = jobs.map((job) => ({
      ...job,
      createdBy: recruiter._id,
    }));

    await Job.insertMany(jobsWithUser);
    console.log('Jobs seeded successfully!');

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
