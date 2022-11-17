import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import {Button, Icon} from 'react-native-elements';
import MenuButton from '../components/MenuButton';
import {getAllProfiles} from '../slices/profileSlice';
import {getProfileById} from '../slices/profileSlice';
import {postFriend} from '../slices/profileSlice';
import {getMyProfile} from '../slices/profileSlice';

const ExploreScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [following, setFollowing] = useState([]);
  const [followChange, setFollowChange] = useState(false);

  const args = [search, page];

  useEffect(() => {
    dispatch(getAllProfiles(args)).then(res => {
      setData(res.payload);
    });

    if (search) {
      setPage(1);
    }
  }, [search, page]);

  useEffect(() => {
    dispatch(getMyProfile()).then(res => {
      setFollowing(res.payload.following);
    });
  }, [followChange]);

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
        <View style={tw`px-5`}>
          {data &&
            data.profile.map((item, index) => {
              return (
                <TouchableOpacity
                  style={tw`flex-row m-2 p-2 bg-slate-50 rounded-lg shadow-md items-center justify-between`}
                  onPress={async () => {
                    await dispatch(getProfileById(item?.user._id));
                    navigation.navigate('SingleProfile');
                  }}
                  key={index}>
                  <View style={tw`flex-row items-center`}>
                    <Image
                      source={{uri: item.user.photoURL}}
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
                    {...(following.includes(item.user._id)
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
                          onPress: async () => {
                            await dispatch(postFriend(item.user._id));
                            setFollowChange(!followChange);
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

                          onPress: async () => {
                            await dispatch(postFriend(item.user._id));
                            setFollowChange(!followChange);
                          },
                        })}
                  />
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
          <View style={tw`flex-row items-center justify-center mt-5`}>
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
        {data?.profile.length === 0 && (
          <View style={tw`flex-1 items-center justify-center`}>
            <Text style={tw`text-lg font-light`}>No Profiles Found</Text>
          </View>
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
