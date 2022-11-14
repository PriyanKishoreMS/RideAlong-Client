import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import {useDispatch} from 'react-redux';
import {getAllProfiles} from '../slices/profileSlice';
import tw from 'twrnc';
import MenuButton from '../components/MenuButton';
import {getProfileById} from '../slices/profileSlice';
import {useNavigation} from '@react-navigation/native';

const ExploreScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [profile, setProfile] = React.useState(null);

  useEffect(() => {
    dispatch(getAllProfiles()).then(res => {
      setProfile(res.payload);
    });
  }, []);

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView>
        <View style={tw`p-5 flex-row items-center`}>
          <MenuButton />
          <TextInput
            style={tw`bg-gray-200 rounded-xl px-4 py-2 w-5/6`}
            placeholder="Find People"
          />
        </View>
        <View style={tw`px-5`}>
          {profile &&
            profile.map((item, index) => {
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
                      {item.user.name}
                    </Text>
                    {/* <Text>{item.location}</Text> */}
                    <Text style={tw`text-lg`}>, {item.college}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExploreScreen;
