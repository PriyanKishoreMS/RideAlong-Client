import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import tw from 'twrnc';
import {Button, Icon} from 'react-native-elements';

import {getProfileById} from '../../slices/profileSlice';
import {postFriend} from '../../slices/userSlice';
import {getMyUser} from '../../slices/userSlice';
import {getAllUsers} from '../../slices/userSlice';

const AllUsers = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [id, setId] = useState('');
  const [following, setFollowing] = useState([]);
  const [data, setData] = useState([]);
  const [followChange, setFollowChange] = useState(false);
  const [lastPage, setLastPage] = useState(1);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getAllUsers(['', page])).then(res => {
      setLastPage(res?.payload?.totalPages);
      let arrData = [...data, ...res?.payload?.user];
      let uniqe = new Set(arrData.map(a => JSON.stringify(a)));
      arrData = Array.from(uniqe).map(a => JSON.parse(a));
      setData(arrData);
    });
    dispatch(getMyUser()).then(res => {
      setId(res.payload?._id);
    });
  }, [page]);

  useEffect(() => {
    dispatch(getMyUser()).then(res => {
      setId(res.payload?._id);
      setFollowing(res.payload?.following);
    });
  }, [followChange]);

  useFocusEffect(
    useCallback(() => {
      dispatch(getMyUser()).then(res => {
        setFollowing(res.payload?.following);
      });
    }, []),
  );

  const itemView = ({item, index}) => {
    return (
      <TouchableOpacity
        style={tw`flex-row mb-1 p-2.5 bg-white shadow-md rounded-md items-center justify-between`}
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
  };

  const paging = () => {
    page > lastPage ? setPage(lastPage + 1) : setPage(page + 1);
  };

  return (
    <View style={tw`bg-stone-100 mx-5 mt-1.5`}>
      <View>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            console.log(page, 'page');
            paging();
          }}
          style={tw``}
          // keyExtractor={item => item._id}
          renderItem={itemView}
        />
      </View>
    </View>
  );
};

export default AllUsers;
