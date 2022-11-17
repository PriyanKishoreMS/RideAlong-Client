import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {selectOrigin} from '../slices/navSlice';

const RideCard = () => {
  const navigation = useNavigation();
  const origin = useSelector(selectOrigin);
  return (
    <SafeAreaView style={tw`bg-white`}>
      {/* Create a card of full width */}
      <TouchableOpacity
        style={tw`flex-row justify-between bg-white w-full px-4 py-3 shadow-lg rounded-xl mt-4`}
        disabled={!origin}
        onPress={() => navigation.navigate('Map')}>
        {/* Left side of the card */}
        {/* tw`${!origin && 'opacity-20'}` */}
        <View style={origin ? {opacity: 1} : {opacity: 0.2}}>
          <Text style={tw`text-xl font-semibold text-gray-700`}>
            Schedule ride{' '}
            <Icon name="timer-outline" color="#2196F3" size={20} />
          </Text>
          <Text style={tw`text-gray-500`}>Select your destination</Text>
          <Image
            source={require('../assets/images/uberx.png')}
            style={{
              width: 100,
              height: 100,
              marginBottom: -10,
              resizeMode: 'contain',
            }}
          />
        </View>
        {/* Right side of the card */}
        <View style={tw`flex-row items-center`}>
          <Icon
            name="chevron-forward"
            size={40}
            color="gray"
            style={origin ? {opacity: 1} : {opacity: 0.2}}
          />
          {/* <Icon name="arrow-forward-circle-outline" size={40} color="#777777" /> */}
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default RideCard;
