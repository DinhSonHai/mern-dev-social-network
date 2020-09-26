const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');

const User = require('../models/User');
const config = require('config');
const { errorHandler } = require('../helpers/dbErrorHandling');
const { getMaxListeners } = require('../models/User');

class UsersController {
  // [GET] /api/users
  index(req, res, next) {
    res.send('Users API');
  }

  //[POST] /api/users
  async register(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email: email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200', //size
        r: 'pg', //rating
        d: 'mm', //default
      });

      // user = new User({
      //   name,
      //   email,
      //   avatar,
      //   password,
      // });

      // Encrypt password
      //const salt = await bcrypt.genSalt(10);

      //user.password = await bcrypt.hash(password, salt);

      //user = await user.save();

      //Return jsonwebtoken
      const payload = {
        user: {
          name,
          email,
          avatar,
          password,
        },
      };

      const token = jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 }
        // (err, token) => {
        //   if (err) throw err;
        //   res.json({ token });
        // }
      );

      //Email
      //step 1
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.NODEMAILER_EMAIL,
          pass: process.env.NODEMAILER_PASS,
        },
      });

      const content = `
        <h1>Please click this link to activate your account</h1>
        <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
        <hr/>
        <p>This email contain sensitive info</p>
        <p>${process.env.CLIENT_URL}</p>
      `;

      //step 2
      const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: 'Account activation link',
        html: content,
      };

      //step 3
      transporter
        .sendMail(mailOptions)
        .then(() => {
          return res.json({ message: `An email has been sent to ${email}` });
        })
        .catch((err) => {
          return res.status(400).json({
            error: errorHandler(err),
          });
        });
      //res.send(user._id);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }

  //[POST] /api/users/activation
  async activation(req, res, next) {
    const { tokenActivate } = req.body;
    if (tokenActivate) {
      //Verify the token is valid or not expired
      try {
        const decoded = jwt.verify(tokenActivate, config.get('jwtSecret'));

        const { name, email, avatar, password } = decoded.user;

        // See if user exists
        let user = await User.findOne({ email: email });

        if (user) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Account already activate' }] });
        }

        user = new User({
          name,
          email,
          avatar,
          password,
        });

        //Encrypt password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        console.log(name, email, avatar, user.password);

        await user.save();

        console.log(user._id);

        const payload = {
          user: {
            id: user._id,
          },
        };

        const token = jwt.sign(
          payload,
          config.get('jwtSecret'),
          { expiresIn: 360000 },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      } catch (err) {
        return res.status(401).json({ msg: 'Token is not valid' });
      }
    }
  }
}

module.exports = new UsersController();
