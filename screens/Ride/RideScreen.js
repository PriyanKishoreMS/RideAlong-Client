import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import {useSelector, useDispatch} from 'react-redux';
import {Icon} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';

import MenuButton from '../../components/MenuButton';
import {getAllRides} from '../../slices/rideSlice';
import {getRideById} from '../../slices/rideSlice';

const RideScreen = ({navigation}) => {
  const [rides, setRides] = useState();
  const [component, setComponent] = useState('followingRides');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllRides()).then(res => setRides(res.payload));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getAllRides()).then(res => setRides(res.payload));
    }, []),
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView>
        <View style={tw`p-5 flex-row items-center`}>
          <MenuButton />
          <TextInput
            style={tw`bg-slate-200 rounded-xl px-4 py-2 w-5/6`}
            placeholder="Find Rides"
          />
        </View>

        <View style={tw`flex-row px-5 mb-4 items-center h-8`}>
          <TouchableOpacity
            onPress={() => setComponent('followingRides')}
            //slide in from left
            style={tw`flex-1 h-full justify-center items-center rounded-l-lg ${
              component === 'followingRides' ? 'bg-blue-200' : 'bg-slate-200'
            }`}>
            <Text style={tw`font-bold`}>My Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setComponent('explore')}
            //slide in from left
            style={tw`flex-1 h-full justify-center rounded-r-lg items-center ${
              component === 'explore' ? 'bg-blue-200' : 'bg-slate-200'
            }`}>
            <Text style={tw`font-bold`}>All</Text>
          </TouchableOpacity>
        </View>

        <View style={tw`flex justify-between items-center mb-18 px-5`}>
          {rides &&
            rides.map((ride, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={async () => {
                    await dispatch(getRideById(ride._id)).then(res =>
                      navigation.navigate('SingleRide'),
                    );
                  }}
                  style={tw`bg-white p-3 rounded-xl shadow-xl w-full mb-3`}>
                  <View style={tw`flex-row justify-between`}>
                    <View style={tw`flex-row items-center`}>
                      <Image
                        source={{uri: ride.user.photoURL}}
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
                      <Text style={tw`text-lg font-semibold ml-1`}>
                        {ride.seats}
                      </Text>
                      <Text style={tw`text-lg font-semibold ml-2`}>
                        ₹{ride.price}
                      </Text>
                    </View>
                    <View style={tw`flex pr-1`}>
                      <Text style={tw`text-lg font-bold text-right`}>
                        {new Date(ride.timestamp)
                          .toUTCString()
                          .substring(0, 11)}
                      </Text>
                      <Text style={tw`text-sm text-right`}>
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
                    <Text style={tw`font-bold text-lg`}>{ride.user.name}</Text>
                    {/* source to destination */}
                    <View style={tw`flex-row my-2`}>
                      <Icon
                        name="my-location"
                        type="material"
                        color="#2196f3"
                        size={20}
                        style={tw`mr-1`}
                      />
                      <Text style={tw`text-sm w-9/10`}>
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
                      <Text style={tw`text-sm w-9/10`}>
                        {ride.destination.length > 40
                          ? ride.destination.substring(0, 40) + '...'
                          : ride.destination}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RideScreen;
