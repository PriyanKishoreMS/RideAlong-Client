import React from 'react';
import {useState, useEffect} from 'react';
import {createContext, useContext} from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import {Alert} from 'react-native';
import {GOOGLE_WEBCLIENTID} from '@env';

GoogleSignin.configure({
  webClientId: GOOGLE_WEBCLIENTID,
});

export const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        setUser,
        setProfile,
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
                onPress: () => console.log('Logout Cancelled'),
                style: 'cancel',
              },
              {
                text: 'Yes',
                onPress: async () => {
                  try {
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
