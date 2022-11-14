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
import {useDispatch} from 'react-redux';
import {getAllProfiles} from '../slices/profileSlice';
import tw from 'twrnc';
import MenuButton from '../components/MenuButton';
import {getProfileById} from '../slices/profileSlice';
import {useNavigation} from '@react-navigation/native';
import {Icon} from 'react-native-elements';

const ExploreScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const args = [search, page];

  useEffect(() => {
    dispatch(getAllProfiles(args)).then(res => {
      setData(res.payload);
    });
  }, [search, page]);

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView>
        <View style={tw`p-5 flex-row items-center`}>
          <MenuButton />
          <TextInput
            style={tw`bg-gray-200 rounded-xl px-4 py-2 w-5/6`}
            placeholder="Find People"
            onChangeText={text => setSearch(text)}
          />
        </View>
        <View style={tw`px-5 mb-3`}>
          {data &&
            data.profile.map((item, index) => {
              return (
                <TouchableOpacity
                  style={tw`flex-row m-2 p-2 bg-gray-100 rounded-lg shadow-lg`}
                  onPress={async () => {
                    await dispatch(getProfileById(item?.user._id));
                    navigation.navigate('SingleProfile');
                  }}
                  key={index}>
                  <Image
                    source={{uri: item.user.photoURL}}
                    style={tw`w-10 h-10 rounded-xl mr-2`}
                  />
                  <View style={tw`flex-row items-center`}>
                    <Text style={tw`font-bold text-lg text-gray-600`}>
                      {item.name}
                    </Text>
                    {/* <Text>{item.location}</Text> */}
                    <Text style={tw`text-lg`}>, {item.college}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
        </View>
        {!search && (
          <View style={tw`flex-row items-center justify-center`}>
            {page > 1 && (
              <TouchableOpacity
                style={tw`rounded-full`}
                onPress={() => setPage(page - 1)}>
                <Icon
                  name="arrow-back"
                  type="ionicon"
                  color="black"
                  style={tw`p-2 bg-gray-200 rounded-xl`}
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
                  style={tw`p-2 bg-gray-200 rounded-xl mr-3`}
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

        {/* prev button */}
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
