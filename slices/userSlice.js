const {createSlice, createAsyncThunk} = require('@reduxjs/toolkit');
import AsyncStorage from '@react-native-community/async-storage';
import {IP} from '@env';
// send jwt token in header

const onValueChange = async (item, selectedValue) => {
  try {
    await AsyncStorage.setItem(item, selectedValue);
    console.log('saved');
  } catch (e) {
    console.log(`AsyncStorage error: ${e.message}`);
  }
};

export const getAllUsers = createAsyncThunk(
  'users/getAllUsers',
  async params => {
    var token = await AsyncStorage.getItem('token');
    console.log(params, 'page from getAllUsers');
    return await fetch(
      `http://${IP}/api/users?search=${params[0]}&page=${params[1]}`,
      {
        method: 'GET',
        headers: {
          'auth-token': token,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(res => res.json())
      .then(data => {
        // console.log(data, 'data from getAllUsers');
        return data;
      })
      .catch(err => console.error(err, 'error from getAllUsers'));
  },
);

export const getMyUser = createAsyncThunk('users/getMyUser', async () => {
  var token = await AsyncStorage.getItem('token');
  return await fetch(`http://${IP}/api/users/me`, {
    method: 'GET',
    headers: {
      'auth-token': token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(data => {
      return data;
    })
    .catch(err => console.error(err, 'error from getMyUser'));
});

export const postUser = createAsyncThunk('user/postUser', async ({users}) => {
  console.log(users, 'users from postUser');
  return await fetch(`http://${IP}/api/users`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uid: users.uid,
      email: users.email,
      name: users.name,
      photoURL: users.photoURL,
      // fcmtoken: users.fcmtoken,
    }),
  })
    .then(res => res.json())
    .then(data => {
      onValueChange('token', data.token);
      console.log(data.token, 'heres the authtoken');
    })
    .catch(err => console.log(err));
});

export const deleteFCMToken = createAsyncThunk(
  'user/deleteFCMToken',
  async () => {
    var token = await AsyncStorage.getItem('token');
    return await fetch(`http://${IP}/api/users/me/fcm`, {
      method: 'DELETE',
      headers: {
        'auth-token': token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .catch(err => console.error(err, 'error from deleteFCMToken'));
  },
);

export const postFriend = createAsyncThunk('user/postFriend', async id => {
  var token = await AsyncStorage.getItem('token');
  return await fetch(`http://${IP}/api/users/friend/${id}`, {
    method: 'PATCH',
    headers: {
      'auth-token': token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(data => {
      return data;
    })
    .catch(err => console.error(err, 'error from postFriend'));
});

export const getMyFollowing = createAsyncThunk(
  'user/getMyFollowing',
  async page => {
    var token = await AsyncStorage.getItem('token');
    return await fetch(`http://${IP}/api/users/me/following?page=${page}`, {
      method: 'GET',
      headers: {
        'auth-token': token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        return data;
      })
      .catch(err => console.error(err, 'error from getMyFollowing'));
  },
);

export const getMyFollowers = createAsyncThunk(
  'user/getMyFollowers',
  async page => {
    var token = await AsyncStorage.getItem('token');
    return await fetch(`http://${IP}/api/users/me/followers?page=${page}`, {
      method: 'GET',
      headers: {
        'auth-token': token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        // console.log(data, 'data from getMyFollowers');
        return data;
      })
      .catch(err => console.error(err, 'error from getMyFollowers'));
  },
);

export const putMyHomeAddress = createAsyncThunk(
  'user/putMyHomeAddress',
  async ({location}) => {
    var token = await AsyncStorage.getItem('token');
    return await fetch(`http://${IP}/api/users/me/home`, {
      method: 'PUT',
      headers: {
        'auth-token': token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lat: location.lat,
        lng: location.lng,
        desc: location.desc,
      }),
    })
      .then(res => res.json())
      .then(() => {
        console.log('Home address updated');
      })
      .catch(err => console.error(err, 'error from putMyHomeAddress'));
  },
);

export const putMyWorkAddress = createAsyncThunk(
  'user/putMyWorkAddress',
  async ({location}) => {
    var token = await AsyncStorage.getItem('token');
    return await fetch(`http://${IP}/api/users/me/work`, {
      method: 'PUT',
      headers: {
        'auth-token': token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lat: location.lat,
        lng: location.lng,
        desc: location.desc,
      }),
    })
      .then(res => res.json())
      .then(() => {
        console.log('Work address updated');
      })
      .catch(err => console.error(err, 'error from putMyWorkAddress'));
  },
);

export const getMyAddress = createAsyncThunk('user/getMyAddress', async () => {
  var token = await AsyncStorage.getItem('token');
  return await fetch(`http://${IP}/api/users/me/address`, {
    method: 'GET',
    headers: {
      'auth-token': token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(data => {
      return data;
    })
    .catch(err => console.error(err, 'error from getMyAddress'));
});

export const getFollowingByUserId = createAsyncThunk(
  'user/getFollowingByUserId',
  async params => {
    var token = await AsyncStorage.getItem('token');
    return await fetch(
      `http://${IP}/api/users/${params[0]}/following?page=${params[1]}`,
      {
        method: 'GET',
        headers: {
          'auth-token': token,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(res => res.json())
      .then(data => {
        return data;
      })
      .catch(err => console.error(err, 'error from getFollowingByUserId'));
  },
);

export const getFollowersByUserId = createAsyncThunk(
  'user/getFollowersByUserId',
  async params => {
    var token = await AsyncStorage.getItem('token');
    return await fetch(
      `http://${IP}/api/users/${params[0]}/followers?page=${params[1]}`,
      {
        method: 'GET',
        headers: {
          'auth-token': token,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(res => res.json())
      .then(data => {
        return data;
      })
      .catch(err => console.error(err, 'error from getFollowersByUserId'));
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: {
    [getAllUsers.pending]: (state, action) => {
      state.loading = true;
    },
    [getAllUsers.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    [getAllUsers.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getMyUser.pending]: (state, action) => {
      state.loading = true;
    },
    [getMyUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    [getMyUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [postUser.pending]: (state, action) => {
      state.loading = true;
    },
    [postUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    [postUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [postFriend.pending]: (state, action) => {
      state.loading = true;
    },
    [postFriend.fulfilled]: (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    },
    [postFriend.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getMyFollowing.pending]: (state, action) => {
      state.loading = true;
    },
    [getMyFollowing.fulfilled]: (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    },
    [getMyFollowing.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getMyFollowers.pending]: (state, action) => {
      state.loading = true;
    },
    [getMyFollowers.fulfilled]: (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    },
    [getMyFollowers.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [putMyHomeAddress.pending]: (state, action) => {
      state.loading = true;
    },
    [putMyHomeAddress.fulfilled]: (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    },
    [putMyHomeAddress.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [putMyWorkAddress.pending]: (state, action) => {
      state.loading = true;
    },
    [putMyWorkAddress.fulfilled]: (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    },
    [putMyWorkAddress.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getMyAddress.pending]: (state, action) => {
      state.loading = true;
    },
    [getMyAddress.fulfilled]: (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    },
    [getMyAddress.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getFollowingByUserId.pending]: (state, action) => {
      state.loading = true;
    },
    [getFollowingByUserId.fulfilled]: (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    },
    [getFollowingByUserId.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getFollowersByUserId.pending]: (state, action) => {
      state.loading = true;
    },
    [getFollowersByUserId.fulfilled]: (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    },
    [getFollowersByUserId.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [deleteFCMToken.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteFCMToken.fulfilled]: (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    },
    [deleteFCMToken.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default userSlice.reducer;
