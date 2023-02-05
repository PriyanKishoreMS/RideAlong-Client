import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Button,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import {useDispatch} from 'react-redux';
import {getProfileById} from '../../slices/profileSlice';
import {getMyFollowing} from '../../slices/userSlice';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

const Following = ({id}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [following, setFollowing] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(getMyFollowing(page)).then(res => {
      // setFollowing([...following, ...res.payload?.followingProfiles]);
      setLastPage(res.payload?.totalPages);
      let arrFollowing = [...following, ...res.payload?.followingProfiles];
      let uniqe = new Set(arrFollowing.map(a => JSON.stringify(a)));
      arrFollowing = Array.from(uniqe).map(a => JSON.parse(a));
      setFollowing(arrFollowing);
      setLoading(false);
    });
    console.log(following, 'lastPage');
    console.log(page, 'page');
  }, [page]);

  const renderLoader = () => {
    return loading ? (
      <View style={tw`flex-1 justify-center items-center m-2`}>
        <ActivityIndicator size="large" color="#777" />
      </View>
    ) : null;
  };

  const onRefresh = () => {
    dispatch(getMyFollowing(1)).then(res => {
      setLastPage(res.payload?.totalPages);
      setFollowing(res.payload?.followingProfiles);
      setLoading(false);
    });
  };

  const paging = () => {
    page > lastPage ? setPage(lastPage + 1) : setPage(page + 1);
    // setPage(page + 1);
  };

  return (
    <View style={tw`bg-stone-100 mt-1.5`} showsVerticalScrollIndicator={false}>
      <FlatList
        data={following}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        onEndReached={() => paging()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderLoader}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={tw`flex-row mx-5 mb-1 rounded-md p-2.5 bg-white shadow-md items-center justify-between`}
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

export default Following;
