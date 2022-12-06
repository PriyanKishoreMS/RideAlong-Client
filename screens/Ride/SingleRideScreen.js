import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Button} from 'react-native-elements';
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import tw from 'twrnc';
import {GOOGLEMAPS_API_KEY} from '@env';

import {passsengerRequest} from '../../slices/passengerSlice';
import {getMyUser} from '../../slices/userSlice';
import {getRideById} from '../../slices/rideSlice';
import {acceptPassenger, rejectPassenger} from '../../slices/passengerSlice';
import {getProfileById} from '../../slices/profileSlice';
import {deleteRide} from '../../slices/rideSlice';
import RideMap from '../../components/RideMap';

const SingleRideScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [rideData, setRideData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [rideId, setRideId] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [requests, setRequests] = useState([]);

  var rideInfo = useSelector(state => state?.ride?.ride?.data?.ride);
  var id = useSelector(state => state?.ride?.ride?.id);
  var passengersState = useSelector(
    state => state?.ride?.ride?.data?.passengerDetails,
  );
  var requestsState = useSelector(state => state?.ride?.ride?.data?.requests);

  useEffect(() => {
    dispatch(getMyUser()).then(res => {
      setUserId(res.payload._id);
    });
    setRideId(id);
    getTravelTime();
    setRideData(rideInfo);
  }, []);

  useEffect(() => {
    setPassengers(passengersState);
    setRequests(requestsState);
    console.log('hit');
  }, [passengersState, requestsState]);

  const getTravelTime = async () => {
    await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${rideData?.source}&destinations=${rideData?.destination}&key=${GOOGLEMAPS_API_KEY}`,
    )
      .then(res => res.json())
      .then(data => {
        setRideData({
          ...rideData,
          travelTime: data.rows[0].elements[0].duration.text,
          distance: data.rows[0].elements[0].distance.value,
        });
      })
      .catch(err => console.log(err));
  };

  return (
    <SafeAreaView>
      <View style={tw`h-2/5`}>
        <RideMap rideData={rideData} />
      </View>
      <View style={tw`h-3/5`}>
        <ScrollView>
          {rideData && getTravelTime() ? (
            <View style={tw`px-5`}>
              {/* <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={tw`absolute top-3 left-5 z-5 rounded-full`}>
              <Icon name="chevron-left" type="fontawesome" />
            </TouchableOpacity> */}
              <Text style={tw`text-center py-2 text-xl font-bold`}>Ride</Text>
              <View
                style={tw`justify-between mx-3 border-t border-gray-200 flex-shrink`}></View>

              <Text style={tw`text-2xl font-bold text-gray-700`}>
                {rideData?.user?.name}
              </Text>
              <Text style={tw`text-lg text-gray-600`}>
                {rideData?.timestamp}
              </Text>
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
              <Text style={tw`text-lg text-gray-600`}>
                {rideData.travelTime}
              </Text>
              <Text style={tw`text-lg text-gray-600`}>{rideData.distance}</Text>
              <Text style={tw`text-lg text-gray-600`}>
                Passengers Added: {passengers?.length}
              </Text>
              {passengers?.map((passenger, index) => (
                <View key={index} style={tw`flex-row items-center mt-2`}>
                  <Image
                    source={{uri: passenger?.photoURL}}
                    style={tw`h-10 w-10 rounded-full`}
                  />
                  <Text style={tw`text-lg ml-2 text-gray-600`}>
                    {passenger?.name}
                  </Text>
                </View>
              ))}
              <Text style={tw`text-lg text-gray-600`}>
                Requests: {requests?.length}
              </Text>
              {requests?.map((request, index) => (
                <View key={index} style={tw`flex-row items-center mt-2`}>
                  <Image
                    source={{uri: request?.photoURL}}
                    style={tw`h-10 w-10 rounded-full`}
                  />
                  <Text style={tw`text-lg ml-2 text-gray-600`}>
                    {request?.name.length > 15
                      ? request?.name.substring(0, 15) + '...'
                      : request?.name}
                  </Text>
                </View>
              ))}
              {userId !== rideData?.user?._id ? (
                <>
                  {passengers?.seats !== 0 ? (
                    // check if user is already a passenger
                    passengers?.find(
                      passenger => passenger?.user === userId,
                    ) ? (
                      <Text style={tw`text-lg text-gray-600`}>
                        You are already a passenger
                      </Text>
                    ) : requests?.find(request => request?.user === userId) ? (
                      <Text style={tw`text-lg text-gray-600`}>
                        You have already requested to join this ride
                      </Text>
                    ) : (
                      <Button
                        title="Request Ride"
                        onPress={async () => {
                          await dispatch(passsengerRequest(id));
                          await dispatch(getRideById(id));
                        }}
                        buttonStyle={tw`bg-black w-40 mb-5`}
                      />
                    )
                  ) : (
                    <Text style={tw`text-lg text-gray-600`}>
                      Seats are full
                    </Text>
                  )}
                </>
              ) : (
                <View>
                  {requests?.length > 0 ? (
                    <View style={tw`mt-3 mb-5`}>
                      <Text style={tw`text-lg text-gray-600 mb-3`}>
                        Review Requests
                      </Text>
                      {requests?.map((request, index) => (
                        <TouchableOpacity
                          onPress={async () => {
                            await dispatch(getProfileById(request?.user));
                            navigation.navigate('SingleProfile', {
                              id: userId,
                            });
                          }}
                          key={index}
                          style={tw`flex-row items-center`}>
                          <Image
                            source={{uri: request?.photoURL}}
                            style={tw`h-10 w-10 rounded-full`}
                          />
                          <Text style={tw`text-lg text-gray-600`}>
                            {request?.name.length > 12
                              ? request?.name.substring(0, 12) + '..'
                              : request?.name}
                          </Text>
                          <Button
                            title="Accept"
                            onPress={async () => {
                              await dispatch(
                                acceptPassenger([rideId, request?.user]),
                              );
                              await dispatch(getRideById(rideId));
                            }}
                            buttonStyle={tw`bg-green-600 w-20 mx-3`}
                          />
                          <Button
                            title="Reject"
                            onPress={async () => {
                              await dispatch(
                                rejectPassenger([rideId, request?.user]),
                              );
                              await dispatch(getRideById(rideId));
                            }}
                            buttonStyle={tw`bg-red-600 w-20`}
                          />
                        </TouchableOpacity>
                      ))}
                      <Button
                        title="Delete Ride"
                        onPress={async () => {
                          await dispatch(deleteRide(rideId));
                          navigation.navigate('RideStack');
                        }}
                        buttonStyle={tw`bg-red-600 mt-5`}
                      />
                    </View>
                  ) : (
                    <View>
                      <Text style={tw`text-lg text-gray-600`}>No Requests</Text>
                      <Button
                        title="Delete Ride"
                        onPress={async () => {
                          await dispatch(deleteRide(rideId));
                          navigation.navigate('RideStack');
                        }}
                        buttonStyle={tw`bg-red-600`}
                      />
                    </View>
                  )}
                </View>
              )}
            </View>
          ) : (
            <Text>Loading...</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SingleRideScreen;
