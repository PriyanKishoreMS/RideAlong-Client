import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {GOOGLEMAPS_API_KEY} from '@env';
import tw from 'twrnc';
import RideCard from '../components/RideCard';
import {useDispatch} from 'react-redux';
import {setDestination, setOrigin} from '../slices/navSlice';
import auth from '@react-native-firebase/auth';
import MenuButton from '../components/MenuButton';
import SelectAddress from '../components/SelectAddress';
import {Icon} from 'react-native-elements';
import {Avatar} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const user = auth().currentUser.displayName;
  const dispatch = useDispatch();
  var curHr = new Date().getHours();
  var greetings = '';
  if (curHr < 12) {
    greetings = 'Good Morning';
  } else if (curHr < 18) {
    greetings = 'Good Afternoon';
  } else {
    greetings = 'Good Evening';
  }

  return (
    <SafeAreaView style={tw`bg-white h-full`}>
      <View style={tw`p-5`}>
        {/* menu icon for sidebar */}
        <View style={tw`flex-row justify-between items-center`}>
          <View style={tw`flex-row items-center`}>
            <MenuButton />
            <Text style={tw`text-xl font-light text-gray-700`}>
              {greetings},{' '}
              {user
                .substring(0, user.indexOf(' '))
                .toLowerCase()
                .replace(/^\w/, c => c.toUpperCase())}
            </Text>
          </View>
          <Avatar
            rounded
            size="small"
            source={{
              uri: auth().currentUser.photoURL,
            }}
            onPress={() => navigation.navigate('Profile')}
          />
        </View>
        <GooglePlacesAutocomplete
          placeholder="Where from?"
          nearbyPlacesAPI="GooglePlacesSearch"
          returnKeyType={'search'}
          debounce={400}
          minLength={2}
          listViewDisplayed="auto"
          focusable={true}
          enablePoweredByContainer={false}
          onPress={(data, details = null) => {
            // console.log(data, details);
            dispatch(
              setOrigin({
                location: details.geometry.location,
                description: data.description,
              }),
            );
            dispatch(setDestination(null));
          }}
          fetchDetails={true}
          // currentLocation={true}
          // currentLocationLabel="Current location"
          //add clear button
          // clearButtonMode="always"
          styles={InputStyles}
          query={{
            key: GOOGLEMAPS_API_KEY,
            language: 'en',
            components: 'country:in',
          }}
          onFail={error => console.error(error)}
        />
        <TouchableOpacity style={tw`w-full bg-slate-200 rounded-xl mb-3`}>
          <View style={tw`flex-row items-center p-3`}>
            <Icon
              name="my-location"
              type="material"
              size={24}
              color="#2196F3"
              style={tw`px-4`}
            />
            <Text style={tw`text-base font-semibold pr-2 text-gray-700`}>
              Current Location
            </Text>
          </View>
        </TouchableOpacity>
        <SelectAddress />
        <RideCard />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const InputStyles = StyleSheet.create({
  container: {
    flex: 0,
    marginTop: 10,
  },
  textInput: {
    fontSize: 18,
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
});
