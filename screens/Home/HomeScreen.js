import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {GOOGLEMAPS_API_KEY} from '@env';
import tw from 'twrnc';
import {useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';
import {Avatar} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
navigator.geolocation = require('@react-native-community/geolocation');
import {Icon} from 'react-native-elements';

import {setDestination, setOrigin} from '../../slices/navSlice';
import MenuButton from '../../components/utils/MenuButton';
import RideCard from '../../components/RideCard';
import SetOrigin from '../../components/SetOrigin';

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

  // const getCurrentLocation = () => {
  //   Geolocation.getCurrentPosition(
  //     position => {
  //       console.log(position);
  //       dispatch(
  //         setOrigin({
  //           location: {
  //             latitude: position.coords.latitude,
  //             longitude: position.coords.longitude,
  //           },
  //           description: 'Current Location',
  //         }),
  //       );
  //       dispatch(setDestination(null));
  //     },
  //     error => console.log(error),
  //     {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
  //   );
  // };

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
          onPress={(data, details = null) => {
            console.log(details.geometry.location, details.formatted_address);
            data.description = data.description || details.formatted_address;
            dispatch(
              setOrigin({
                location: details.geometry.location,
                description: data.description,
              }),
            );
            dispatch(setDestination(null));
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
        {/* <TouchableOpacity
          onPress={() => getCurrentLocation()}
          style={tw`w-full flex-row items-center p-3 bg-slate-200 rounded-xl mb-3`}>
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
        </TouchableOpacity> */}
        <SetOrigin />
        <RideCard />
        <View style={tw`flex-row items-center justify-between`}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ActiveRides')}
            style={tw`flex-row items-center justify-between py-3 bg-gray-200 w-10/21 rounded-xl mt-5`}>
            <Text style={tw`text-base font-semibold text-gray-700 pl-5`}>
              Active Rides
            </Text>
            <Icon
              // icon for active rides
              name="bolt"
              type="material"
              size={35}
              color="#2196F3"
              style={tw`pr-5`}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('InactiveRides')}
            style={tw`flex-row items-center justify-between py-3 bg-gray-200 w-10/21 rounded-xl mt-5`}>
            <Text style={tw`text-base font-semibold text-gray-700 pl-5`}>
              Past Rides
            </Text>
            <Icon name="done-all" size={35} color="#2196F3" style={tw`pr-5`} />
          </TouchableOpacity>
        </View>
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
