const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const UsersController = require('../../app/controllers/UsersController');
const {
  validRegister,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require('../../app/helpers/valid');

router.get('/', UsersController.index);

router.post('/', validRegister, UsersController.register);
router.post('/activation', UsersController.activation);
router.post('/forget', forgotPasswordValidator, UsersController.forget);
router.post('/reset', resetPasswordValidator, UsersController.reset);

router.post('/googlelogin', UsersController.googleLogin);

module.exports = router;
