import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-community/async-storage';
import {IP} from '@env';

export const postRide = createAsyncThunk('ride/postRide', async ({rides}) => {
  var token = await AsyncStorage.getItem('token');
  console.log(rides, 'rides from postRide');
  return await fetch(`http://${IP}/api/ride`, {
    method: 'POST',
    headers: {
      'auth-token': token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      timestamp: rides.timestamp,
      source: rides.source,
      destination: rides.destination,
      sourceLat: rides.sourceLat,
      sourceLng: rides.sourceLng,
      destinationLat: rides.destinationLat,
      destinationLng: rides.destinationLng,
      distance: rides.distance,
      travelTime: rides.travelTime,
      seats: rides.seats,
      price: rides.price,
      vehicleType: rides.vehicleType,
      vehicleNumber: rides.vehicleNumber,
      vehicleModel: rides.vehicleModel,
      //   description: rides.description,
    }),
  })
    .then(res => res.json())
    .catch(err => console.log(err, 'error from rideSlice'));
});

export const getAllRides = createAsyncThunk(
  'ride/getAllRides',
  async params => {
    return await fetch(
      `http://${IP}/api/ride?search=${params[0]}&page=${params[1]}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(res => res.json())
      .catch(err => console.log(err, 'error from rideSlice'));
  },
);

export const getRideById = createAsyncThunk('ride/getRideById', async id => {
  console.log(id, 'id from getRideById');
  return await fetch(`http://${IP}/api/ride/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(data => {
      const res = {
        data: data,
        id: id,
      };
      return res;
    })
    .catch(err => console.log(err, 'error from rideSlice'));
});

export const getMyRides = createAsyncThunk('ride/getMyRides', async page => {
  var token = await AsyncStorage.getItem('token');
  return await fetch(`http://${IP}/api/ride/me?page=${page}`, {
    method: 'GET',
    headers: {
      'auth-token': token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .catch(err => console.log(err, 'error from rideSlice'));
});

export const getMyInactiveRides = createAsyncThunk(
  'ride/getMyInactiveRides',
  async page => {
    var token = await AsyncStorage.getItem('token');
    return await fetch(`http://${IP}/api/ride/me/inactive?page=${page}`, {
      method: 'GET',
      headers: {
        'auth-token': token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .catch(err => console.log(err, 'error from rideSlice'));
  },
);

export const getFollowingRides = createAsyncThunk(
  'ride/getFollowingRides',
  async page => {
    var token = await AsyncStorage.getItem('token');
    return await fetch(`http://${IP}/api/ride/following?page=${page}`, {
      method: 'GET',
      headers: {
        'auth-token': token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .catch(err => console.log(err, 'error from rideSlice'));
  },
);

export const deleteRide = createAsyncThunk('ride/deleteRide', async id => {
  var token = await AsyncStorage.getItem('token');
  return await fetch(`http://${IP}/api/ride/${id}`, {
    method: 'DELETE',
    headers: {
      'auth-token': token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .catch(err => console.log(err, 'error from rideSlice'));
});

// export const distancematrix = createAsyncThunk(
//   'ride/distancematrix',
//   async ({data}) => {
//     var token = await AsyncStorage.getItem('token');
//     return await fetch(`http://${IP}/api/ride/distancematrix`, {
//       method: 'POST',
//       headers: {
//         'auth-token': token,
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         origin: data.origin,
//         destination: data.destination,
//       }),
//     })
//       .then(res => res.json())
//       .catch(err => console.log(err, 'error from rideSlice'));
//   },
// );

const rideSlice = createSlice({
  name: 'ride',
  initialState: {
    ride: [],
    loading: false,
    error: null,
  },
  reducers: {
    setRide: (state, action) => {
      state.ride = action.payload;
    },
  },
  extraReducers: {
    [postRide.pending]: (state, action) => {
      state.loading = true;
    },
    [postRide.fulfilled]: (state, action) => {
      state.loading = false;
      state.ride = action.payload;
    },
    [postRide.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getAllRides.pending]: (state, action) => {
      state.loading = true;
    },
    [getAllRides.fulfilled]: (state, action) => {
      state.loading = false;
      state.ride = action.payload;
    },
    [getAllRides.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getRideById.pending]: (state, action) => {
      state.loading = true;
    },
    [getRideById.fulfilled]: (state, action) => {
      state.loading = false;
      state.ride = action.payload;
    },
    [getRideById.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getMyRides.pending]: (state, action) => {
      state.loading = true;
    },
    [getMyRides.fulfilled]: (state, action) => {
      state.loading = false;
      state.ride = action.payload;
    },
    [getMyRides.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getMyInactiveRides.pending]: (state, action) => {
      state.loading = true;
    },
    [getMyInactiveRides.fulfilled]: (state, action) => {
      state.loading = false;
      state.ride = action.payload;
    },
    [getMyInactiveRides.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getFollowingRides.pending]: (state, action) => {
      state.loading = true;
    },
    [getFollowingRides.fulfilled]: (state, action) => {
      state.loading = false;
      state.ride = action.payload;
    },
    [getFollowingRides.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [deleteRide.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteRide.fulfilled]: (state, action) => {
      state.loading = false;
      state.ride = action.payload;
    },
    [deleteRide.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default rideSlice.reducer;
