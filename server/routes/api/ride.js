const express = require('express');
const router = express.Router();
const Ride = require('../../models/Ride');
const InactiveRide = require('../../models/InactiveRide');
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const cron = require('node-cron');

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
    'timestamp',
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
      .sort({timestamp: 1})
      .populate('user', ['name', 'photoURL']);
    res.json(rides);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// get all rides by user
router.get('/user', auth, async (req, res) => {
  try {
    const rides = await Ride.find({user: req.user.id})
      .sort({date: 1})
      .populate('user', ['name', 'photoURL', 'following']);
    res.json(rides);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// get all rides of user following
router.get('/following', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const following = user.following;
    const rides = await Ride.find({user: {$in: following}})
      .sort({date: 1})
      .populate('user', ['name', 'photoURL']);
    res.json(rides);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

cron.schedule('0 */12 * * *', async () => {
  try {
    const rides = await Ride.find({timestamp: {$lt: Date.now()}});
    rides.forEach(async ride => {
      const inactiveride = new InactiveRide(ride);
      inactiveride.isNew = true;
      await inactiveride.save();
      await Ride.findByIdAndRemove(ride._id);
    });
    console.log('Rides updated');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
