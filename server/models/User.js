const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  fcmtoken: [
    {
      type: String,
      unique: true,
    },
  ],
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  photoURL: {
    type: String,
    required: true,
  },
  home: {
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
    desc: {
      type: String,
    },
  },
  work: {
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
    desc: {
      type: String,
    },
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  ridesCreated: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ride',
    },
  ],
  ridesJoined: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ride',
    },
  ],
  ridesCreatedInactive: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ride',
    },
  ],
  ridesJoinedInactive: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ride',
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('user', UserSchema);
