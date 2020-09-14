const express = require('express');
const router = express.Router();
const auth = require('../../app/middlewares/auth');

const AuthController = require('../../app/controllers/AuthController');

router.get('/', auth, AuthController.index);

module.exports = router;
