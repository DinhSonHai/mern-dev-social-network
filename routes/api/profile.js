const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../app/middlewares/auth');
const ProfileController = require('../../app/controllers/ProfileController');

// @route GET api/profile
// @desc Get all profiles
// @access Public
router.get('/', ProfileController.index);

// @route DELETE api/profile
// @desc delete profile, user & posts
// @access Private
router.delete('/', auth, ProfileController.delete);

// @route GET api/profile/user/:user_id
// @desc Get profile by id
// @access Public
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

// @route GET api/profile/me
// @desc Get current user profile
// @access Private
router.get('/me', auth, ProfileController.getByJWT);

// @route PUT api/profile/experience
// @desc Get profile experience
// @access Private
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

// @route DELETE api/profile/experience/:exp_id
// @desc Delete experience from profile
// @access Private
router.delete('/experience/:exp_id', auth, ProfileController.deleteExperience);

module.exports = router;
