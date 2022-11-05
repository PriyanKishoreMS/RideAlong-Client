const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const auth = require('../../middleware/auth');

// @route   GET api/profile/
// @desc    Create or update user profile
// @access  Private

router.post('/', auth, async (req, res) => {
  const ProfileFields = {};
  ProfileFields.user = req.user.id;
  const {
    dob,
    location,
    mobile,
    college,
    vehicleType,
    vehicleNumber,
    vehicleModel,
  } = req.body;

  if (dob) ProfileFields.dob = dob;
  if (location) ProfileFields.location = location;
  if (mobile) ProfileFields.mobile = mobile;
  if (college) ProfileFields.college = college;
  if (vehicleType) ProfileFields.vehicleType = vehicleType;
  if (vehicleNumber) ProfileFields.vehicleNumber = vehicleNumber;
  if (vehicleModel) ProfileFields.vehicleModel = vehicleModel;

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
    const profile = await Profile.find().populate('user', ['name', 'email']);
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

module.exports = router;
