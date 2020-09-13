const express = require('express');
const router = express.Router();

const UsersController = require('../../app/controllers/UsersController');

router.get('/', UsersController.index);

module.exports = router;
