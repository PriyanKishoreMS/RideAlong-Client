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
      active: rides.active,
      timestamp: rides.timestamp,
      source: rides.source,
      destination: rides.destination,
      distance: rides.distance,
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

export const getAllRides = createAsyncThunk('ride/getAllRides', async () => {
  return await fetch(`http://${IP}/api/ride`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .catch(err => console.log(err, 'error from rideSlice'));
});

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
  },
});

export default rideSlice.reducer;
