const express = require('express');
const router = express.Router();
const auth = require('../../app/middlewares/auth');
// const { check, validationResult } = require('express-validator');

const AuthController = require('../../app/controllers/AuthController');
const { validLogin } = require('../../app/helpers/valid');

router.get('/', auth, AuthController.index);

router.post('/', validLogin, AuthController.login);

module.exports = router;
