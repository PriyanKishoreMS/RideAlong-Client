import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import {useDispatch} from 'react-redux';
import {getProfileById} from '../slices/profileSlice';
import {useNavigation} from '@react-navigation/native';

const Followers = ({followers, id}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  return (
    <View style={tw`px-5`}>
      {followers?.map((follower, index) => (
        <TouchableOpacity
          style={tw`flex-row m-2 p-2 bg-slate-50 rounded-lg shadow-md items-center justify-between`}
          onPress={async () => {
            dispatch(getProfileById(follower?._id)).then(res => {
              navigation.navigate('SingleProfile', {
                id: id,
              });
            });
          }}
          key={index}>
          <View style={tw`flex-row items-center`}>
            <Image
              source={{uri: follower?.photoURL}}
              style={tw`w-10 h-10 rounded-xl mr-2`}
            />
            <Text style={tw`font-bold text-lg text-gray-600`}>
              {follower.name.length > 18 ? (
                <Text>{follower.name.substring(0, 18)}..</Text>
              ) : (
                <Text>{follower.name}</Text>
              )}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Followers;
