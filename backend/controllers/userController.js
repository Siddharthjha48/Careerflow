import User from '../models/User.js';
import { GoogleGenAI } from '@google/genai';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

import { parseResumeFromUrl } from '../utils/resumeParser.js';

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      let parsedData = null;

      if (req.file) {
        user.resume = req.file.path;
        
        // Use AI to extract skills, experience, and bio from the new resume
        parsedData = await parseResumeFromUrl(user.resume);
      }

      // If AI extracted data, overwrite empty fields or append, 
      // otherwise fallback to manual body input or existing data.
      if (parsedData) {
         user.bio = req.body.bio || parsedData.bio || user.bio;
         user.skills = req.body.skills || parsedData.skills || user.skills;
         user.experience = req.body.experience || parsedData.experience || user.experience;
      } else {
         user.bio = req.body.bio || user.bio;
         user.skills = req.body.skills || user.skills;
         user.experience = req.body.experience || user.experience;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        experience: updatedUser.experience,
        resume: updatedUser.resume,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Generate AI Cover Letter
// @route   POST /api/users/cover-letter
// @access  Private
export const generateCoverLetter = async (req, res) => {
  try {
    const { jobTitle, companyName, jobDescription } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'Gemini API key is missing' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
      You are an expert career coach writing a professional and highly tailored cover letter.
      
      Candidate's Profile:
      Name: ${user.name}
      Bio: ${user.bio || 'Not provided'}
      Skills: ${user.skills || 'Not provided'}
      Experience: ${user.experience || 'Not provided'}

      Job Applying For:
      Job Title: ${jobTitle}
      Company Name: ${companyName}
      Job Description: ${jobDescription}

      Please write a persuasive, well-structured cover letter for this candidate applying to this job. 
      The cover letter should highlight how the candidate's skills and experience match the job description.
      Do not include placeholder address headers. Start directly with the greeting, like "Dear Hiring Manager," or "Dear ${companyName} Team,", and end with "Sincerely, ${user.name}".
    `;

    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    res.json({ coverLetter: result.text.trim() });
  } catch (error) {
    console.error('Error generating cover letter:', error);
    res.status(500).json({ message: 'Failed to generate cover letter', error: error.message });
  }
};
