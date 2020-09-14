const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../app/middlewares/auth');
const ProfileController = require('../../app/controllers/ProfileController');

// @route GET api/profile
// @desc Get all profiles
// @access Public
router.get('/', ProfileController.index);

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

module.exports = router;
