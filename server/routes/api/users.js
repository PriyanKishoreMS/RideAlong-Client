const express = require('express');
const router = express.Router();
const User = require('../../models/User');
require('dotenv').config();
const secret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

// @route   GET api/users
// @desc    Test route
// @access  Public

router.get('/', async (req, res) => {
  let users = await User.find();
  res.send(users);
});

// @route POST api/users
// @desc Register user
// @access Public

router.post('/', async (req, res) => {
  const {uid, name, email, photoURL} = req.body;

  try {
    let user = await User.findOne({email});

    if (user) {
      console.log('User already exists');
      user = await User.findOneAndUpdate({photoURL}, {new: true});
      console.log('user updated', user);
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, secret, {}, (err, token) => {
        if (err) throw err;
        res.json({token});
        console.log(payload);
      });
    } else {
      user = new User({
        uid,
        name,
        email,
        photoURL,
      });

      await user.save();
      // res.send('User registered');

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, secret, {}, (err, token) => {
        if (err) throw err;
        res.json({token});
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
