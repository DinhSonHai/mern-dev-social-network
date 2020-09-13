class ProfileController {
  // [GET] /api/profile
  index(req, res, next) {
    res.send('Profile API');
  }
}

module.exports = new ProfileController();
