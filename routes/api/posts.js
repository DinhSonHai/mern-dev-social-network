const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../app/middlewares/auth');
const PostsController = require('../../app/controllers/PostsController');

// @route   GET api/posts
// @desc    Get all post
// @access  Public
router.get('/', PostsController.index);

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  PostsController.create
);

module.exports = router;
