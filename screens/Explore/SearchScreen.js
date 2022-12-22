import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import tw from 'twrnc';
import {Button, Icon} from 'react-native-elements';
import {getProfileById} from '../../slices/profileSlice';
import {postFriend} from '../../slices/userSlice';
import {getMyUser} from '../../slices/userSlice';

const SearchScreen = ({data}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [id, setId] = useState('');
  const [following, setFollowing] = useState([]);
  const [followChange, setFollowChange] = useState(false);

  useEffect(() => {
    dispatch(getMyUser()).then(res => {
      setId(res.payload?._id);
      setFollowing(res.payload?.following);
    });
  }, [followChange]);

  return (
    <ScrollView style={tw`bg-stone-100 mt-1.5`}>
      {data &&
        data?.user?.map((item, index) => {
          return (
            <TouchableOpacity
              style={tw`flex-row mx-5 mt-0.25 mb-1 rounded-md p-2.5 bg-white shadow-md items-center justify-between`}
              onPress={async () => {
                await dispatch(getProfileById(item?._id));
                navigation.navigate('SingleProfile', {
                  id: id,
                });
              }}
              key={index}>
              <View style={tw`flex-row items-center`}>
                <Image
                  source={{uri: item?.photoURL}}
                  style={tw`w-10 h-10 rounded-xl mr-2`}
                />
                <Text style={tw`font-bold text-lg text-gray-600`}>
                  {item.name.length > 18 ? (
                    <Text>{item.name.substring(0, 18)}..</Text>
                  ) : (
                    <Text>{item.name}</Text>
                  )}
                </Text>
                {/* <Text>{item.location}</Text> */}
              </View>
              <Button
                {...(following.includes(item._id)
                  ? {
                      //icon
                      icon: (
                        <Icon
                          name="checkmark"
                          type="ionicon"
                          color="green"
                          size={20}
                        />
                      ),
                      buttonStyle: tw`bg-green-100 rounded-lg ml-auto`,
                      onPress: () => {
                        dispatch(postFriend(item._id)).then(res => {
                          setFollowChange(!followChange);
                        });
                      },
                    }
                  : {
                      //icon
                      icon: (
                        <Icon
                          name="add-outline"
                          type="ionicon"
                          color="blue"
                          size={20}
                        />
                      ),
                      buttonStyle: tw`bg-blue-100 rounded-lg ml-auto`,

                      onPress: () => {
                        dispatch(postFriend(item._id)).then(res => {
                          setFollowChange(!followChange);
                        });
                      },
                    })}
              />
            </TouchableOpacity>
          );
        })}
    </ScrollView>
  );
};

export default SearchScreen;
