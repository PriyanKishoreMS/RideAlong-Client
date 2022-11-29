import {configureStore} from '@reduxjs/toolkit';
import navReducer from './slices/navSlice';
import userReducer from './slices/userSlice';
import profileReducer from './slices/profileSlice';
import rideReducer from './slices/rideSlice';
import passengerReducer from './slices/passengerSlice';

export const store = configureStore({
  reducer: {
    nav: navReducer,
    user: userReducer,
    profile: profileReducer,
    ride: rideReducer,
    passenger: passengerReducer,
  },
});
