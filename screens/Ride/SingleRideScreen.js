import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import React, {useState, useEffect, useRef, useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import tw from 'twrnc';
import {GOOGLEMAPS_API_KEY} from '@env';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';

import {passsengerRequest} from '../../slices/passengerSlice';
import {getMyUser} from '../../slices/userSlice';
import {getRideById} from '../../slices/rideSlice';
import {acceptPassenger, rejectPassenger} from '../../slices/passengerSlice';
import {getProfileById} from '../../slices/profileSlice';
import {deleteRide} from '../../slices/rideSlice';
import RideMap from '../../components/RideMap';
import {correctCase} from '../../components/utils/correctCase';

const SingleRideScreen = () => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '75%'], []);
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
      <View style={tw`h-5/5`}>
        <RideMap rideData={rideData} />
      </View>
      {/* <View style={tw`h-3/5`}> */}
      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
        <BottomSheetScrollView>
          {rideData && getTravelTime() ? (
            <View style={tw``}>
              <View style={tw`px-2.5 bg-slate-200 flex-row justify-between`}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={tw`justify-center z-5 rounded-full`}>
                  <Icon
                    name="chevron-back-outline"
                    color="#4b5563"
                    type="ionicon"
                    size={25}
                  />
                </TouchableOpacity>
                {rideData?.distance ? (
                  <Text style={tw`text-center py-2 text-lg font-bold`}>
                    {Math.round(
                      (rideData.distance / 1000 + Number.EPSILON) * 100,
                    ) / 100}{' '}
                    km - {rideData.travelTime}
                  </Text>
                ) : (
                  <Text style={tw`text-center py-2 text-xl font-bold`}>
                    Loading...
                  </Text>
                )}
                <View style={tw`flex-row items-center`}>
                  <Icon
                    // money icon
                    name="cash"
                    type="ionicon"
                    color="#059669"
                    size={17}
                    style={tw`mr-1`}
                  />
                  <Text style={tw`text-center py-2 text-lg font-bold`}>
                    ₹{rideData?.price}
                  </Text>
                </View>
              </View>
              <View style={tw`mt-3 px-5`}>
                <View style={tw` flex-row justify-between items-center`}>
                  <View style={tw`flex  w-10/21`}>
                    <View style={tw`flex-row items-center`}>
                      <Icon
                        name="my-location"
                        type="material"
                        color="#2196f3"
                        size={20}
                        style={tw`mr-1`}
                      />
                      <Text style={tw` font-bold text-lg text-black`}>
                        Origin{' '}
                      </Text>
                    </View>
                    <Text style={tw`text-left font-medium`}>
                      {rideData.source?.length > 50 ? (
                        <Text>{rideData.source.substring(0, 50)}..</Text>
                      ) : (
                        <Text>{rideData.source}</Text>
                      )}
                    </Text>
                  </View>
                  <View style={tw`flex w-10/21`}>
                    <Text style={tw`font-bold text-black text-lg text-right`}>
                      Destination{' '}
                      <Icon
                        name="location-on"
                        type="material"
                        // dark red color
                        color="#b71c1c"
                        size={20}
                        // style={tw``}
                      />
                    </Text>
                    <Text style={tw`text-left font-medium text-right`}>
                      {rideData.destination?.length > 50 ? (
                        <Text>{rideData.destination.substring(0, 50)}..</Text>
                      ) : (
                        <Text>{rideData.destination}</Text>
                      )}
                    </Text>
                  </View>
                </View>
                {/* date and time */}
                <View style={tw`mt-4 flex-row justify-between items-center`}>
                  <View style={tw`flex-row items-center`}>
                    <Icon
                      name="calendar-outline"
                      type="ionicon"
                      color="#2196f3"
                      size={18}
                      style={tw`mr-1`}
                    />
                    <Text style={tw` font-bold text-lg text-black`}>
                      {new Date(rideData?.timestamp)
                        .toUTCString()
                        .substring(0, 11)}
                    </Text>
                  </View>
                  <View style={tw`flex-row items-center`}>
                    <Text style={tw`text-right text-gray-800 text-sm mr-1`}>
                      {new Date(rideData?.timestamp)
                        .toLocaleTimeString()
                        .split(':')
                        .slice(0, 2)
                        .join(':')}
                      {new Date(rideData?.timestamp)
                        .toLocaleTimeString()
                        //split the time string at the second colon
                        .substring(8, 11)}
                    </Text>
                    <Icon
                      name="time"
                      type="ionicon"
                      color="#2196f3"
                      size={20}
                      style={tw`mr-1`}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  onPress={async () => {
                    await dispatch(getProfileById(rideData?.user?._id));
                    navigation.navigate('SingleProfile', {
                      id: userId,
                    });
                  }}
                  style={tw`mt-4 p-2 rounded-xl bg-stone-100 shadow-lg `}>
                  <View style={tw`flex-row justify-between items-center`}>
                    <View style={tw`flex-row items-center`}>
                      <Image
                        source={{
                          uri: rideData?.user?.photoURL,
                        }}
                        style={tw`w-10 h-10 mr-2 rounded-full`}
                      />
                      <View style={tw`flex`}>
                        <Text style={tw`text-xl font-bold text-gray-700`}>
                          {correctCase(rideData?.user?.name)}
                        </Text>
                        <Text style={tw`text-sm text-gray-500`}>Driver</Text>
                      </View>
                    </View>
                    {rideData?.vehicleType === 'car' ? (
                      <Icon
                        name="directions-car"
                        type="material"
                        color="#737373"
                        size={40}
                      />
                    ) : (
                      <Icon
                        name="two-wheeler"
                        type="material"
                        color="#737373"
                        size={40}
                      />
                    )}
                  </View>
                  <View style={tw`border-t mt-2 border-gray-300`}></View>
                  <View
                    style={tw`p-2 flex-row justify-between items-center mt-2`}>
                    <View style={tw`flex-row items-center`}>
                      <Icon
                        name="event-seat"
                        type="material"
                        color="#57534e"
                        size={30}
                        style={tw`mr-1`}
                      />
                      <Text style={tw`text-lg font-bold text-gray-500`}>
                        {rideData?.seats === 0 ? (
                          <Text>Full</Text>
                        ) : (
                          <Text>{rideData?.seats}</Text>
                        )}
                      </Text>
                    </View>
                    <Text style={tw`text-lg font-bold text-gray-500`}>
                      {(rideData?.vehicleModel).charAt(0).toUpperCase() +
                        (rideData?.vehicleModel).slice(1)}
                    </Text>
                    <Text style={tw`text-lg font-bold text-gray-500`}>
                      {rideData?.vehicleNumber}
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={tw`mt-6 flex-row justify-between`}>
                  <View style={tw` w-25/51`}>
                    <Text style={tw`text-lg text-gray-600`}>
                      {passengers?.length > 0
                        ? 'Passengers'
                        : 'No passengers yet'}
                    </Text>
                    {passengers?.map((passenger, index) => (
                      <TouchableOpacity
                        key={index}
                        style={tw`bg-green-100 p-1 rounded-l-full shadow-md flex-row items-center mt-2`}
                        onPress={async () => {
                          await dispatch(getProfileById(passenger?.user));
                          navigation.navigate('SingleProfile', {
                            id: userId,
                          });
                        }}>
                        <Image
                          source={{uri: passenger?.photoURL}}
                          style={tw`h-8 w-8 rounded-full`}
                        />
                        <Text style={tw`text-lg ml-2 text-gray-600`}>
                          {passenger?.name.length > 15
                            ? passenger?.name.substring(0, 15) + '...'
                            : passenger?.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={tw` w-25/51`}>
                    <Text style={tw`text-lg text-gray-600 text-right`}>
                      {requests?.length > 0 ? 'Requests' : 'No Requests yet'}
                    </Text>
                    {requests?.map((request, index) => (
                      <TouchableOpacity
                        key={index}
                        style={tw`bg-yellow-100 p-1 rounded-r-full shadow-md flex-row items-center mt-2 justify-end`}
                        onPress={async () => {
                          await dispatch(getProfileById(request?.user));
                          navigation.navigate('SingleProfile', {
                            id: userId,
                          });
                        }}>
                        <Text style={tw`text-lg mr-2 text-gray-600 text-right`}>
                          {request?.name.length > 15
                            ? request?.name.substring(0, 15) + '...'
                            : request?.name}
                        </Text>
                        <Image
                          source={{uri: request?.photoURL}}
                          style={tw`h-8 w-8 rounded-full`}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                {userId !== rideData?.user?._id ? (
                  <View style={tw`items-center my-4`}>
                    {rideData?.seats !== 0 ? (
                      // check if user is already a passenger
                      passengers?.find(
                        passenger => passenger?.user === userId,
                      ) ? (
                        <View style={tw`bg-gray-200 p-2 w-full items-center`}>
                          <Text style={tw`text-lg text-gray-600`}>
                            You are a passenger
                          </Text>
                        </View>
                      ) : requests?.find(
                          request => request?.user === userId,
                        ) ? (
                        <View style={tw`bg-gray-200 p-2 w-full items-center`}>
                          <Text style={tw`text-lg text-gray-600`}>
                            Your request is pending, please wait
                          </Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={tw`bg-black p-2 w-full rounded-lg items-center`}
                          onPress={async () => {
                            await dispatch(passsengerRequest(id));
                            await dispatch(getRideById(id));
                          }}>
                          <Text style={tw`text-lg text-white`}>
                            Request Ride
                          </Text>
                        </TouchableOpacity>
                      )
                    ) : passengers?.find(
                        passenger => passenger?.user === userId,
                      ) ? (
                      <View style={tw`bg-gray-200 p-2 w-full items-center`}>
                        <Text style={tw`text-lg text-gray-600`}>
                          You are a passenger
                        </Text>
                      </View>
                    ) : (
                      <View style={tw`bg-gray-200 p-2 w-full items-center`}>
                        <Text style={tw`text-lg text-gray-600`}>
                          Seats are Full
                        </Text>
                      </View>
                    )}
                  </View>
                ) : (
                  <View>
                    {requests?.length > 0 ? (
                      <View style={tw`mt-6 mb-2`}>
                        <View style={tw`bg-gray-200 p-1 w-full items-center`}>
                          <Text style={tw`text-lg text-gray-600`}>
                            Pending Requests
                          </Text>
                        </View>
                        {requests?.map((request, index) => (
                          <TouchableOpacity
                            onPress={async () => {
                              await dispatch(getProfileById(request?.user));
                              navigation.navigate('SingleProfile', {
                                id: userId,
                              });
                            }}
                            key={index}
                            style={tw`flex-row mt-3 items-center bg-blue-100 p-2 rounded-full justify-between`}>
                            <View style={tw`flex-row items-center`}>
                              <Image
                                source={{uri: request?.photoURL}}
                                style={tw`h-10 w-10 rounded-full`}
                              />
                              <Text style={tw`text-lg ml-2 text-gray-600`}>
                                {request?.name.length > 15
                                  ? request?.name.substring(0, 15) + '..'
                                  : request?.name}
                              </Text>
                            </View>
                            <View style={tw`flex-row items-center`}>
                              <TouchableOpacity
                                onPress={async () => {
                                  await dispatch(
                                    acceptPassenger([rideId, request?.user]),
                                  );
                                  await dispatch(getRideById(rideId));
                                }}
                                style={tw`bg-green-700 p-2 rounded-full w-10 h-10 mr-2`}>
                                <Icon
                                  name="checkmark-outline"
                                  type="ionicon"
                                  color="white"
                                  size={20}
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={async () => {
                                  await dispatch(
                                    rejectPassenger([rideId, request?.user]),
                                  );
                                  await dispatch(getRideById(rideId));
                                }}
                                style={tw`bg-red-700 p-2 rounded-full w-10 h-10`}>
                                <Icon
                                  name="close-outline"
                                  type="ionicon"
                                  color="white"
                                  size={20}
                                />
                              </TouchableOpacity>
                            </View>
                          </TouchableOpacity>
                        ))}
                        <Button
                          title="Delete Ride"
                          onPress={async () => {
                            await dispatch(deleteRide(rideId));
                            navigation.navigate('RideStack');
                          }}
                          buttonStyle={tw`bg-red-700 mt-5`}
                        />
                      </View>
                    ) : (
                      <View>
                        <View style={tw`bg-gray-200 p-1 w-full items-center`}>
                          <Text style={tw`text-lg text-gray-600`}>
                            No Pending Requests
                          </Text>
                        </View>
                        <Button
                          title="Delete Ride"
                          onPress={async () => {
                            await dispatch(deleteRide(rideId));
                            navigation.navigate('RideStack');
                          }}
                          buttonStyle={tw`bg-red-700`}
                        />
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
          ) : (
            <Text>Loading...</Text>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
      {/* </View> */}
    </SafeAreaView>
  );
};

export default SingleRideScreen;
