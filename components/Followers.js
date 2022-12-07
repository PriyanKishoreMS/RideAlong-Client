import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Button,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import {useDispatch} from 'react-redux';
import {getProfileById} from '../slices/profileSlice';
import {getMyFollowers} from '../slices/userSlice';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

const Followers = ({id}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [followers, setFollowers] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    dispatch(getMyFollowers(page)).then(res => {
      setFollowers([...followers, ...res.payload?.followersProfiles]);
      setLastPage(res.payload?.totalPages);
    });
  }, [page]);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getMyFollowers(page)).then(res => {
        setFollowers([...followers, ...res.payload?.followersProfiles]);
        setLastPage(res.payload?.totalPages);
      });
    }, []),
  );

  const paging = () => {
    page > lastPage ? null : setPage(page + 1);
  };

  return (
    <View style={tw`bg-stone-100`} showsVerticalScrollIndicator={false}>
      <FlatList
        data={followers}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        onEndReached={() => paging()}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={tw`flex-row mx-2 mb-0.5 p-2.5 bg-white shadow-md items-center justify-between`}
            onPress={async () => {
              dispatch(getProfileById(item?._id)).then(res => {
                navigation.navigate('SingleProfile', {
                  id: id,
                });
              });
            }}
            key={index}>
            <View style={tw`flex-row items-center`}>
              <Image
                source={{uri: item?.photoURL}}
                style={tw`w-10 h-10 rounded-xl mr-2`}
              />
              <Text style={tw`font-bold text-lg text-gray-600`}>
                {item?.name.length > 18 ? (
                  <Text>{item?.name.substring(0, 18)}..</Text>
                ) : (
                  <Text>{item?.name}</Text>
                )}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Followers;
