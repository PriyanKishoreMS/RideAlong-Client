import {View, Text, SafeAreaView, Image, ScrollView} from 'react-native';
import {Button} from 'react-native-elements';
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import BackButton from '../components/BackButton';
import {passsengerRequest} from '../slices/passengerSlice';
import RideMap from '../components/RideMap';
import tw from 'twrnc';

const SingleRideScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [rideData, setRideData] = useState(null);

  var rideInfo = useSelector(state => state?.ride?.ride?.data);
  const id = useSelector(state => state?.ride?.ride?.id);

  useEffect(() => {
    setRideData(rideInfo);
    console.log(rideInfo, 'rideInfo');
    console.log(id, 'id');
  }, [rideInfo]);

  return (
    <SafeAreaView>
      <View style={tw`h-2/5`}>
        <RideMap rideData={rideData} />
      </View>
      <ScrollView>
        {rideData ? (
          <View style={tw`flex flex-col items-center justify-center`}>
            <Text style={tw`text-2xl font-bold text-gray-700`}>
              {rideData?.user?.name}
            </Text>
            <Text style={tw`text-lg text-gray-600`}>{rideData?.timestamp}</Text>
            <Text style={tw`text-lg text-gray-600`}>{rideData?.source}</Text>
            <Text style={tw`text-lg text-gray-600`}>
              {rideData?.destination}
            </Text>
            <Text style={tw`text-lg text-gray-600`}>{rideData?.seats}</Text>
            <Text style={tw`text-lg text-gray-600`}>{rideData?.price}</Text>
            <Text style={tw`text-lg text-gray-600`}>
              {rideData?.vehicleType}
            </Text>
            <Text style={tw`text-lg text-gray-600`}>
              {rideData?.vehicleNumber}
            </Text>
            <Text style={tw`text-lg text-gray-600`}>
              {rideData?.vehicleModel}
            </Text>
            <Button
              title="Request Ride"
              onPress={() => {
                dispatch(passsengerRequest(id));
              }}
              buttonStyle={tw`bg-blue-500`}
            />
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SingleRideScreen;
