import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import auth from '@react-native-firebase/auth';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {GOOGLEMAPS_API_KEY} from '@env';
import {useDispatch} from 'react-redux';
import {setDestination} from '../slices/navSlice';
import {useNavigation} from '@react-navigation/native';
import BackButton from '../components/BackButton';

const DestinationCard = () => {
  const dispatch = useDispatch();
  const name = auth().currentUser.displayName;
  const navigation = useNavigation();
  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      <Text style={tw`text-center py-2 text-xl`}>
        Select a destination, {name.substring(0, name.indexOf(' '))}
      </Text>
      <View style={tw`border-t border-gray-200 flex-shrink`}>
        <GooglePlacesAutocomplete
          placeholder="Where to?"
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
              setDestination({
                location: details.geometry.location,
                description: data.description,
              }),
            );
            navigation.navigate('ConfirmRide');
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
        />
      </View>
    </SafeAreaView>
  );
};

export default DestinationCard;

const InputStyles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: 'white',
    paddingTop: 20,
  },
  textInput: {
    fontSize: 16,
    backgroundColor: '#DDDDDF',
    borderRadius: 10,
  },
  textInputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
});
