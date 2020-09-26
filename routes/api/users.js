const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const UsersController = require('../../app/controllers/UsersController');
const { validRegister } = require('../../app/helpers/valid');

router.get('/', UsersController.index);

router.post('/', validRegister, UsersController.register);
router.post('/activation', UsersController.activation);

module.exports = router;
