const express = require('express');
const router = express.Router();
const User = require('../../models/User');
require('dotenv').config();
const secret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

// @route   GET api/users
// @desc    Test route
// @access  Public

// router.get('/', async (req, res) => {
//   let users = await User.find();
//   res.send(users);
// });

router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 7;
    const search = req.query.search || '';
    let sort = req.query.sort || 'date';

    req.query.sort ? (sort = req.query.sort.split(',')) : (sort = [sort]);

    let sortBy = {};
    if (sort[-1]) {
      sortBy[sort[0]] = sort[-1];
    } else {
      sortBy[sort[0]] = 'desc';
    }

    //don't show the current user's profile
    //
    const user = await User.find({
      name: {$regex: search, $options: 'i'},
      user: {$ne: req.user.id},
    })
      .select('-following -followers -__v -uid -email -date')
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);
    // .populate('user', ['email', 'photoURL']);

    const total = await User.countDocuments({
      name: {$regex: search, $options: 'i'},
    });
    const totalPages = Math.ceil(total / limit);

    const response = {
      page: page + 1,
      limit,
      total,
      totalPages,
      user,
    };

    res.status(200).json(response);

    // const user = await User.find()
    //   .populate('user', ['name', 'photoURL'])
    //   .sort({date: -1});
    // res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      ' -__v -uid -email -date',
    );
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
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

router.get('/me/following', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const following = user.following;

    const followingProfiles = await User.find({
      _id: {$in: following},
    }).select('name photoURL');

    res.json(followingProfiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/me/followers', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const followers = user.followers;

    const followersProfiles = await User.find({
      _id: {$in: followers},
    }).select('name photoURL');

    res.json(followersProfiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.patch('/friend/:id', auth, async (req, res) => {
  try {
    const profile = await User.findById(req.user.id);
    const friendProfile = await User.findById(req.params.id);

    if (profile === friendProfile) {
      return res.status(400).json({msg: 'You cannot add yourself as a friend'});
    }

    if (!friendProfile) {
      return res.status(400).json({msg: 'There is no profile for this user'});
    }

    if (profile.following.includes(req.params.id)) {
      profile.following = profile.following.filter(
        following => following != req.params.id,
      );
      friendProfile.followers = friendProfile.followers.filter(
        follower => follower != req.user.id,
      );
    } else {
      profile.following.push(req.params.id);
      friendProfile.followers.push(req.user.id);
    }

    await profile.save();
    await friendProfile.save();

    res.json(profile.following);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
