import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import {useDispatch} from 'react-redux';
import {getProfileById} from '../slices/profileSlice';
import {getMyFollowing} from '../slices/userSlice';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

const Following = ({id}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    dispatch(getMyFollowing()).then(res => {
      setFollowing(res.payload);
    });
    // console.log(following, 'following');
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getMyFollowing()).then(res => {
        setFollowing(res.payload);
      });
    }, []),
  );

  return (
    <ScrollView style={tw`px-5`}>
      {following?.map((following, index) => (
        <TouchableOpacity
          style={tw`flex-row m-2 p-2 bg-slate-50 rounded-lg shadow-md items-center justify-between`}
          onPress={async () => {
            dispatch(getProfileById(following?._id)).then(res => {
              navigation.navigate('SingleProfile', {
                id: id,
              });
            });
          }}
          key={index}>
          <View style={tw`flex-row items-center`}>
            <Image
              source={{uri: following?.photoURL}}
              style={tw`w-10 h-10 rounded-xl mr-2`}
            />
            <Text style={tw`font-bold text-lg text-gray-600`}>
              {following?.name.length > 18 ? (
                <Text>{following?.name.substring(0, 18)}..</Text>
              ) : (
                <Text>{following?.name}</Text>
              )}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Following;
