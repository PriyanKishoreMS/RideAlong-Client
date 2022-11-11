import {View, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import {useSelector} from 'react-redux';
import {selectOrigin} from '../slices/navSlice';
import {selectDestination} from '../slices/navSlice';
import {selectTravelTimeInformation} from '../slices/navSlice';
import {Button} from 'react-native-elements';
import {Icon} from 'react-native-elements';

const ConfirmRide = ({navigation}) => {
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const travelTimeInformation = useSelector(selectTravelTimeInformation);

  return (
    <SafeAreaView>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={tw`absolute top-3 left-5 z-5 rounded-full`}>
        <Icon name="chevron-left" type="fontawesome" />
      </TouchableOpacity>
      <Text style={tw`text-center py-2 text-xl font-bold`}>
        {/* round to 2 dicimal */}
        Confirm ride -{' '}
        {Math.round(
          (travelTimeInformation?.distance?.value / 1000 + Number.EPSILON) *
            100,
        ) / 100}{' '}
        km
      </Text>
      <View
        style={tw`justify-between mx-3 border-t border-gray-200 flex-shrink`}>
        <View style={tw`flex flex-row`}>
          <Text style={tw` pt-3 font-bold text-gray-600`}>Origin: </Text>
          <Text style={tw`text-left pt-3`}>
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
        <View style={tw`flex flex-row`}>
          <Text style={tw`font-bold text-gray-600`}>Travel Time: </Text>
          <Text style={tw`text-left `}>
            {travelTimeInformation?.duration?.text}
          </Text>
        </View>
        <View style={tw`flex flex-row`}>
          <Text style={tw`font-bold text-gray-600`}>Start Time: </Text>
          <Text style={tw`text-left `}>Now</Text>
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
