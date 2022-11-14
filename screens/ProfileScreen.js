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
import MenuButton from '../components/MenuButton';

const HomeScreen = ({navigation}) => {
  const {logout} = useContext(AuthContext);
  const userInfo = auth().currentUser;
  const dispatch = useDispatch();

  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    dispatch(getSingleProfile()).then(res => {
      setUserProfile(res.payload);
    });
  }, []);

  // const {profile} = useSelector(state => ({...state.profile}));

  // const profile = useSelector(state => state.profile.profile);
  // console.log(profile[0], 'single profile from HomeScreen');

  return (
    <View style={tw`bg-white h-full p-5`}>
      <View style={tw`pb-5 flex-row items-center`}>
        <MenuButton />
        <Text style={tw`text-center py-2 text-xl font-light`}>Profile</Text>
      </View>
      {userProfile && (
        //shadow style for the card
        <View style={tw` rounded-xl bg-gray-200 w-full px-4 py-3`}>
          <View style={tw`flex-row justify-between`}>
            <View>
              <Text style={tw`text-xl font-semibold mb-2`}>
                {userProfile?.user?.name}
                {/* {userProfile.name} */}
              </Text>
              <Text style={tw`text-gray-500`}>
                City: {userProfile?.location}
              </Text>
              <Text style={tw`text-gray-500`}>
                DOB: {userProfile?.dob.substr(0, 10)}
              </Text>
              <Text style={tw`text-gray-500`}>
                Mobile: {userProfile?.mobile}
              </Text>
              <Text style={tw`text-gray-500`}>
                College: {userProfile?.college}
              </Text>
              <Text style={tw`text-gray-500`}>
                Vehicle: {userProfile?.vehicleType}
              </Text>
              {userProfile.vehicleType !== 'None' ? (
                <>
                  <Text style={tw`text-gray-500`}>
                    Vehicle No: {userProfile?.vehicleNumber}
                  </Text>
                  <Text style={tw`text-gray-500`}>
                    Model: {userProfile?.vehicleModel}
                  </Text>
                </>
              ) : null}
            </View>
            <View style={tw`flex-row items-center`}>
              <Image
                source={{
                  uri: userInfo?.photoURL,
                  // uri: userProfile[0].photoURL,
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
                buttonStyle={tw`bg-red-700 rounded-xl`}
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
      <View style={tw`h-1/4`} />
      <View style={tw`flex items-center`}>
        <Text style={tw`items-center text-5xl font-black mt-5 opacity-12.5`}>
          <Icon name="car-sport" size={50} color="gray" /> RideAlong
        </Text>
        <Text style={tw`text-black font-medium opacity-12.5`}>
          Version 1.0.0
        </Text>
        <Text style={tw`text-black font-medium opacity-12.5`}>
          priyankishore.dev
        </Text>
      </View>
    </View>
  );
};

export default HomeScreen;

// Path: screens/ProfileCreateScreen.js
