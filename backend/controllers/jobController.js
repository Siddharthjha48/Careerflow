import Job from '../models/Job.js';
import mongoose from 'mongoose';

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Not authorized to create jobs' });
    }
    req.body.createdBy = req.user._id;
    const job = await Job.create(req.body);
    res.status(201).json({ job });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Private
const getAllJobs = async (req, res) => {
  try {
    console.log('User:', req.user._id, 'Role:', req.user.role);
    let query = {};
    // If user is a recruiter, only show their jobs
    if (req.user.role === 'recruiter') {
      query = { createdBy: req.user._id };
    }
    console.log('Query:', query);
    // If user is a regular user (seeker), show ALL jobs (query remains empty)

    const jobs = await Job.find(query).sort('-createdAt');
    console.log('Jobs found:', jobs.length);
    res.status(200).json({ jobs, count: jobs.length });
  } catch (error) {
    console.error('Error in getAllJobs:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update job
// @route   PATCH /api/jobs/:id
// @access  Private
const updateJob = async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Not authorized to update jobs' });
    }

    const {
      body: { company, position },
      user: { _id: userId },
      params: { id: jobId },
    } = req;

    if (company === '' || position === '') {
      return res.status(400).json({ message: 'Company or Position fields cannot be empty' });
    }

    const job = await Job.findByIdAndUpdate(
      { _id: jobId, createdBy: userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ message: `No job with id ${jobId}` });
    }

    res.status(200).json({ job });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Not authorized to delete jobs' });
    }

    const {
      user: { _id: userId },
      params: { id: jobId },
    } = req;

    const job = await Job.findByIdAndDelete({
      _id: jobId,
      createdBy: userId,
    });

    if (!job) {
      return res.status(404).json({ message: `No job with id ${jobId}` });
    }

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export { createJob, getAllJobs, updateJob, deleteJob };
