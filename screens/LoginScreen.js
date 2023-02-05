import {View, Image} from 'react-native';
import React, {useEffect, useContext, useState} from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';
import tw from 'twrnc';
import {Button} from 'react-native-elements';
import {Dropdown} from 'react-native-element-dropdown';

import {postUser} from '../slices/userSlice';
import {AuthContext} from '../hooks/useAuth';
import {checkUserProfileStatus} from '../slices/profileSlice';
import {SafeAreaView} from 'react-native';
import {GOOGLE_WEBCLIENTID} from '@env';

const LoginScreen = () => {
  const {googleSignin} = useContext(AuthContext);
  const {setProfile} = useContext(AuthContext);
  const {GetFCMToken} = useContext(AuthContext);
  const [college, setCollege] = useState('');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEBCLIENTID,
    });
  }, []);

  const colleges = [
    {
      label: 'Hindustan Institute of Technology and Science',
      value: 'HITS',
    },
    {
      label: 'SRM Institute of Science and Technology',
      value: 'SRMIST',
    },
  ];

  const dispatch = useDispatch();

  const handleUserSignIn = async () => {
    try {
      await googleSignin();
      const userInfo = auth().currentUser;
      const fcmToken = await GetFCMToken();
      const users = {
        uid: userInfo.uid,
        name: userInfo.displayName,
        email: userInfo.email,
        photoURL: userInfo.photoURL,
        fcmtoken: fcmToken,
      };
      await dispatch(postUser({users}));
      dispatch(checkUserProfileStatus())
        .then(res => {
          if (res.payload == 200) {
            setProfile(false);
          } else setProfile(true);
        })
        .catch(err => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <Image
        source={require('../assets/images/carbgw.jpg')}
        style={tw`absolute w-full h-full opacity-75`}
      />
      <View style={tw`flex items-center justify-center`}>
        <Image
          source={require('../assets/images/RideAlong.png')}
          style={tw` opacity-100 w-100 h-20 mt-55 mb-10`}
        />
        <Dropdown
          label="Select your college"
          data={colleges}
          labelField="label"
          valueField="value"
          value={college}
          onChange={text => {
            setCollege(text.value);
          }}
          labelStyle={tw`text-white`}
          dropdownStyle={tw`bg-black`}
          dropdownTextStyle={tw`text-black`}
          dropdownTextHighlightStyle={tw`bg-white text-black`}
          onChangeText={value => console.log(value)}
          placeholder="Select your Institution"
          placeholderStyle={tw`text-gray-800`}
          selectedTextStyle={tw`text-black`}
          style={tw`border rounded-lg w-9/10 px-3 mb-10 py-2`}
        />
        {/* <Dropdown
          label="Type"
          data={types}
          value={state?.vehicleType}
          labelField="label"
          valueField="value"
          onChange={text => {
            setState({...state, vehicleType: text.value});
            // console.log(state?.vehicleType);
          }}
          placeholder="Type"
          placeholderStyle={tw`text-gray-500`}
          selectedTextStyle={tw`text-black`}
          style={tw`bg-gray-300 rounded-lg w-10/21 px-3 my-2 py-2`}
        /> */}
        {college == '' ? null : (
          <Button
            title={'Sign in to ' + college}
            onPress={() => handleUserSignIn()}
            icon={{
              name: 'google',
              type: 'font-awesome',
              color: 'white',
              marginRight: 10,
              size: 20,
            }}
            buttonStyle={{
              backgroundColor: 'black',
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
        )}
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
