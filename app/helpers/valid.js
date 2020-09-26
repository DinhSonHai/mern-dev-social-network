const { check } = require('express-validator');

//register
module.exports.validRegister = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail().not().isEmpty(),
  check('password', 'Please enter a password with 6 or more characters')
    .isLength({ min: 6 })
    .matches(/\d/)
    .withMessage('Password must contain a number'),
];

//login
module.exports.validLogin = [
  check('email', 'Please include a valid email').isEmail().not().isEmpty(),
  check('password', 'Please enter a password with 6 or more characters')
    .isLength({ min: 6 })
    .matches(/\d/)
    .withMessage('Password must contain a number'),
];

//forget password
module.exports.forgotPasswordValidator = [
  check('email', 'Please include a valid email').isEmail().not().isEmpty(),
];

//reset password
module.exports.resetPasswordValidator = [
  check('newPassword', 'Please enter a password with 6 or more characters')
    .isLength({ min: 6 })
    .matches(/\d/)
    .withMessage('Password must contain a number'),
];
