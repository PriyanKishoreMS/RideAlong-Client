import {View, Text} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import Map from '../components/Map';
import {createStackNavigator} from '@react-navigation/stack';
import DestinationCard from '../components/DestinationCard';
import ConfirmRide from '../components/ConfirmRide';

const MapScreen = () => {
  const Stack = createStackNavigator();
  return (
    <View>
      <View style={tw`h-1/2 w-full`}>
        {/* <BackButton navigation={navigation} /> */}
        <Map />
      </View>
      <View style={tw`h-1/2 w-full`}>
        <Stack.Navigator>
          <Stack.Screen
            name="NavigateCard"
            component={DestinationCard}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ConfirmRide"
            component={ConfirmRide}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </View>
    </View>
  );
};

export default MapScreen;
