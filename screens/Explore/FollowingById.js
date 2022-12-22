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
import {useDispatch, useSelector} from 'react-redux';
import {getProfileById} from '../../slices/profileSlice';
import {getFollowingByUserId} from '../../slices/userSlice';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {getMyUser} from '../../slices/userSlice';
import {correctCase} from '../../components/utils/correctCase';

const FollowingById = ({route}) => {
  const {activeUser, activeUserName} = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [following, setFollowing] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(null);

  useEffect(() => {
    console.log(activeUser, 'activeUser');
    setLoading(true);
    dispatch(getFollowingByUserId([activeUser, page])).then(res => {
      console.log(res.payload, 'res.payload');
      setLastPage(res.payload?.totalPages);
      let arrFollowing = [...following, ...res.payload?.followingProfiles];
      let uniqe = new Set(arrFollowing.map(a => JSON.stringify(a)));
      arrFollowing = Array.from(uniqe).map(a => JSON.parse(a));
      setFollowing(arrFollowing);
      setLoading(false);
    });
    // console.log(lastPage, 'lastPage');
    console.log(page, 'page');
  }, [page]);

  useEffect(() => {
    dispatch(getMyUser()).then(res => {
      setId(res.payload?._id);
    });
  }, []);

  const renderLoader = () => {
    return loading ? (
      <View style={tw`flex-1 justify-center items-center m-2`}>
        <ActivityIndicator size="large" color="#777" />
      </View>
    ) : null;
  };

  const paging = () => {
    if (page < lastPage) {
      setPage(page + 1);
    }
  };

  return (
    <View
      style={tw`bg-stone-100 mt-1.5 mb-13`}
      showsVerticalScrollIndicator={false}>
      <View>
        <Text style={tw`text-xl font-bold text-gray-800 m-3`}>
          {correctCase(activeUserName)}'s Following
        </Text>
      </View>
      <FlatList
        data={following}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        onEndReached={() => paging()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderLoader}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={tw`flex-row mx-5 rounded-md mb-1 p-2.5 bg-white shadow-md items-center justify-between`}
            onPress={async () => {
              dispatch(getProfileById(item?._id)).then(res => {
                navigation.push('SingleProfile', {
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

export default FollowingById;
