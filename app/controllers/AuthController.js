class AuthController {
  // [GET] /api/auth
  index(req, res, next) {
    res.send('Auth API');
  }
}

module.exports = new AuthController();
