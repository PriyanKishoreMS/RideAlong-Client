import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-community/async-storage';
import {IP} from '@env';

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
        name: profiles.name,
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
    // console.log(token, 'token from getSingleUser');
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

export const getMyProfile = createAsyncThunk(
  'profile/getMyProfile',
  async () => {
    var token = await AsyncStorage.getItem('token');
    // console.log(token, 'token from getMyProfile');
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
        // console.log(data, 'data from getMyProfile');
        return data;
      })
      .catch(err => console.error(err, 'error from getMyProfile'));
  },
);

export const getProfileById = createAsyncThunk(
  'profile/getProfileById',
  async id => {
    return await fetch(`http://192.168.1.17:5000/api/profile/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        // console.log(data, 'data from getProfileById');
        return data;
      })
      .catch(err => console.error(err, 'error from getProfileById'));
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
    [getMyProfile.pending]: (state, action) => {
      state.loading = true;
    },
    [getMyProfile.fulfilled]: (state, action) => {
      state.loading = false;
      state.profile = [action.payload];
    },
    [getMyProfile.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getProfileById.pending]: (state, action) => {
      state.loading = true;
    },
    [getProfileById.fulfilled]: (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    },
    [getProfileById.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default profileSlice.reducer;
