import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {Icon} from 'react-native-elements';
import tw from 'twrnc';

import {getRideById} from '../../slices/rideSlice';

const SearchScreen = ({navigation, rides}) => {
  const dispatch = useDispatch();

  return (
    <View style={tw`bg-white flex justify-between items-center p-5`}>
      {rides &&
        rides?.rides?.map((ride, index) => {
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
                  <Text style={tw`text-lg font-semibold ml-1 text-gray-600`}>
                    {ride.seats}
                  </Text>
                  <Text style={tw`text-lg font-semibold ml-2 text-gray-600`}>
                    {ride?.price === 1 ? 'Free' : '₹' + ride?.price}
                  </Text>
                </View>
                <View style={tw`flex pr-1`}>
                  <Text style={tw`text-lg font-bold text-right text-gray-600`}>
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
                  {ride.user.name}
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
          );
        })}
    </View>
  );
};

export default SearchScreen;
