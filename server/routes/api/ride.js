const express = require('express');
const router = express.Router();
const Ride = require('../../models/Ride');
const auth = require('../../middleware/auth');

// @route   POST api/ride/
// @desc    Create or update user ride
// @access  Private

router.post('/', auth, async (req, res) => {
  const user = req.user.id;
  const email = req.body.email;

  const rideFields = {};
  rideFields.user = user;
  rideFields.email = email;

  if (req.body.email) rideFields.email = req.body.email;

  try {
    let ride = await Ride.findOne({user});

    if (ride) {
      ride = await Ride.findOneAndUpdate(
        {user},
        {$set: rideFields},
        {new: true},
      );

      return res.json(ride);
    }

    ride = new Ride(rideFields);

    await ride.save();
    res.json(ride);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/ride/:id
// @desc    Add ride
// @access  Private

router.post('/:id', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({msg: 'Ride not found'});
    }

    const newRide = {
      active: req.body.active,
      date: req.body.date,
      source: req.body.source,
      destination: req.body.destination,
      distance: req.body.distance,
      seats: req.body.seats,
      price: req.body.price,
      vehicleType: req.body.vehicleType,
      vehicleNumber: req.body.vehicleNumber,
      vehicleModel: req.body.vehicleModel,
      description: req.body.description,
    };

    ride.rides.unshift(newRide);

    await ride.save();

    res.json(ride);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/:id/:ride_id', auth, async (req, res) => {
  const rideFields = {};

  const standardFields = [
    'active',
    'date',
    'source',
    'destination',
    'distance',
    'seats',
    'price',
    'vehicleType',
    'vehicleNumber',
    'vehicleModel',
    'description',
  ];

  standardFields.forEach(field => {
    if (req.body[field]) rideFields[field] = req.body[field];
  });

  try {
    const user = await Ride.findById(req.params.id);

    user.rides = user.rides.map(ride => {
      if (ride.id === req.params.ride_id) {
        ride = {...ride, ...rideFields};
      }
      return ride;
    });

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/ride/passenger/:id
// @desc    Add passenger
// @access  Private

router.post('/passenger/:id', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    const newPassenger = {
      user: req.user.id,
    };

    ride.rides[0].passengers.unshift(newPassenger);

    await ride.save();

    res.json(ride);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/ride/
// @desc    Get all rides
// @access  Public

router.get('/', async (req, res) => {
  try {
    const ride = await Ride.find().sort({date: -1});
    res.json(ride);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
