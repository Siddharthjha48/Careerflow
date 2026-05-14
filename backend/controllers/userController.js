import User from '../models/User.js';

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
