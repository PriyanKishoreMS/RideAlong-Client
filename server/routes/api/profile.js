const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile');
const auth = require('../../middleware/auth');

// @route   GET api/profile/
// @desc    Create or update user profile
// @access  Private

router.post('/', auth, async (req, res) => {
  const ProfileFields = {};
  ProfileFields.user = req.user.id;

  const standardFields = [
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

router.get('/', async (req, res) => {
  try {
    const profile = await Profile.find().populate('user', [
      'name',
      'email',
      'photoURL',
    ]);
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'photoURL']);
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

// get single profile by id
router.get('/:id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.id,
    }).populate('user', ['name', 'photoURL', 'email']);

    if (!profile) return res.status(400).json({msg: 'Profile not found'});

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({msg: 'Profile not found'});
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;