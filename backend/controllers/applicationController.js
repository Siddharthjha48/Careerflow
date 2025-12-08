import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/emailService.js';

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (User only)
export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const applicantId = req.user._id;

    // Check if job exists
    const job = await Job.findById(jobId).populate('createdBy');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({ job: jobId, applicant: applicantId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Create Application
    const application = await Application.create({
      job: jobId,
      applicant: applicantId,
      recruiter: job.createdBy._id,
    });

    // Create Notification for Recruiter
    await Notification.create({
      recipient: job.createdBy._id,
      message: `New application received for ${job.position} from ${req.user.name}`,
      type: 'application_received',
      relatedId: application._id,
    });

    // Send Email to Recruiter
    await sendEmail({
      to: job.createdBy.email, // Assuming User model has email
      subject: `New Application: ${job.position}`,
      text: `You have received a new application for ${job.position} from ${req.user.name}.`,
      html: `<p>You have received a new application for <strong>${job.position}</strong> from <strong>${req.user.name}</strong>.</p>`,
    });

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    console.error('Apply Error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get applications (for user or recruiter)
// @route   GET /api/applications
// @access  Private
export const getApplications = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'recruiter') {
      query = { recruiter: req.user._id };
    } else {
      query = { applicant: req.user._id };
    }

    const applications = await Application.find(query)
      .populate('job', 'company position jobLocation status')
      .populate('applicant', 'name email resume')
      .sort('-createdAt');

    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update application status
// @route   PATCH /api/applications/:id/status
// @access  Private (Recruiter only)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    const application = await Application.findById(applicationId)
      .populate('job')
      .populate('applicant');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (req.user._id.toString() !== application.recruiter.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    // Notification for Applicant
    await Notification.create({
      recipient: application.applicant._id,
      message: `Your application for ${application.job.position} at ${application.job.company} is now ${status}`,
      type: 'status_change',
      relatedId: application._id,
    });

    // Email to Applicant
    await sendEmail({
      to: application.applicant.email,
      subject: `Application Update: ${application.job.position}`,
      text: `Your application status has been updated to: ${status}`,
      html: `<p>Your application for <strong>${application.job.position}</strong> has been updated to: <strong>${status}</strong>.</p>`,
    });

    res.status(200).json({ message: 'Status updated', application });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get Analytics
// @route   GET /api/applications/analytics
// @access  Private
export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;
    let stats = {};

    if (role === 'recruiter') {
      // Recruiter Stats
      const totalJobs = await Job.countDocuments({ createdBy: userId });
      const totalApplications = await Application.countDocuments({ recruiter: userId });

      const statusBreakdown = await Application.aggregate([
        { $match: { recruiter: userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      stats = {
        totalJobs,
        totalApplications,
        statusBreakdown,
      };
    } else {
      // User Stats
      const totalApplications = await Application.countDocuments({ applicant: userId });

      const statusBreakdown = await Application.aggregate([
        { $match: { applicant: userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      stats = {
        totalApplications,
        statusBreakdown,
      };
    }

    res.status(200).json({ stats });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get Notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id }).sort('-createdAt');
    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Mark notification read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markNotificationRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.status(200).json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
