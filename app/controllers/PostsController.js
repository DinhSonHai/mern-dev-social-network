const { check, validationResult } = require('express-validator');
const Post = require('../models/Post');
const Profile = require('../models/Profile');
const User = require('../models/User');

class PostsController {
  // @route   GET api/posts
  // @desc    Get all post
  // @access  Public
  index(req, res, next) {
    res.send('Posts API');
  }

  // @route   POST api/posts
  // @desc    Create a post
  // @access  Private
  async create(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id);
  }
}

module.exports = new PostsController();
