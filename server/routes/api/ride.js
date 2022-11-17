const express = require('express');
const router = express.Router();
const Ride = require('../../models/Ride');
const auth = require('../../middleware/auth');

// @route   POST api/ride/
// @desc    Create or update user ride
// @access  Private

router.post('/', auth, async (req, res) => {
  const RideFields = {};
  RideFields.user = req.user.id;

  const standardFields = [
    'active',
    'source',
    'destination',
    'date',
    'time',
    'seats',
    'price',
    'vehicleType',
    'vehicleNumber',
    'vehicleModel',
    'description',
  ];

  standardFields.forEach(field => {
    if (req.body[field]) RideFields[field] = req.body[field];
  });

  try {
    let ride = await Ride.findOne({user: req.user.id});

    ride = new Ride(RideFields);
    await ride.save();
    res.json(ride);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  POST api/ride/:id
// @desc   Update ride
// @access Private

// @route   GET api/ride/
// @desc    Get all rides
// @access  Public

router.get('/', async (req, res) => {
  try {
    const rides = await Ride.find()
      .sort({date: 1})
      .populate('user', ['name', 'photoURL']);
    res.json(rides);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
