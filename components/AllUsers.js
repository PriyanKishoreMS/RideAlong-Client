import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import tw from 'twrnc';
import {Button, Icon} from 'react-native-elements';
import {getProfileById} from '../slices/profileSlice';
import {postFriend} from '../slices/userSlice';
import {getMyUser} from '../slices/userSlice';

const AllUsers = ({data, setData, search, setSearch, page, setPage}) => {
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
    console.log(data, 'data from tempScreen');
  }, [followChange]);

  useFocusEffect(
    useCallback(() => {
      dispatch(getMyUser()).then(res => {
        setFollowing(res.payload?.following);
      });
    }, []),
  );

  return (
    <ScrollView>
      <View>
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
      </View>
    </ScrollView>
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

export default AllUsers;
