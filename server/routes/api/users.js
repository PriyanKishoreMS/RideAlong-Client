const express = require('express');
const router = express.Router();
const User = require('../../models/User');
require('dotenv').config();
const secret = process.env.JWT_SECRET;
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

// @route   GET api/users
// @desc    Test route
// @access  Public

// router.get('/', async (req, res) => {
//   let users = await User.find();
//   res.send(users);
// });

try {
  admin.app();
  console.log('Firebase Admin SDK has been initialized');
} catch (error) {
  console.log('Firebase Admin SDK has not been initialized');
}

router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 10;
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
      _id: {$ne: req.user.id},
    })
      .select('name photoURL')
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
      user,
      totalPages,
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
      ' -__v -uid -email -ridesCreated -ridesJoined -date',
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
  const {uid, name, email, photoURL, fcmtoken} = req.body;

  try {
    let user = await User.findOne({email});

    if (user) {
      console.log('User already exists');
      if (user.fcmtoken.indexOf(fcmtoken) === -1) {
        user.fcmtoken.push(fcmtoken);
        await user.save();
        console.log('FCMToken added');
      }
      if (user.photoURL !== photoURL) {
        user.photoURL = photoURL;
        await user.save();
        console.log('photoURL updated');
      }
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

router.delete('/me/fcm', auth, async (req, res) => {
  try {
    // const {fcmtoken} = req.body;
    // await User.findByIdAndUpdate(
    //   req.user.id,
    //   {
    //     $pull: {fcmtoken: fcmtoken},
    //   },
    //   err => {
    //     if (err) console.error(err);
    //     else console.log('FCMToken removed');
    //   },
    // );
    // delete the fcmtoken array
    const user = await User.findById(req.user.id);
    user.fcmtoken = [];
    await user.save();
    res.status(200).json({msg: 'FCMToken removed'});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/me/following', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 10;
    const user = await User.findById(req.user.id);

    const following = user.following;

    const followingProfiles = await User.find({
      _id: {$in: following},
    })
      .select('name photoURL')
      .skip(page * limit)
      .limit(limit);

    const total = await User.countDocuments({
      _id: {$in: following},
    });
    const totalPages = Math.ceil(total / limit);

    res.json({followingProfiles, totalPages});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/me/followers', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 10;
    const user = await User.findById(req.user.id);

    const followers = user.followers;

    const followersProfiles = await User.find({
      _id: {$in: followers},
    })
      .select('name photoURL')
      .skip(page * limit)
      .limit(limit);

    const total = await User.countDocuments({
      _id: {$in: followers},
    });
    const totalPages = Math.ceil(total / limit);

    res.json({followersProfiles, totalPages});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id/following', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 10;
    const user = await User.findById(req.params.id);
    const following = user.following;

    const followingProfiles = await User.find({
      _id: {$in: following},
    })
      .select('name photoURL')
      .skip(page * limit)
      .limit(limit);

    const total = await User.countDocuments({
      _id: {$in: following},
    });
    const totalPages = Math.ceil(total / limit);

    res.json({followingProfiles, totalPages});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id/followers', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 10;
    const user = await User.findById(req.params.id);
    const followers = user.followers;

    const followersProfiles = await User.find({
      _id: {$in: followers},
    })
      .select('name photoURL')
      .skip(page * limit)
      .limit(limit);

    const total = await User.countDocuments({
      _id: {$in: followers},
    });
    const totalPages = Math.ceil(total / limit);

    res.json({followersProfiles, totalPages});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// put request to update home address
router.put('/me/home', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const {lat, lng, desc} = req.body;
    const home = {
      lat,
      lng,
      desc,
    };
    if (!home) {
      return res.status(400).json({msg: 'Please enter a home address'});
    }
    user.home = home;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/me/work', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const {lat, lng, desc} = req.body;
    const work = {
      lat,
      lng,
      desc,
    };
    if (!work) {
      return res.status(400).json({msg: 'Please enter a work address'});
    }
    user.work = work;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.patch('/friend/:id', auth, async (req, res) => {
  try {
    const profile = await User.findById(req.user.id);
    const friendProfile = await User.findById(req.params.id);
    const fcmToken = friendProfile.fcmtoken;

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

      await profile.save();
      await friendProfile.save();
      res.json(profile.following);
    } else {
      profile.following.push(req.params.id);
      friendProfile.followers.push(req.user.id);
      await profile.save();
      await friendProfile.save();
      res.json(profile.following);

      const verifyToken = async token => {
        const message = {
          notification: {
            title: `${profile.name} has added you as a friend`,
            body: `Tap to view ${profile.name}'s profile`,
          },
          data: {
            picture: profile.photoURL,
          },
          token: token,
        };
        const response = await admin.messaging().send(message);
        return response;
      };

      for (let i = 0; i < fcmToken.length; i++) {
        try {
          await verifyToken(fcmToken[i]);
          console.log('Message sent successfully');
        } catch (err) {
          if (
            err.code === 'messaging/registration-token-not-registered' ||
            err.code === 'messaging/invalid-argument'
          ) {
            console.log('Token is invalid');
            friendProfile.fcmtoken = friendProfile.fcmtoken.filter(
              token => token != fcmToken[i],
            );
            await friendProfile.save();
            console.log('Token removed');
          }
        }
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/me/address', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const home = user.home;
    const work = user.work;
    const address = {
      home,
      work,
    };
    res.json(address);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
