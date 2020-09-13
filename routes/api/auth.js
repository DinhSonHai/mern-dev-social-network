const express = require('express');
const router = express.Router();

const AuthController = require('../../app/controllers/AuthController');

router.get('/', AuthController.index);

module.exports = router;
