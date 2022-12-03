import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-community/async-storage';
import {IP} from '@env';

export const passsengerRequest = createAsyncThunk(
  'ride/passsengerRequest',
  async id => {
    var token = await AsyncStorage.getItem('token');
    console.log(id);
    return await fetch(`http://${IP}/api/ride/passenger/${id}`, {
      method: 'PATCH',
      headers: {
        'auth-token': token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        return data;
      })
      .catch(err => console.log(err, 'error from passengerSlice'));
  },
);

export const acceptPassenger = createAsyncThunk(
  'ride/acceptPassenger',
  async params => {
    console.log(params);
    var token = await AsyncStorage.getItem('token');
    return await fetch(
      `http://${IP}/api/ride/passenger/${params[0]}/${params[1]}/accept`,
      {
        method: 'PATCH',
        headers: {
          'auth-token': token,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(res => res.json())
      .catch(err => console.log(err, 'error from passengerSlice'));
  },
);

export const rejectPassenger = createAsyncThunk(
  'ride/rejectPassenger',
  async params => {
    var token = await AsyncStorage.getItem('token');
    return await fetch(
      `http://${IP}/api/ride/passenger/${params[0]}/${params[1]}/reject`,
      {
        method: 'PATCH',
        headers: {
          'auth-token': token,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(res => res.json())
      .catch(err => console.log(err, 'error from passengerSlice'));
  },
);

const passengerSlice = createSlice({
  name: 'passenger',
  initialState: {
    passenger: [],
    loading: false,
    error: null,
  },
  reducers: {
    setPassenger: (state, action) => {
      state.passenger = action.payload;
    },
  },
  extraReducers: {
    [passsengerRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [passsengerRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.ride = action.payload;
    },
    [passsengerRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [acceptPassenger.pending]: (state, action) => {
      state.loading = true;
    },
    [acceptPassenger.fulfilled]: (state, action) => {
      state.loading = false;
      state.ride = action.payload;
    },
    [acceptPassenger.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [rejectPassenger.pending]: (state, action) => {
      state.loading = true;
    },
    [rejectPassenger.fulfilled]: (state, action) => {
      state.loading = false;
      state.ride = action.payload;
    },
    [rejectPassenger.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default passengerSlice.reducer;
