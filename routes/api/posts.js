const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../app/middlewares/auth');
const PostsController = require('../../app/controllers/PostsController');

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, PostsController.index);

// @route   GET api/posts/:id
// @desc    Get post by Id
// @access  Private
router.get('/:id', auth, PostsController.getById);

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  PostsController.create
);

module.exports = router;
