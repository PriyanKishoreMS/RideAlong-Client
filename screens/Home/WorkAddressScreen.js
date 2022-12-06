import {View, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import React from 'react';
import {useDispatch} from 'react-redux';
import tw from 'twrnc';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {GOOGLEMAPS_API_KEY} from '@env';

import {putMyWorkAddress} from '../../slices/userSlice';

const WorkAddressScreen = ({navigation}) => {
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`p-5`}>
        <GooglePlacesAutocomplete
          placeholder="Enter Work Address"
          nearbyPlacesAPI="GoogleReverseGeocoding"
          GoogleReverseGeocodingQuery={{
            rankby: 'distance',
          }}
          GooglePlacesSearchQuery={{
            rankby: 'distance',
          }}
          returnKeyType={'search'}
          debounce={400}
          minLength={2}
          listViewDisplayed="auto"
          focusable={true}
          enableHighAccuracyLocation={true}
          isRowScrollable={true}
          enablePoweredByContainer={false}
          onPress={async (data, details = null) => {
            // console.log(details.geometry.location, details.formatted_address);
            // data.description = data.description || details.formatted_address;
            const location = {
              lat: details.geometry.location.lat,
              lng: details.geometry.location.lng,
              desc: data.description,
            };
            await dispatch(putMyWorkAddress({location}));
            navigation.goBack();
          }}
          fetchDetails={true}
          currentLocation={true}
          currentLocationLabel="Current location"
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
      </View>
    </SafeAreaView>
  );
};

export default WorkAddressScreen;

const InputStyles = StyleSheet.create({
  container: {
    flex: 0,
    marginTop: 10,
  },
  textInput: {
    fontSize: 18,
    backgroundColor: '#eee',
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
});
