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

    // Add ride to user's ridesCreated
    const user = await User.findOneAndUpdate(
      {_id: req.user.id},
      {$push: {ridesCreated: ride._id}},
      {new: true},
    );
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

// passenger requests to join ride
router.patch('/passenger/:id', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (ride.user.toString() === req.user.id) {
      return res.status(400).json({msg: 'You cannot join your own ride'});
    }

    // check if user has already requested to join ride
    if (
      ride.passengers.filter(
        passenger => passenger.user.toString() === req.user.id,
      ).length > 0
    ) {
      return res.status(400).json({
        msg: 'User already requested to join ride',
      });
    }
    ride.passengers.push({user: req.user.id, status: 1});
    await ride.save();
    res.json(ride);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//approve passenger request
router.patch('/passenger/:id/:passengerId/approve', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    // get passenger index
    const passengerIndex = ride.passengers
      .map(passenger => passenger.user.toString())
      .indexOf(req.params.passengerId);

    ride.passengers[passengerIndex].status = 2;
    await ride.save();
    res.json(ride);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// reject passenger request by removing passenger from ride
router.patch('/passenger/:id/:passengerId/reject', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    // get passenger index
    const passengerIndex = ride.passengers
      .map(passenger => passenger.user.toString())
      .indexOf(req.params.passengerId);

    ride.passengers.splice(passengerIndex, 1);
    await ride.save();
    res.json(ride);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
