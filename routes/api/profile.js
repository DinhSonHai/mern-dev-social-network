const express = require('express');
const router = express.Router();
const auth = require('../../app/middlewares/auth');

const ProfileController = require('../../app/controllers/ProfileController');

// @route GET api/profile/me
// @desc Get current user profile
// @access Private
router.get('/me', auth, ProfileController.getById);

module.exports = router;
