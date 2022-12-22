import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import tw from 'twrnc';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {Button} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import {correctCase} from '../../components/utils/correctCase';

import {AuthContext} from '../../hooks/useAuth';
import {getProfileById} from '../../slices/profileSlice';
import {getMyProfile} from '../../slices/profileSlice';
import MenuButton from '../../components/utils/MenuButton';

const HomeScreen = ({navigation}) => {
  const {logout} = useContext(AuthContext);
  const userInfo = auth().currentUser;
  const dispatch = useDispatch();

  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    dispatch(getMyProfile())
      .then(res => {
        setUserProfile(res.payload);
      })
      .catch(err => {
        console.log(err);
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
        <TouchableOpacity
          onPress={async () => {
            dispatch(getProfileById(userProfile?.user?._id)).then(res => {
              navigation.navigate('Map');
              navigation.navigate('SingleProfile', {
                id: userProfile?.user?._id,
              });
            });
          }}
          style={tw` rounded-xl bg-white shadow-lg w-full px-4 py-3`}>
          <View style={tw`flex-row justify-between`}>
            <View>
              <Text style={tw`text-xl font-semibold`}>
                {correctCase(userProfile?.user?.name)}
                {/* {userProfile.name} */}
              </Text>
              <Text style={tw` font-semibold text-xs mb-2`}>
                {userInfo?.email.length > 30
                  ? userInfo?.email.substring(0, 30) + '...'
                  : userInfo?.email}
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
            <View
              style={tw`flex-row items-center border-2 rounded-full p-2 border-slate-300`}>
              <Image
                source={{
                  uri: userInfo?.photoURL,
                  // uri: userProfile[0].photoURL,
                }}
                style={{
                  width: 100,
                  height: 100,
                  resizeMode: 'contain',
                  borderRadius: 100,
                }}
              />
            </View>
          </View>
        </TouchableOpacity>
      )}
      {/* <UpdateProfileCard /> */}
      <View
        style={tw`rounded-xl shadow-lg bg-white px-4 pt-2 pb-1 w-full mt-5`}>
        <TouchableOpacity
          style={tw`flex-row justify-between bg-white w-full mb-2 mt-1`}
          onPress={() => navigation.navigate('UpdateProfile')}>
          <View style={tw`flex-row items-center justify-center`}>
            <Icon
              name="refresh-circle-outline"
              type="ionicon"
              size={25}
              color="#555"
              style={tw`bg-slate-200 rounded-xl p-1 mr-3`}
            />
            <Text style={tw`text-lg font-semibold`}>Update Profile</Text>
          </View>
          <View style={tw`flex-row items-center`}>
            <Icon name="chevron-forward" size={30} color="gray" />
          </View>
        </TouchableOpacity>
        <View style={tw`border-b border-gray-300 w-full`}></View>
        <TouchableOpacity
          style={tw`flex-row justify-between bg-white w-full mb-2 mt-1`}
          onPress={() => navigation.navigate('HomeAddress')}>
          <View style={tw`flex-row items-center justify-center`}>
            <Icon
              name="refresh-circle-outline"
              type="ionicon"
              size={25}
              color="#555"
              style={tw`bg-slate-200 rounded-xl p-1 mr-3`}
            />
            <Text style={tw`text-lg font-semibold`}>Update Home Address</Text>
          </View>
          <View style={tw`flex-row items-center`}>
            <Icon name="chevron-forward" size={30} color="gray" />
          </View>
        </TouchableOpacity>
        <View style={tw`border-b border-gray-300 w-full`}></View>
        <TouchableOpacity
          style={tw`flex-row justify-between bg-white w-full mb-2 mt-1`}
          onPress={() => navigation.navigate('WorkAddress')}>
          <View style={tw`flex-row items-center justify-center`}>
            <Icon
              name="refresh-circle-outline"
              type="ionicon"
              size={25}
              color="#555"
              style={tw`bg-slate-200 rounded-xl p-1 mr-3`}
            />
            <Text style={tw`text-lg font-semibold`}>Update Work Address</Text>
          </View>
          <View style={tw`flex-row items-center`}>
            <Icon name="chevron-forward" size={30} color="gray" />
          </View>
        </TouchableOpacity>
        <View style={tw`border-b border-gray-300 w-full`}></View>
        <TouchableOpacity
          style={tw`flex-row justify-between bg-white w-full my-2`}
          // onPress={() => navigation.navigate('UpdateProfile')}
        >
          <View style={tw`flex-row items-center justify-center`}>
            <Icon
              name="cog-outline"
              type="ionicon"
              size={25}
              color="#555"
              style={tw`bg-slate-200 rounded-xl p-1 mr-3`}
            />
            <Text style={tw`text-lg font-semibold`}>Settings</Text>
          </View>
          <View style={tw`flex-row items-center`}>
            <Icon name="chevron-forward" size={30} color="gray" />
          </View>
        </TouchableOpacity>
        <View style={tw`border-b border-gray-300 w-full`}></View>
        <TouchableOpacity
          style={tw`flex-row justify-between bg-white w-full my-2`}
          onPress={() => logout()}>
          <View style={tw`flex-row items-center justify-center`}>
            <Icon
              name="log-out-outline"
              type="ionicon"
              size={25}
              color="#555"
              style={tw`bg-slate-200 rounded-xl p-1 mr-3`}
            />
            <Text style={tw`text-lg font-semibold`}>Sign-out</Text>
          </View>
          <View style={tw`flex-row items-center`}>
            <Icon name="chevron-forward" size={30} color="gray" />
          </View>
        </TouchableOpacity>
      </View>
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
