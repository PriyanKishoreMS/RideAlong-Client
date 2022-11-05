import {View, Text, SafeAreaView} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import {useSelector} from 'react-redux';
import {selectOrigin} from '../slices/navSlice';
import {selectDestination} from '../slices/navSlice';
import {Button} from 'react-native-elements';

const ConfirmRide = () => {
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  return (
    <SafeAreaView>
      <Text style={tw`text-center py-2 text-xl`}>Confirm your ride</Text>
      <View
        style={tw`justify-between mx-3 border-t border-gray-200 flex-shrink`}>
        <View style={tw`flex flex-row`}>
          <Text style={tw` py-3 font-bold text-gray-600`}>Origin: </Text>
          <Text style={tw`text-left py-3`}>
            {origin.description.length > 30 ? (
              <Text>{origin.description.substring(0, 30)}...</Text>
            ) : (
              <Text>{origin.description}</Text>
            )}
          </Text>
        </View>
        <View style={tw`flex flex-row`}>
          <Text style={tw`font-bold text-gray-600`}>Destination: </Text>
          <Text style={tw`text-left `}>
            {origin.description.length > 30 ? (
              <Text>{destination.description.substring(0, 30)}...</Text>
            ) : (
              <Text>{destination.description}</Text>
            )}
          </Text>
        </View>
        <Button
          title="Confirm Ride"
          containerStyle={tw`bg-black w-full mt-4`}
          buttonStyle={tw`bg-black w-full`}
          onPress={() => console.log('Confirm Ride')}
        />
      </View>
    </SafeAreaView>
  );
};

export default ConfirmRide;
