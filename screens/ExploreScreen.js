import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {SafeAreaView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import tw from 'twrnc';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {Button, Icon} from 'react-native-elements';
import MenuButton from '../components/MenuButton';
import {getAllUsers} from '../slices/userSlice';
import {getProfileById} from '../slices/profileSlice';
import {postFriend} from '../slices/userSlice';
import {getMyProfile} from '../slices/profileSlice';
import Following from '../components/Following';
import Followers from '../components/Followers';

const ExploreScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [id, setId] = useState('');
  const [following, setFollowing] = useState([]);
  const [followingData, setFollowingData] = useState([]);
  const [followersData, setFollowersData] = useState([]);
  const [followChange, setFollowChange] = useState(false);
  const [component, setComponent] = useState('following');

  const args = [search, page];

  useEffect(() => {
    dispatch(getAllUsers(args)).then(res => {
      setData(res.payload);
    });

    console.log(data, 'data from useEffect');

    if (search) {
      // setPage(1);
      setComponent('explore');
    }
  }, [search, page]);

  useEffect(() => {
    dispatch(getMyProfile())
      .then(res => {
        setId(res.payload?.profile?.user?._id);
        setFollowing(res.payload?.profile?.user?.following);
      })
      .catch(err => console.log(err));
  }, [followChange]);

  useFocusEffect(
    useCallback(() => {
      dispatch(getMyProfile())
        .then(res => {
          setFollowing(res.payload?.profile?.user?.following);
        })
        .catch(err => console.log(err));
    }, []),
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView>
        <View style={tw`p-5 flex-row items-center`}>
          <MenuButton />
          <TextInput
            style={tw`bg-slate-200 rounded-xl px-4 py-2 w-5/6`}
            placeholder="Find People"
            onChangeText={text => setSearch(text)}
          />
        </View>
        {/* 2 buttons side by side */}
        <View style={tw`flex-row px-5 mb-2 items-center h-8`}>
          <TouchableOpacity
            onPress={() => setComponent('following')}
            //slide in from left
            style={tw`flex-1 h-full justify-center items-center rounded-l-lg ${
              component === 'following' ? 'bg-blue-200' : 'bg-slate-200'
            }`}>
            <Text style={tw`font-bold`}>Following</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setComponent('explore')}
            //slide in from left
            style={tw`flex-1 h-full justify-center items-center ${
              component === 'explore' ? 'bg-blue-200' : 'bg-slate-200'
            }`}>
            <Text style={tw`font-bold`}>All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setComponent('followers')}
            //slide in from right
            style={tw`flex-1 h-full justify-center items-center rounded-r-lg ${
              component === 'followers' ? 'bg-blue-200' : 'bg-slate-200'
            }`}>
            <Text style={tw`font-bold`}>Followers</Text>
          </TouchableOpacity>
        </View>

        {component === 'explore' ? (
          <>
            <View style={tw`px-5`}>
              {data &&
                data.user.map((item, index) => {
                  return (
                    <TouchableOpacity
                      style={tw`flex-row m-2 p-2 bg-slate-50 rounded-lg shadow-md items-center justify-between`}
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
                                  name="checkmark-circle"
                                  type="ionicon"
                                  color="white"
                                  size={20}
                                />
                              ),
                              buttonStyle: tw`bg-green-600 rounded-lg p-2 ml-auto`,
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
                                  name="person-add"
                                  type="ionicon"
                                  color="white"
                                  size={20}
                                />
                              ),
                              buttonStyle: tw`bg-blue-500 rounded-lg p-2 ml-auto`,

                              onPress: () => {
                                dispatch(postFriend(item._id)).then(res => {
                                  setFollowChange(!followChange);
                                });
                              },
                            })}
                      />
                      {/* <Button
                    icon={
                      <Icon
                        name="person-add"
                        type="ionicon"
                        color="white"
                        size={20}
                      />
                    }
                    buttonStyle={tw`bg-blue-500 rounded-lg p-2 ml-auto`}
                    onPress={async () => {
                      await dispatch(postFriend(item.user._id));
                      setFollowChange(!followChange);
                    }}
                  /> */}
                    </TouchableOpacity>
                  );
                })}

              {/* }
                    icon={
                      <Icon
                        name="person-add-outline"
                        type="ionicon"
                        color="white"
                        size={20}
                      />
                    }
                    onPress={async () => {
                      await dispatch(postFriend(item?.user._id)).then(res => {
                        if (res.payload == 200) {
                          setFollowChange(!followChange);
                        }
                      });
                    }}
                    buttonStyle={tw`bg-blue-500 rounded-lg p-2 ml-auto`}
                  />
                </TouchableOpacity>
              );
            })} */}
            </View>
            {!search && (
              <View style={tw`flex-row items-center justify-center mt-3`}>
                {page > 1 && (
                  <TouchableOpacity
                    style={tw`rounded-full `}
                    onPress={() => setPage(page - 1)}>
                    <Icon
                      name="arrow-back"
                      type="ionicon"
                      color="black"
                      style={tw`p-2 bg-slate-200 rounded-xl`}
                    />
                  </TouchableOpacity>
                )}
                <Text style={tw`text-lg font-light mx-5`}>Page {page}</Text>
                {page < data?.totalPages && (
                  <TouchableOpacity
                    style={tw`rounded-full`}
                    onPress={() => setPage(page + 1)}>
                    <Icon
                      name="arrow-forward"
                      type="ionicon"
                      color="black"
                      style={tw`p-2 bg-slate-200 rounded-xl mr-3`}
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}
            {data?.user.length === 0 && (
              <View style={tw`flex-1 items-center justify-center`}>
                <Text style={tw`text-lg font-light`}>No Profiles Found</Text>
              </View>
            )}
          </>
        ) : component === 'followers' ? (
          <Followers id={id} />
        ) : (
          <Following id={id} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

//             data.profile.map((item, index) => {
//               return (
//                 <TouchableOpacity
//                   style={tw`flex-row m-2 p-2 bg-gray-100 rounded-lg shadow-lg`}
//                   onPress={async () => {
//                     await dispatch(getProfileById(item?.user._id));
//                     navigation.navigate('SingleProfile');
//                   }}
//                   key={index}>
//                   <Image
//                     source={{uri: item.user.photoURL}}
//                     style={tw`w-10 h-10 rounded-xl mr-2`}
//                   />
//                   <View style={tw`flex-row items-center`}>
//                     <Text style={tw`font-bold text-lg text-gray-600`}>
//                       {item.name}
//                     </Text>
//                     {/* <Text>{item.location}</Text> */}
//                     <Text style={tw`text-lg`}>, {item.college}</Text>
//                   </View>
//                 </TouchableOpacity>
//               );
//             })}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// <FlatList
//   data={data.profile}
//   onEndReachedThreshold={0.5}
//   showsVerticalScrollIndicator={false}
//   onEndReached={() => {
//     console.log('end reached');
//     setPage(page + 1);
//   }}
//   style={tw`mb-21`}
//   keyExtractor={item => item._id}
//   renderItem={({item, index}) => {
//     return (
//       <TouchableOpacity
//         style={tw`flex-row m-2 p-2 bg-gray-100 rounded-lg shadow-lg`}
//         onPress={async () => {
//           await dispatch(getProfileById(item?.user._id));
//           navigation.navigate('SingleProfile');
//         }}
//         key={index}>
//         <Image
//           source={{uri: item.user.photoURL}}
//           style={tw`w-10 h-10 rounded-xl mr-2`}
//         />
//         <View style={tw`flex-row items-center`}>
//           <Text style={tw`font-bold text-lg text-gray-600`}>
//             {item.name}
//           </Text>
//           {/* <Text>{item.location}</Text> */}
//           <Text style={tw`text-lg`}>, {item.college}</Text>
//         </View>
//       </TouchableOpacity>
//     );
//   }}
// />

export default ExploreScreen;
