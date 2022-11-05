import {View, Text} from 'react-native';
import React, {useEffect, useContext, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useDispatch, useSelector} from 'react-redux';
import auth from '@react-native-firebase/auth';
import tw from 'twrnc';
import {Button} from 'react-native-elements';

import {postUser} from '../slices/userSlice';
import {AuthContext} from '../hooks/useAuth';
import {getSingleUser, getSingleProfile} from '../slices/profileSlice';
import {SafeAreaView} from 'react-native';
import {GOOGLE_WEBCLIENTID} from '@env';

const LoginScreen = () => {
  const {googleSignin} = useContext(AuthContext);
  const {profile, setProfile} = useContext(AuthContext);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEBCLIENTID,
    });
  }, []);

  const dispatch = useDispatch();

  const handleUserSignIn = async () => {
    try {
      await googleSignin();
      const userInfo = auth().currentUser;
      const users = {
        uid: userInfo.uid,
        name: userInfo.displayName,
        email: userInfo.email,
        photoURL: userInfo.photoURL,
      };
      await dispatch(postUser({users}));
      dispatch(getSingleUser()).then(res => {
        if (res.payload == 200) {
          dispatch(getSingleProfile());
          setProfile(false);
        } else setProfile(true);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView>
      <View style={tw`flex items-center justify-center h-full`}>
        <Button
          title="Google Sign-In"
          onPress={() => handleUserSignIn()}
          icon={{
            name: 'google',
            type: 'font-awesome',
            color: 'white',
            marginRight: 10,
            size: 20,
          }}
          buttonStyle={{
            backgroundColor: '#4285F4',
            width: 200,
            height: 40,
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 5,
          }}
          //google button text style
          titleStyle={{
            color: 'white',
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
