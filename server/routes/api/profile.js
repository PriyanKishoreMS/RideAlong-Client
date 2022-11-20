const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile');
const Ride = require('../../models/Ride');
const auth = require('../../middleware/auth');

// @route   GET api/profile/
// @desc    Create or update user profile
// @access  Private

router.post('/', auth, async (req, res) => {
  const ProfileFields = {};
  ProfileFields.user = req.user.id;

  const standardFields = [
    'name',
    'dob',
    'location',
    'mobile',
    'college',
    'vehicleType',
    'vehicleNumber',
    'vehicleModel',
  ];

  standardFields.forEach(field => {
    if (req.body[field]) ProfileFields[field] = req.body[field];
  });

  try {
    let profile = await Profile.findOne({user: req.user.id});

    if (profile) {
      profile = await Profile.findOneAndUpdate(
        {user: req.user.id},
        {$set: ProfileFields},
        {new: true},
      );

      return res.json(profile);
    }

    profile = new Profile(ProfileFields);

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

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
    const profile = await Profile.find({
      name: {$regex: search, $options: 'i'},
      user: {$ne: req.user.id},
    })
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit)
      .populate('user', ['email', 'photoURL']);

    const total = await Profile.countDocuments({
      name: {$regex: search, $options: 'i'},
    });
    const totalPages = Math.ceil(total / limit);

    const response = {
      page: page + 1,
      limit,
      total,
      totalPages,
      profile,
    };

    res.status(200).json(response);

    // const profile = await Profile.find()
    //   .populate('user', ['name', 'photoURL'])
    //   .sort({date: -1});
    // res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'photoURL', 'following']);
    console.log(profile, 'profile from profile/me');

    if (!profile) {
      return res.status(400).json({msg: 'There is no profile for this user'});
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// get following profiles
router.get('/following', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'photoURL', 'following']);

    const following = profile.user.following;
    const followingProfiles = await Profile.find({
      user: {$in: following},
    }).populate('user', ['name', 'photoURL']);

    res.json(followingProfiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// get followers profiles
router.get('/followers', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'photoURL', 'following']);

    const followers = profile.user.followers;
    const followersProfiles = await Profile.find({
      user: {$in: followers},
    }).populate('user', ['name', 'photoURL']);

    res.json(followersProfiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// get single profile by id
router.get('/:id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.id,
    }).populate('user', [
      'name',
      'photoURL',
      'email',
      'following',
      'followers',
    ]);

    const rides = await Ride.find({user: req.params.id}).sort({date: 1});

    if (!profile) {
      return res.status(400).json({msg: 'Profile not found'});
    }

    const response = {
      profile,
      rides,
    };

    res.json(response);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({msg: 'Profile not found'});
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
