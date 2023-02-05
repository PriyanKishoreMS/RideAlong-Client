import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Icon} from 'react-native-elements';
import tw from 'twrnc';

import {postFriend} from '../../slices/userSlice';
import {correctCase} from '../../components/utils/correctCase';
import {getRideById} from '../../slices/rideSlice';

const SingleProfileScreen = ({route, navigation}) => {
  const {id} = route.params;
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [isFollow, setIsFollow] = useState(false);

  var profileData = useSelector(state => state?.profile?.profile);
  var followData = useSelector(
    state => state?.profile?.profile?.followers?.followers,
  );

  useEffect(() => {
    setProfile(profileData);
    console.log('profileData', profileData);
    if (followData?.includes(id)) setIsFollow(true);
    console.log(followData, 'isFollow');
  }, []);

  return (
    <SafeAreaView>
      {/* <BackButton navigation={navigation} /> */}
      {profile ? (
        //create card component
        <ScrollView>
          <View style={tw`bg-slate-300 py-5 mx-3 mt-3 rounded-xl`}>
            <View style={tw`flex items-center justify-center `}>
              <View
                style={tw`flex-row items-center justify-between w-full w-9/10`}>
                <View
                  style={tw`items-center justify-center shadow-xl p-1 bg-white rounded-full`}>
                  <Image
                    source={{uri: profile?.profile?.user.photoURL}}
                    style={tw`w-24 h-24 rounded-full`}
                  />
                </View>
                <View style={tw`flex-row items-center justify-center`}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.push('FollowersById', {
                        activeUser: profile?.profile?.user?._id,
                        activeUserName: profile?.profile?.user?.name,
                      });
                    }}
                    style={tw`flex p-3 bg-slate-200 shadow-lg rounded-lg items-center justify-center mr-3`}>
                    <Text style={tw`text-xl text-gray-600`}>
                      {profile?.followersCount === 0
                        ? profile?.followersCount
                        : profile?.followersCount - 1}
                    </Text>
                    <Text style={tw`text-base text-gray-600`}>Followers</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.push('FollowingById', {
                        activeUser: profile?.profile?.user?._id,
                        activeUserName: profile?.profile?.user?.name,
                      });
                    }}
                    style={tw`flex p-3 bg-slate-200 shadow-lg rounded-lg items-center justify-center`}>
                    <Text style={tw`text-xl text-gray-600`}>
                      {profile?.followingCount === 0
                        ? profile?.followingCount
                        : profile?.followingCount}
                    </Text>
                    <Text style={tw`text-base text-gray-600`}>Following</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={tw`flex-row items-center`}>
              <View style={tw`w-1/2.6 items-center justify-center`}>
                <Text style={tw`text-lg font-bold text-gray-700`}>
                  {correctCase(profile?.profile?.user?.name)}
                </Text>
              </View>
              <Text style={tw`text-lg text-gray-700`}>
                {profile?.profile?.location}
              </Text>
            </View>
            <View style={tw`flex-row items-center justify-between px-3`}>
              <Text style={tw`text-lg text-gray-700`}>
                {profile?.profile?.college}
              </Text>
              <TouchableOpacity
                onPress={async () => {
                  await Linking.openURL(
                    `whatsapp://send?text=Hello&phone=91${profile?.profile?.mobile}`,
                  );
                }}
                style={tw`flex-row items-center bg-green-500 px-2 py-1 rounded-lg`}>
                <Text style={tw`text-lg text-white`}>Chat</Text>
                <Icon
                  name="logo-whatsapp"
                  type="ionicon"
                  color="white"
                  size={20}
                  containerStyle={tw`rounded-xl ml-2`}
                />
              </TouchableOpacity>
            </View>
            <View style={tw`flex-row items-center px-3`}>
              {id !== profile?.profile?.user?._id && (
                <TouchableOpacity
                  style={
                    isFollow === true
                      ? tw`flex items-center justify-center shadow-lg bg-slate-100 py-1 px-3 rounded-lg w-full mt-5`
                      : tw`flex items-center justify-center shadow-xl shadow-white bg-slate-500 py-1 px-3 rounded-lg w-full mt-5`
                  }
                  onPress={() => {
                    dispatch(postFriend(profile?.profile?.user?._id)).then(
                      () => {
                        setIsFollow(!isFollow);
                      },
                    );
                  }}>
                  {isFollow === true ? (
                    <Text style={tw`text-lg text-gray-600 font-bold`}>
                      Following
                    </Text>
                  ) : (
                    <Text style={tw`text-lg text-white font-bold`}>Follow</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={tw`m-3 items-center justify-center`}>
            <Text style={tw`text-xl text-slate-500 mb-3 font-bold`}>
              {profile?.rides?.length > 0
                ? 'Active Rides Hosted'
                : 'No Active Rides Hosted'}
            </Text>
            {profile?.rides?.map((ride, index) => (
              <TouchableOpacity
                key={index}
                onPress={async () => {
                  await dispatch(getRideById(ride._id)).then(res => {
                    navigation.navigate('Ride');
                    navigation.navigate('SingleRide');
                  });
                }}
                style={tw`bg-slate-100 shadow-black shadow-xl p-3 rounded-xl mb-3 w-full`}>
                <View style={tw`flex-row justify-between`}>
                  <View style={tw`flex-row items-center`}>
                    <Image
                      source={{uri: profile?.profile?.user.photoURL}}
                      style={tw`w-10 h-10 rounded-xl mr-2`}
                    />
                    {ride.vehicleType === 'car' ? (
                      <Icon
                        name="directions-car"
                        type="material"
                        color="#737373"
                        size={30}
                      />
                    ) : (
                      <Icon
                        name="two-wheeler"
                        type="material"
                        color="#737373"
                        size={40}
                      />
                    )}
                    <Text style={tw`text-lg font-semibold ml-1 text-gray-600`}>
                      {ride.seats}
                    </Text>
                    <Text style={tw`text-lg font-semibold ml-2 text-gray-600`}>
                      {ride?.price === 1 ? 'Free' : '₹' + ride?.price}
                    </Text>
                  </View>
                  <View style={tw`flex pr-1`}>
                    <Text
                      style={tw`text-lg font-bold text-right text-gray-600`}>
                      {new Date(ride.timestamp).toUTCString().substring(0, 11)}
                    </Text>
                    <Text style={tw`text-sm text-right text-black`}>
                      {new Date(ride.timestamp)
                        .toLocaleTimeString()
                        .split(':')
                        .slice(0, 2)
                        .join(':')}
                      {new Date(ride.timestamp)
                        .toLocaleTimeString()
                        //split the time string at the second colon
                        .substring(8, 11)}
                    </Text>
                  </View>
                </View>
                <View style={tw`flex`}>
                  <Text style={tw`font-bold text-lg text-gray-600`}>
                    {profile?.profile?.user?.name}
                  </Text>
                  {/* source to destination */}
                  <View style={tw`flex-row my-2`}>
                    <Icon
                      name="my-location"
                      type="material"
                      color="#2196f3"
                      size={20}
                      style={tw`mr-1`}
                    />
                    <Text style={tw`text-sm w-9/10 text-black`}>
                      {ride.source.length > 40
                        ? ride.source.substring(0, 40) + '...'
                        : ride.source}
                    </Text>
                  </View>
                  <View style={tw`flex-row `}>
                    <Icon
                      name="location-on"
                      type="material"
                      // dark red color
                      color="#b71c1c"
                      size={20}
                      style={tw`mr-1`}
                    />
                    <Text style={tw`text-sm w-9/10 text-black`}>
                      {ride.destination.length > 40
                        ? ride.destination.substring(0, 40) + '...'
                        : ride.destination}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        <Text>Loading...</Text>
      )}
    </SafeAreaView>
  );
};

export default SingleProfileScreen;
