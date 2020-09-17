const { check, validationResult } = require('express-validator');
const Post = require('../models/Post');
const Profile = require('../models/Profile');
const User = require('../models/User');

class PostsController {
  // @route   GET api/posts
  // @desc    Get all posts
  // @access  Private
  async index(req, res, next) {
    try {
      const posts = await Post.find().sort({ date: -1 });
      res.json(posts);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }

  // @route   GET api/posts/:id
  // @desc    Get post by Id
  // @access  Private
  async getById(req, res, next) {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }
      res.json(post);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Post not found' });
      }
      res.status(500).send('Server Error');
    }
  }

  // @route   DELETE api/posts/:id
  // @desc    Delete post by Id
  // @access  Private
  async deleteById(req, res, next) {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }

      if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }

      await post.remove();
      res.json({ msg: 'Post removed' });
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Post not found' });
      }
      res.status(500).send('Server Error');
    }
  }

  // @route   POST api/posts
  // @desc    Create a post
  // @access  Private
  async create(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      await newPost.save();
      res.json(newPost);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }

  // @route   PUT api/posts/like/:id
  // @desc    Like a post
  // @access  Private
  async like(req, res, next) {
    try {
      const post = await Post.findById(req.params.id);

      //Check if the post has already been like
      if (
        post.likes.filter((like) => like.user.toString() === req.user.id)
          .length > 0
      ) {
        return res.status(404).json({ msg: 'Post already like' });
      }
      post.likes.unshift({ user: req.user.id });
      await post.save();
      res.json(post.likes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }

  // @route   PUT api/posts/unlike/:id
  // @desc    Unlike a post
  // @access  Private
  async unlike(req, res, next) {
    try {
      const post = await Post.findById(req.params.id);

      //Check if the post has already been like
      if (
        post.likes.filter((like) => like.user.toString() === req.user.id)
          .length === 0
      ) {
        return res.status(404).json({ msg: 'Post has not yet been like' });
      }

      //Get remove index
      const removeIndex = post.likes
        .map((like) => like.user.toString())
        .indexOf(req.user.id);
      post.likes.splice(removeIndex, 1);
      await post.save();
      res.json(post.likes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
}

module.exports = new PostsController();
