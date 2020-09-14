const Profile = require('../models/Profile');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');

class ProfileController {
  // @route   POST api/profile
  // @desc    Create user profile
  // @access  Private
  async update(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //Build profile object
    const profileField = {};
    profileField.user = req.user.id;
    if (company) profileField.company = company;
    if (website) profileField.website = website;
    if (location) profileField.location = location;
    if (bio) profileField.bio = bio;
    if (status) profileField.status = status;
    if (githubusername) profileField.githubusername = githubusername;
    if (skills) {
      profileField.skills = skills.split(',').map((skill) => skill.trim());
    }

    //Build social object
    profileField.social = {};
    if (youtube) profileField.social.youtube = youtube;
    if (twitter) profileField.social.twitter = twitter;
    if (facebook) profileField.social.facebook = facebook;
    if (linkedin) profileField.social.linkedin = linkedin;
    if (instagram) profileField.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileField },
          { new: true }
        );
        return res.json(profile);
      }

      //Create
      profile = new Profile(profileField);

      profile = await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }

  // @route   GET api/profile/me
  // @desc    Get current user profile
  // @access  Private
  async getByJWT(req, res, next) {
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
