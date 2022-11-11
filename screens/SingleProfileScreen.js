import {View, Text, SafeAreaView, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import BackButton from '../components/BackButton';
import {useSelector} from 'react-redux';
import tw from 'twrnc';

const SingleProfileScreen = ({navigation}) => {
  const [profile, setProfile] = useState(null);
  const profileData = useSelector(state => state.profile.profile);
  useEffect(() => {
    setProfile(profileData);
  }, [profileData]);

  return (
    <SafeAreaView>
      <BackButton navigation={navigation} />
      {profile && (
        //create card component
        <View>
          <View
            style={tw`flex flex-col items-center justify-center bg-gray-200 py-10 mx-3 mt-3 rounded-xl`}>
            <Image
              source={{uri: profile?.user.photoURL}}
              style={tw`w-32 h-32 rounded-full`}
            />
            <Text style={tw`text-2xl font-bold text-gray-700`}>
              {profile?.user.name}
            </Text>
            <Text style={tw`text-lg text-gray-600`}>{profile?.user.email}</Text>
            <Text style={tw`text-lg text-gray-600`}>{profile?.college}</Text>
          </View>
          <Text style={tw`text-lg text-gray-700 px-3 mt-3`}>
            {profile?.mobile}
          </Text>
          <Text style={tw`text-lg text-gray-700 px-3 mt-3`}>
            {profile?.location}
          </Text>
          <Text style={tw`text-lg text-gray-700 px-3 mt-3`}>
            {profile?.dob}
          </Text>
          <Text style={tw`text-lg text-gray-700 px-3 mt-3`}>
            {profile?.vehicleType}
          </Text>
          <Text style={tw`text-lg text-gray-700 px-3 mt-3`}>
            {profile?.vehicleNumber}
          </Text>
          <Text style={tw`text-lg text-gray-700 px-3 mt-3`}>
            {profile?.vehicleModel}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SingleProfileScreen;
