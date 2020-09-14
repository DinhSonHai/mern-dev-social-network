const Profile = require('../models/Profile');
const User = require('../models/User');

class ProfileController {
  // @route GET api/profile/me
  // @desc Get current user profile
  // @access Private
  async getById(req, res, next) {
    try {
      const profile = await Profile.findOne({
        user: req.user.id,
      }).populate('User', ['name', 'avatar']);

      if (!profile) {
        return res
          .status(400)
          .json({ msg: 'There is no profile for this user' });
      }
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
}

module.exports = new ProfileController();
