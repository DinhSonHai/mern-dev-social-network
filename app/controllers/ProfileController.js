const Profile = require('../models/Profile');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');

class ProfileController {
  // @route GET api/profile
  // @desc Get all profiles
  // @access Public
  async index(req, res, next) {
    try {
      const profiles = await Profile.find().populate('user', [
        'name',
        'avatar',
      ]);
      res.json(profiles);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }

  // @route DELETE api/profile
  // @desc delete profile, user & posts
  // @access Private
  async delete(req, res, next) {
    try {
      //Remove profile
      await Profile.findOneAndRemove({ user: req.user.id });
      //Remove user
      await User.findOneAndRemove({ _id: req.user.id });

      res.json({ msg: 'User deleted' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }

  // @route GET api/profile/user/user_id
  // @desc Get profile by id
  // @access Public
  async getById(req, res, next) {
    try {
      const profile = await Profile.findOne({
        user: req.params.user_id,
      }).populate('user', ['name', 'avatar']);
      if (!profile) return res.status(400).json({ msg: 'Profile not found' });
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(400).json({ msg: 'Profile not found' });
      }
      res.status(500).send('Server Error');
    }
  }

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
      }).populate('user', ['name', 'avatar']);

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

  // @route PUT api/profile/experience
  // @desc Get profile experience
  // @access Private
  async addExperience(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const newExperience = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExperience);
      profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }

  // @route DELETE api/profile/experience/:exp_id
  // @desc Delete experience from profile
  // @access Private
  async deleteExperience(req, res, next) {
    try {
      const profile = await Profile.findOne({ user: req.user.id });

      //Get remove index
      const removeIndex = profile.experience
        .map((item) => item.id)
        .indexOf(req.params.exp_id);

      profile.experience.splice(removeIndex, 1);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
}

module.exports = new ProfileController();
