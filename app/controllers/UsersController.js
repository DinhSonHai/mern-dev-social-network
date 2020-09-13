const { check, validationResult } = require('express-validator/check');

class UsersController {
  // [GET] /api/users
  index(req, res, next) {
    res.send('Users API');
  }

  //[POST] /api/users
  create(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    res.send('Users API');
  }
}

module.exports = new UsersController();
