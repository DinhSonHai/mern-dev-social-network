const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../app/middlewares/auth');
const ProfileController = require('../../app/controllers/ProfileController');

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', ProfileController.index);

// @route   DELETE api/profile
// @desc    Delete profile, user & posts
// @access  Private
router.delete('/', auth, ProfileController.delete);

// @route   GET api/profile/user/:user_id
// @desc    Get profile by id
// @access  Public
router.get('/user/:user_id', ProfileController.getById);

// @route   POST api/profile
// @desc    Create user profile
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skill is required').not().isEmpty(),
    ],
  ],
  ProfileController.update
);

// @route   GET api/profile/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, ProfileController.getByJWT);

// @route   PUT api/profile/experience
// @desc    Get profile experience
// @access  Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  ProfileController.addExperience
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', auth, ProfileController.deleteExperience);

// @route   PUT api/profile/education
// @desc    Get profile education
// @access  Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldofstudy', 'Field of study is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  ProfileController.addEducation
);

// @route   DELETE api/profile/education/:exp_id
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:edu_id', auth, ProfileController.deleteEducation);

// @route   GET api/profile/github/:username
// @desc    GET user repos from Github
// @access  Public
router.get('/github/:username', ProfileController.getRepos);

module.exports = router;
