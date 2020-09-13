class UsersController {
  // [GET] /api/users
  index(req, res, next) {
    res.send('Users API');
  }
}

module.exports = new UsersController();
