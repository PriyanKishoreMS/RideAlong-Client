import {View, Text, TouchableOpacity} from 'react-native';
import {useEffect, useState} from 'react';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';

import {useDispatch} from 'react-redux';
import React from 'react';
import tw from 'twrnc';

import {getMyAddress} from '../slices/userSlice';
import {setDestination, setOrigin} from '../slices/navSlice';

const SetDestination = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [address, setAddress] = useState();

  useEffect(() => {
    setTimeout(() => {
      dispatch(getMyAddress()).then(res => {
        setAddress(res.payload);
      });
    }, 100);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getMyAddress()).then(res => {
        setAddress(res.payload);
      });
    }, []),
  );

  return (
    <View>
      <TouchableOpacity
        onPress={async () => {
          if (address?.home?.desc) {
            await dispatch(
              setDestination({
                location: {
                  lat: address?.home?.lat,
                  lng: address?.home?.lng,
                },
                description: address?.home?.desc,
              }),
            );
            navigation.navigate('ConfirmRide');
          } else navigation.navigate('HomeAddress');
        }}
        style={tw`w-full flex-row items-center p-3 bg-slate-200 rounded-xl`}>
        <Icon
          name="home-outline"
          type="ionicon"
          size={24}
          color="#2196F3"
          style={tw`px-4`}
        />
        <Text style={tw`text-base font-semibold pr-2 text-gray-700`}>Home</Text>
        {address?.home?.desc ? (
          // create marquee effect
          <Text style={tw`font-normal text-gray-600`}>
            {address?.home?.desc?.length > 30
              ? address?.home?.desc.substring(0, 30) + '...'
              : address?.home?.desc}
          </Text>
        ) : (
          <Text style={tw`font-normal text-gray-600`}>
            Save your Home Address
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          if (address?.work?.desc) {
            await dispatch(
              setDestination({
                location: {
                  lat: address?.work?.lat,
                  lng: address?.work?.lng,
                },
                description: address?.work?.desc,
              }),
            );
            navigation.navigate('ConfirmRide');
          } else navigation.navigate('HomeAddress');
        }}
        style={tw`w-full flex-row items-center p-3 bg-slate-200 mt-3 rounded-xl`}>
        <Icon
          name="briefcase-outline"
          type="ionicon"
          size={24}
          color="#2196F3"
          style={tw`px-4`}
        />
        <Text style={tw`text-base font-semibold pr-2 text-gray-700`}>Work</Text>
        {address?.work?.desc ? (
          // create marquee effect
          <Text style={tw`font-normal text-gray-600`}>
            {address?.work?.desc?.length > 30
              ? address?.work?.desc.substring(0, 30) + '...'
              : address?.work?.desc}
          </Text>
        ) : (
          <Text style={tw`font-normal text-gray-600`}>
            Save your Work Address
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SetDestination;
