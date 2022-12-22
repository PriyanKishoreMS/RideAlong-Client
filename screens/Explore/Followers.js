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
import {getProfileById} from '../../slices/profileSlice';
import {getMyFollowers} from '../../slices/userSlice';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

const Followers = ({id}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [followers, setFollowers] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getMyFollowers(page)).then(res => {
      // setFollowers([...followers, ...res.payload?.followersProfiles]);
      setLastPage(res.payload?.totalPages);
      let arrFollowers = [...followers, ...res.payload?.followersProfiles];
      let uniqe = new Set(arrFollowers.map(a => JSON.stringify(a)));
      arrFollowers = Array.from(uniqe).map(a => JSON.parse(a));
      setFollowers(arrFollowers);
    });
  }, [page]);

  const onRefresh = () => {
    dispatch(getMyFollowers(1)).then(res => {
      console.log(res.payload, 'res.payload');
      setLastPage(res.payload?.totalPages);
      let arrFollowers = [...followers, ...res.payload?.followersProfiles];
      let uniqe = new Set(arrFollowers.map(a => JSON.stringify(a)));
      arrFollowers = Array.from(uniqe).map(a => JSON.parse(a));
      setFollowers(arrFollowers);
    });
  };

  const paging = () => {
    page > lastPage ? setPage(lastPage + 1) : setPage(page + 1);
  };

  return (
    <View style={tw`bg-stone-100 mt-1.5`} showsVerticalScrollIndicator={false}>
      <FlatList
        data={followers}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        onEndReached={() => paging()}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={tw`flex-row mx-5 mb-1 p-2.5 bg-white rounded-md shadow-md items-center justify-between`}
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
