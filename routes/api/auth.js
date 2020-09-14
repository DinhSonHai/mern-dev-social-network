const express = require('express');
const router = express.Router();
const auth = require('../../app/middlewares/auth');
const { check, validationResult } = require('express-validator');

const AuthController = require('../../app/controllers/AuthController');

router.get('/', auth, AuthController.index);

router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  AuthController.login
);

module.exports = router;
