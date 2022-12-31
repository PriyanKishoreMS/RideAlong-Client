import React from 'react';
import {useState, useEffect} from 'react';
import {createContext, useContext} from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import {Alert} from 'react-native';
import {GOOGLE_WEBCLIENTID} from '@env';
import messaging from '@react-native-firebase/messaging';
import {deleteFCMToken} from '../slices/userSlice';
import {useDispatch} from 'react-redux';
import {DeviceEventEmitter} from 'react-native';

GoogleSignin.configure({
  webClientId: GOOGLE_WEBCLIENTID,
});

export const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(false);

  const GetFCMToken = async () => {
    const token = await messaging().getToken();
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      console.log('FCMtoken', token);
    }
    return token;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        setUser,
        setProfile,
        GetFCMToken,
        googleSignin: async () => {
          try {
            const {idToken} = await GoogleSignin.signIn();
            const googleCredential =
              auth.GoogleAuthProvider.credential(idToken);
            return auth().signInWithCredential(googleCredential);
          } catch (error) {
            console.log(error);
          }
        },
        logout: () => {
          Alert.alert(
            'Do you want to logout?',
            'Press Yes to logout',
            [
              {
                text: 'Cancel',
                onPress: () => {
                  console.log('Logout Cancelled');
                  console.log(GetDeviceFCM());
                },
                style: 'cancel',
              },
              {
                text: 'Yes',
                onPress: async () => {
                  try {
                    await dispatch(deleteFCMToken());
                    await GoogleSignin.revokeAccess();
                    await GoogleSignin.signOut();
                    // console.log(await AsyncStorage.getItem('token'), 'before');
                    await AsyncStorage.removeItem('token');
                    // console.log(await AsyncStorage.getItem('token'), 'after');
                    // await AsyncStorage.clear();
                    return auth().signOut();
                  } catch (e) {
                    console.log(e);
                  }
                },
              },
            ],
            {cancelable: false},
          );
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};

// export default function useAuth() {
//   return useContext(AuthContext);
// }
