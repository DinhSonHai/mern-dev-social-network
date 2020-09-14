const User = require('../models/User');

class AuthController {
  // [GET] /api/auth
  async index(req, res, next) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error!');
    }
  }
}

module.exports = new AuthController();
