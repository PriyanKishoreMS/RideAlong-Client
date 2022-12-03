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
    'sourceLat',
    'sourceLng',
    'destinationLat',
    'destinationLng',
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
router.get('/me', auth, async (req, res) => {
  try {
    const rides = await Ride.find({user: req.user.id})
      .sort({date: 1})
      .populate('user', ['name', 'photoURL']);
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

router.get('/:id', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate('user', [
      'name',
      'photoURL',
    ]);
    if (!ride) {
      return res.status(404).json({msg: 'Ride not found'});
    }

    //populate photoURL and name of user in passenger array
    const passengers = ride.passengers;
    const passengerDetails = [];
    const requests = [];
    for (let i = 0; i < passengers.length; i++) {
      if (passengers[i].status === 2) {
        const passenger = await User.findById(passengers[i].user);
        passengerDetails.push({
          user: passenger._id,
          name: passenger.name,
          photoURL: passenger.photoURL,
        });
      } else if (passengers[i].status === 1) {
        const passenger = await User.findById(passengers[i].user);
        requests.push({
          user: passenger._id,
          name: passenger.name,
          photoURL: passenger.photoURL,
        });
      }
    }

    res.json({ride, passengerDetails, requests});
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({msg: 'Ride not found'});
    }
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
router.patch('/passenger/:id/:passengerId/accept', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    const user = await User.findById(req.params.passengerId);

    if (ride.seats === 0) {
      return res.status(400).json({
        msg: 'No seats available',
      });
    }

    //check if request exists
    if (
      ride.passengers.filter(
        passenger => passenger.user.toString() === req.params.passengerId,
      ).length === 0
    ) {
      return res.status(400).json({
        msg: 'Request does not exist',
      });
    }

    // get passenger index
    const passengerIndex = ride.passengers
      .map(passenger => passenger.user.toString())
      .indexOf(req.params.passengerId);

    if (ride.passengers[passengerIndex].status === 2) {
      return res.status(400).json({
        msg: 'Request already accepted',
      });
    }

    if (ride.passengers[passengerIndex].status === 1) {
      ride.passengers[passengerIndex].status = 2;
      ride.seats -= 1;
    }
    user.ridesJoined.push(ride._id);
    await ride.save();
    await user.save();
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
    const user = await User.findById(req.params.passengerId);
    // get passenger index
    const passengerIndex = ride.passengers
      .map(passenger => passenger.user.toString())
      .indexOf(req.params.passengerId);

    if (
      ride.passengers.filter(
        passenger => passenger.user.toString() === req.params.passengerId,
      ).length === 0
    ) {
      return res.status(400).json({
        msg: 'Request does not exist',
      });
    }

    if (ride.passengers[passengerIndex].status === 2) {
      ride.seats += 1;
    }
    ride.passengers.splice(passengerIndex, 1);
    user.ridesJoined.splice(user.ridesJoined.indexOf(ride._id), 1);
    await ride.save();
    await user.save();
    res.json(ride);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({msg: 'Ride not found'});
    }
    // check user
    if (ride.user.toString() !== req.user.id) {
      return res.status(401).json({msg: 'User not authorized'});
    }
    ride.passengers.forEach(async passenger => {
      const user = await User.findById(passenger.user);
      user.ridesJoined.splice(user.ridesJoined.indexOf(ride._id), 1);
      await user.save();
    });
    const host = await User.findById(ride.user);
    host.ridesCreated.splice(host.ridesCreated.indexOf(ride._id), 1);
    await host.save();
    await ride.remove();
    res.json({msg: 'Ride removed'});
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({msg: 'Ride not found'});
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
