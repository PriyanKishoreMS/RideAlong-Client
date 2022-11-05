import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {GOOGLEMAPS_API_KEY} from '@env';
import tw from 'twrnc';
import RideCard from '../components/RideCard';
import {useDispatch} from 'react-redux';
import {setDestination, setOrigin} from '../slices/navSlice';
import auth from '@react-native-firebase/auth';

const HomeScreen = () => {
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
        <Text style={tw`text-xl mb-3`}>
          {greetings}, {user.substring(0, user.indexOf(' '))}
        </Text>
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
        <RideCard />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const InputStyles = StyleSheet.create({
  container: {
    flex: 0,
  },
  textInput: {
    fontSize: 18,
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
});
