import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-community/async-storage';
const ip = '192.168.1.17';

export const postProfile = createAsyncThunk(
  'profile/postProfile',
  async ({profiles}) => {
    var token = await AsyncStorage.getItem('token');
    // console.log(profiles, 'profiles from postProfile');
    console.log(token, 'token from profileSlice');
    return await fetch(`http://192.168.1.17:5000/api/profile`, {
      method: 'POST',
      headers: {
        'auth-token': token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dob: profiles.dob,
        location: profiles.location,
        mobile: profiles.mobile,
        college: profiles.college,
        vehicleType: profiles.vehicleType,
        vehicleNumber: profiles.vehicleNumber,
        vehicleModel: profiles.vehicleModel,
      }),
    })
      .then(res => res.json())
      .catch(err => console.log(err, 'error from profileSlice'));
  },
);

export const getSingleUser = createAsyncThunk(
  'profile/getSingleUser',
  async () => {
    var token = await AsyncStorage.getItem('token');
    console.log(token, 'token from getSingleUser');
    return await fetch(`http://192.168.1.17:5000/api/profile/me`, {
      method: 'GET',
      headers: {
        'auth-token': token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        return res.status;
      })
      // .then(data => console.log(data))
      .catch(err => console.error(err, 'error from getSingleUser'));
  },
);

export const getSingleProfile = createAsyncThunk(
  'profile/getSingleProfile',
  async () => {
    var token = await AsyncStorage.getItem('token');
    console.log(token, 'token from getSingleProfile');
    return await fetch(`http://192.168.1.17:5000/api/profile/me`, {
      method: 'GET',
      headers: {
        'auth-token': token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data, 'data from getSingleProfile');
        return data;
      })
      .catch(err => console.error(err, 'error from getSingleProfile'));
  },
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profile: [],
    loading: false,
    error: null,
  },
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
  },
  extraReducers: {
    [postProfile.pending]: (state, action) => {
      state.loading = true;
    },
    [postProfile.fulfilled]: (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    },
    [postProfile.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getSingleUser.pending]: (state, action) => {
      state.loading = true;
    },
    [getSingleUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.profile = [action.payload];
    },
    [getSingleUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getSingleProfile.pending]: (state, action) => {
      state.loading = true;
    },
    [getSingleProfile.fulfilled]: (state, action) => {
      state.loading = false;
      state.profile = [action.payload];
    },
    [getSingleProfile.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default profileSlice.reducer;
