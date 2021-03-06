const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
const fetch = require('node-fetch');

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

        await user.save();

        return res.json({ msg: 'Account activated ' });

        // console.log(user._id);

        // const payload = {
        //   user: {
        //     id: user._id,
        //   },
        // };

        // const token = jwt.sign(
        //   payload,
        //   config.get('jwtSecret'),
        //   { expiresIn: 360000 },
        //   (err, token) => {
        //     if (err) throw err;
        //     res.json({ token });
        //   }
        // );
      } catch (err) {
        return res.status(401).json({ msg: 'Token is not valid' });
      }
    }
  }

  //[POST] /api/users/forget
  async forget(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email: email });

      if (!user) {
        return res.status(400).json({
          errors: [{ msg: 'Account with that email does not exist' }],
        });
      }

      //Return jsonwebtoken
      const payload = {
        user: {
          id: user._id,
        },
      };

      const token = jwt.sign(payload, config.get('jwtSecret'), {
        expiresIn: '10m',
      });

      await user.updateOne({
        resetPasswordLink: token,
      });

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
      <h1>Please click this link to reset your password</h1>
      <p>${process.env.CLIENT_URL}/users/reset/${token}</p>
      <hr/>
      <p>This email contain sensitive info</p>
      <p>${process.env.CLIENT_URL}</p>
    `;

      //step 2
      const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: 'Password Reset link',
        html: content,
      };

      //step 3
      transporter
        .sendMail(mailOptions)
        .then(() => {
          return res.json({ msg: `An email has been sent to ${email}` });
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

  //[POST] /api/users/reset
  async reset(req, res, next) {
    const { password, resetPasswordLink } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (resetPasswordLink) {
      try {
        const decoded = jwt.verify(resetPasswordLink, config.get('jwtSecret'));
        let user = await User.findOne({ resetPasswordLink });

        const updatedField = {
          resetPasswordLink: '',
        };

        //Encrypt password
        const salt = await bcrypt.genSalt(10);

        updatedField.password = await bcrypt.hash(password, salt);

        if (user) {
          user = await User.findOneAndUpdate(
            { resetPasswordLink },
            { $set: updatedField },
            { new: true }
          );
          return res.json({ msg: 'Your password has been changed' });
        }
      } catch (err) {
        return res.status(401).json({ msg: 'Token is not valid' });
      }
    }
  }

  //[POST] /api/users/googlelogin
  async googleLogin(req, res, next) {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT);
    const { idToken } = req.body;
    try {
      //Verify token
      const response = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT,
      });
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        let user = await User.findOne({ email });
        if (user) {
          const payload = {
            user: {
              id: user._id,
            },
          };
          const token = jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 360000,
          });
          return res.json({ token });
        } else {
          // Get users gravatar
          const avatar = gravatar.url(email, {
            s: '200', //size
            r: 'pg', //rating
            d: 'mm', //default
          });
          const password = email + config.get('jwtSecret');
          user = new User({
            name,
            email,
            avatar,
            password,
          });
          //Encrypt password
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);
          await user.save();
          const payload = {
            user: {
              id: user._id,
            },
          };
          const token = jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 360000,
          });
          return res.json({ token });
        }
      } else {
        return res
          .status(400)
          .json({ error: 'Google login failed. Try again' });
      }
    } catch (err) {
      res.status(500).json({ msg: 'Google token' });
    }
  }

  //[POST] /api/users/facebooklogin
  async facebookLogin(req, res, next) {
    const { userID, accessToken } = req.body;
    console.log(userID, accessToken);

    const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

    return fetch(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((response) => {
        const { email, name } = response;
        User.findOne({ email }).exec((err, user) => {
          if (err) res.json(err);
          if (user) {
            const payload = {
              user: {
                id: user._id,
              },
            };
            const token = jwt.sign(payload, config.get('jwtSecret'), {
              expiresIn: 360000,
            });
            return res.json({ token });
          } else {
            //   // Get users gravatar
            const avatar = gravatar.url(email, {
              s: '200', //size
              r: 'pg', //rating
              d: 'mm', //default
            });
            const password = email + config.get('jwtSecret');
            user = new User({
              name,
              email,
              avatar,
              password,
            });
            //   //Encrypt password
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(password, salt, (err, result) => {
                user.password = result;
              });
            });
            user.save((err, user) => {
              const payload = {
                user: {
                  id: user._id,
                },
              };
              const token = jwt.sign(payload, config.get('jwtSecret'), {
                expiresIn: 360000,
              });
              return res.json({ token });
            });
          }
        });
      })
      .catch((error) => {
        res.json({
          error: 'Facebook login failed. Try later',
        });
      });
  }
}

module.exports = new UsersController();
