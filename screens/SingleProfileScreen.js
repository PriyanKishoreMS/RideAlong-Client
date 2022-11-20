import {View, Text, SafeAreaView, Image, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import BackButton from '../components/BackButton';
import {useDispatch, useSelector} from 'react-redux';
import tw from 'twrnc';
import {Button, Icon} from 'react-native-elements';
import {postFriend} from '../slices/userSlice';

const SingleProfileScreen = ({route, navigation}) => {
  const {id} = route.params;
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [followChange, setFollowChange] = useState(false);

  const profileData = useSelector(state => state.profile.profile);
  useEffect(() => {
    setProfile(profileData);
  }, [profileData, followChange]);

  return (
    <SafeAreaView>
      <BackButton navigation={navigation} />
      {profile && (
        //create card component
        <ScrollView>
          <View
            style={tw`flex flex-col items-center justify-center bg-gray-200 py-10 mx-3 mt-3 rounded-xl`}>
            <Image
              source={{uri: profile?.profile?.user.photoURL}}
              style={tw`w-32 h-32 rounded-full`}
            />
            <Text style={tw`text-2xl font-bold text-gray-700`}>
              {profile?.profile?.user.name}
            </Text>
            <Text style={tw`text-lg text-gray-600`}>
              {profile?.profile?.user.email}
            </Text>
            <Text style={tw`text-lg text-gray-600`}>
              {profile?.profile?.college}
            </Text>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-lg text-gray-600`}>
                {profile?.profile?.user?.followers.length} Followers{'  '}
              </Text>
              <Text style={tw`text-lg text-gray-600`}>
                {profile?.profile?.user?.following.length} Following
              </Text>
            </View>
            <Button
              {...(profile?.profile?.user?.followers.includes(id)
                ? {
                    title: 'Unfollow',
                    onPress: () => {
                      dispatch(postFriend(profile?.profile?.user?._id)).then(
                        res => {
                          setFollowChange(!followChange);
                        },
                      );
                    },
                    buttonStyle: tw`bg-red-500`,
                  }
                : {
                    title: 'Follow',
                    onPress: () => {
                      dispatch(postFriend(profile?.profile?.user?._id)).then(
                        res => {
                          setFollowChange(!followChange);
                        },
                      );
                    },
                    buttonStyle: tw`bg-blue-500`,
                  })}
              icon={
                <Icon
                  name="user-plus"
                  type="font-awesome"
                  size={15}
                  color="white"
                  style={tw`mr-2`}
                />
              }
              // onPress={() => dispatch(postFriend(profile?.profile?.user?._id))}
              // buttonStyle={tw`bg-blue-500 mt-3`}
            />
          </View>
          <Text style={tw`text-lg text-gray-700 px-3 mt-3`}>
            {profile?.profile?.mobile}
          </Text>
          <Text style={tw`text-lg text-gray-700 px-3 mt-3`}>
            {profile?.profile?.location}
          </Text>
          <Text style={tw`text-lg text-gray-700 px-3 mt-3`}>
            {profile?.profile?.dob}
          </Text>
          <Text style={tw`text-lg text-gray-700 px-3 mt-3`}>
            {profile?.profile?.vehicleType}
          </Text>
          <Text style={tw`text-lg text-gray-700 px-3 mt-3`}>
            {profile?.profile?.vehicleNumber}
          </Text>
          <Text style={tw`text-lg text-gray-700 px-3 mt-3`}>
            {profile?.profile?.vehicleModel}
          </Text>
          {profile.rides.map(ride => (
            <View
              key={ride._id}
              style={tw`flex flex-col items-center justify-center bg-gray-200 py-10 mx-3 mt-3 rounded-xl`}>
              <Text style={tw`text-lg text-gray-700 px-3 mt-3`}>
                {ride.source}
              </Text>
              <Text style={tw`text-lg text-gray-700 px-3 mt-3`}>
                {ride.destination}
              </Text>
              <Text style={tw`text-lg text-gray-700 px-3 mt-3`}>
                {ride.date}
              </Text>
              <Text style={tw`text-lg text-gray-700 px-3 mt-3`}>
                {ride.time}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default SingleProfileScreen;
