import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../hooks/useAuth';
import tw from 'twrnc';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {getSingleProfile} from '../slices/profileSlice';
import {Button} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = ({navigation}) => {
  const {logout} = useContext(AuthContext);
  const userInfo = auth().currentUser;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSingleProfile());
  }, [dispatch]);

  const {profile} = useSelector(state => ({...state.profile}));

  // const profile = useSelector(state => state.profile.profile);
  // console.log(profile[0], 'single profile from HomeScreen');

  return (
    <View style={tw`bg-white h-full p-5`}>
      {profile[0] && (
        //shadow style for the card
        <View style={tw` rounded-xl bg-gray-200 w-full px-4 py-3`}>
          <View style={tw`flex-row justify-between`}>
            <View>
              <Text style={tw`text-xl font-semibold mb-2`}>
                {userInfo?.displayName}
                {/* {profile[0].name} */}
              </Text>
              <Text style={tw`text-gray-500`}>
                City: {profile[0]?.location}
              </Text>
              <Text style={tw`text-gray-500`}>
                DOB: {profile[0]?.dob.substr(0, 10)}
              </Text>
              <Text style={tw`text-gray-500`}>
                Mobile: {profile[0]?.mobile}
              </Text>
              <Text style={tw`text-gray-500`}>
                College: {profile[0]?.college}
              </Text>
              <Text style={tw`text-gray-500`}>
                Vehicle: {profile[0]?.vehicleType}
              </Text>
              {profile[0].vehicleType !== 'None' ? (
                <>
                  <Text style={tw`text-gray-500`}>
                    Vehicle No: {profile[0]?.vehicleNumber}
                  </Text>
                  <Text style={tw`text-gray-500`}>
                    Model: {profile[0]?.vehicleModel}
                  </Text>
                </>
              ) : null}
            </View>
            <View style={tw`flex-row items-center`}>
              <Image
                source={{
                  uri: userInfo?.photoURL,
                  // uri: profile[0].photoURL,
                }}
                style={{
                  width: 100,
                  height: 100,
                  resizeMode: 'contain',
                  borderRadius: 15,
                }}
              />
            </View>
          </View>
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw` font-semibold`}>{userInfo?.email}</Text>
            <View style={tw`flex-row items-center`}>
              <Button
                title="Logout"
                onPress={() => logout()}
                buttonStyle={tw`bg-red-500 rounded-xl`}
              />
            </View>
          </View>
        </View>
      )}
      {/* <UpdateProfileCard /> */}
      <TouchableOpacity
        style={tw`flex-row justify-between bg-white w-full px-4 py-3 shadow-lg rounded-xl mt-5`}
        onPress={() => navigation.navigate('UpdateProfile')}>
        <View>
          <Text style={tw`text-xl font-semibold`}>Update Profile</Text>
        </View>
        <View style={tw`flex-row items-center`}>
          <Icon name="chevron-forward" size={30} color="gray" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

// Path: screens/ProfileCreateScreen.js
