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

// @route   DELETE api/posts/:id
// @desc    Delete post by Id
// @access  Private
router.delete('/:id', auth, PostsController.deleteById);

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  PostsController.create
);

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id', auth, PostsController.like);

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:id', auth, PostsController.unlike);

// @route   POST api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.post(
  '/comment/:id',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  PostsController.comment
);

module.exports = router;
