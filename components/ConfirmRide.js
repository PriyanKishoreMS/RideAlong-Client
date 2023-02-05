import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useState, useEffect, useRef, useMemo} from 'react';
import tw from 'twrnc';
import {useSelector, useDispatch} from 'react-redux';
import {selectOrigin} from '../slices/navSlice';
import {selectDestination} from '../slices/navSlice';
import {selectTravelTimeInformation} from '../slices/navSlice';
import {Button} from 'react-native-elements';
import {Icon} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {Dropdown} from 'react-native-element-dropdown';

// import {getMyProfile} from '../slices/profileSlice';
import {postRide} from '../slices/rideSlice';
import Map from './Map';

const ConfirmRide = ({navigation}) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['45%', '70'], []);
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const travelTimeInformation = useSelector(selectTravelTimeInformation);
  const dispatch = useDispatch();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date(Date.now()));
  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [dateState, setDateState] = useState(false);
  const [timeState, setTimeState] = useState(false);
  // const [vehicle, setVehicle] = useState(null);
  const [free, setFree] = useState(false);

  // useEffect(() => {
  //   dispatch(getMyProfile()).then(res => {
  //     setVehicle(res.payload);
  //   });
  //   console.log('coming');
  // }, []);

  const [state, setState] = useState({
    date: new Date(),
    time: new Date(),
    origin: origin.description,
    destination: destination.description,
    originLat: origin.location.lat,
    originLng: origin.location.lng,
    destinationLat: destination.location.lat,
    destinationLng: destination.location.lng,
    travelTime: travelTimeInformation?.duration?.text,
    distance: travelTimeInformation?.distance?.value,
    seats: '',
    price: '',
    vehicleType: '',
    vehicleNumber: '',
    vehicleModel: '',
  });

  console.log('here', state);

  //covert date and time to one timestamp
  const convertDateTime = (date, time) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = time.getHours();
    const minute = time.getMinutes();

    const dateTime = new Date(`${year}-${month}-${day} ${hour}:${minute}:00`);

    return dateTime;
  };

  const types = [
    {
      label: 'Car',
      value: 'car',
    },
    {
      label: 'Bike',
      value: 'bike',
    },
  ];

  const handleRideSubmit = async () => {
    if (
      state.time == '' ||
      state.date == '' ||
      state.vehicleType == '' ||
      state.vehicleNumber == '' ||
      state.vehicleModel == '' ||
      state.seats == '' ||
      state.price == '' ||
      state.vehicleType == undefined ||
      state.vehicleNumber == undefined ||
      state.vehicleModel == undefined
    ) {
      console.log(convertDateTime(state.date, state.time));
      alert('Please fill all the fields');
    } else {
      try {
        const rides = {
          timestamp: convertDateTime(state.date, state.time).toString(),
          source: state.origin,
          destination: state.destination,
          sourceLat: state.originLat,
          sourceLng: state.originLng,
          destinationLat: state.destinationLat,
          destinationLng: state.destinationLng,
          travelTime: state.travelTime,
          distance: state.distance,
          seats: state.seats,
          price: state.price,
          vehicleType: state.vehicleType,
          vehicleNumber: state.vehicleNumber,
          vehicleModel: state.vehicleModel,
        };
        await dispatch(postRide({rides}));
        navigation.popToTop();
        navigation.popToTop();
        navigation.navigate('Ride');
      } catch (err) {
        console.log(err, 'error from confirm ride');
      }
    }
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`h-full`}>
        <Map />
      </View>
      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
        <BottomSheetScrollView>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`absolute top-3 left-5 z-5 rounded-full`}>
            <Icon name="chevron-back" type="ionicon" />
          </TouchableOpacity>
          <Text style={tw`text-center py-2 text-gray-800 text-xl font-bold`}>
            {/* round to 2 dicimal */}
            Confirm ride -{' '}
            {Math.round(
              (travelTimeInformation?.distance?.value / 1000 + Number.EPSILON) *
                100,
            ) / 100}{' '}
            km
          </Text>
          <View style={tw`justify-between mx-3 border-t border-gray-200`}>
            <View style={tw`flex-row justify-between items-center`}>
              <View style={tw`flex-row w-10/21 items-center justify-center`}>
                <Icon
                  name="my-location"
                  type="material"
                  color="#2196f3"
                  size={20}
                  style={tw`mr-1`}
                />
                <View style={tw`flex`}>
                  <Text style={tw` pt-3 font-bold text-gray-700`}>Origin </Text>
                  <Text style={tw`text-left text-black font-normal`}>
                    {origin?.description?.length > 30 ? (
                      <Text>{origin?.description.substring(0, 30)}..</Text>
                    ) : (
                      <Text>{origin?.description}</Text>
                    )}
                  </Text>
                </View>
              </View>
              <View style={tw`flex-row w-10/21 items-center justify-center`}>
                <View style={tw`flex`}>
                  <Text style={tw`font-bold text-gray-700 pt-3 text-right`}>
                    Destination{' '}
                  </Text>
                  <Text style={tw`text-black font-normal text-right`}>
                    {origin?.description?.length > 30 ? (
                      <Text>{destination?.description.substring(0, 30)}..</Text>
                    ) : (
                      <Text>{destination?.description}</Text>
                    )}
                  </Text>
                </View>
                <Icon
                  name="location-on"
                  type="material"
                  // dark red color
                  color="#b71c1c"
                  size={20}
                  style={tw`ml-1`}
                />
              </View>
            </View>
            {/* <View style={tw`flex flex-row`}>
              <Text style={tw`font-bold text-gray-600`}>Travel Time: </Text>
              <Text style={tw`text-left `}>
                {travelTimeInformation?.duration?.text}
              </Text>
            </View> */}

            <View style={tw`flex flex-row justify-between mt-2`}>
              <TouchableOpacity
                onPress={() => setOpenDate(true)}
                style={tw`flex flex-row items-center bg-gray-300 rounded-lg w-10/21 mt-2`}>
                <Text
                  style={tw`font-normal ${
                    dateState ? `text-black` : `text-gray-500`
                  } px-3 my-2 w-5/7`}>
                  {dateState ? date.toString().substr(4, 12) : 'Start Date'}
                </Text>
                <Button
                  icon={{
                    name: 'calendar',
                    type: 'ionicon',
                    color: '#007AFF',
                  }}
                  onPress={() => setOpenDate(true)}
                  buttonStyle={tw`rounded-lg bg-transparent`}
                />
              </TouchableOpacity>

              {openDate && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={(event, selectedDate) => {
                    const currentDate = selectedDate || date;
                    setOpenDate(false);
                    setDate(currentDate);
                    setState({...state, date: currentDate});
                    setDateState(true);
                  }}
                />
              )}

              <TouchableOpacity
                onPress={() => setOpenTime(true)}
                style={tw`flex flex-row items-center bg-gray-300 rounded-lg w-10/21 mt-2`}>
                {/* <Icon name="clock" type="feather" color="#007AFF" /> */}
                <Button
                  icon={{
                    name: 'time',
                    type: 'ionicon',
                    color: '#007AFF',
                  }}
                  onPress={() => setOpenTime(true)}
                  buttonStyle={tw`rounded-lg bg-transparent`}
                />
                <Text
                  style={tw`font-normal ${
                    timeState ? `text-black` : `text-gray-500`
                  } px-3 my-2 w-5/7`}>
                  {timeState ? time.toString().substr(16, 5) : 'Start Time'}
                </Text>
              </TouchableOpacity>
              {openTime && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={time}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={(event, selectedTime) => {
                    const currentTime = selectedTime || time;
                    setOpenTime(false);
                    setTime(currentTime);
                    setState({...state, time: currentTime});
                    setTimeState(true);
                  }}
                />
              )}
            </View>

            {state && (
              <>
                <View style={tw`flex-row justify-between mt-2`}>
                  <Dropdown
                    label="Type"
                    data={types}
                    value={state?.vehicleType}
                    labelField="label"
                    valueField="value"
                    onChange={text => {
                      setState({...state, vehicleType: text.value});
                      // console.log(state?.vehicleType);
                    }}
                    placeholder="Type"
                    placeholderStyle={tw`text-gray-500`}
                    selectedTextStyle={tw`text-black`}
                    style={tw`bg-gray-300 rounded-lg w-10/21 px-3 my-2 py-2`}
                  />
                  <TextInput
                    style={tw`bg-gray-300 rounded-lg w-10/21 px-3 my-2 py-2`}
                    placeholder="Model"
                    // defaultValue={vehicle?.vehicleModel}
                    value={state.vehicleModel}
                    onChangeText={text =>
                      setState({...state, vehicleModel: text})
                    }
                  />
                </View>
                <View style={tw`flex-row justify-between`}>
                  <TextInput
                    style={tw`bg-gray-300 rounded-lg w-10/21 px-3 my-2 py-2`}
                    placeholder="Number"
                    keyboardType="numeric"
                    // defaultValue={vehicle?.vehicleNumber}
                    value={state.vehicleNumber}
                    onChangeText={text =>
                      setState({...state, vehicleNumber: text})
                    }
                  />
                  <TextInput
                    style={tw`bg-gray-300 rounded-lg w-10/21 px-3 my-2 py-2`}
                    placeholder="Seats"
                    keyboardType="numeric"
                    value={state.seats}
                    onChangeText={text =>
                      setState({...state, seats: parseInt(text)})
                    }
                  />
                </View>
                <View style={tw`flex`}>
                  <Text style={tw`text-black font-light text-sm`}>
                    You can set a price for your ride or make it free!
                  </Text>
                  <View style={tw`flex-row justify-between`}>
                    <TextInput
                      style={tw`bg-gray-300 rounded-lg w-6/9 px-3 my-2 py-2`}
                      placeholder="Price"
                      keyboardType="numeric"
                      value={free ? 'Free' : state.price}
                      onChangeText={text => {
                        setState({...state, price: parseInt(text)});
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        setFree(!free);
                        setState({...state, price: 1});
                      }}
                      style={
                        free
                          ? tw`bg-green-500 rounded-lg w-4/13 px-3 my-2 py-2`
                          : tw`bg-slate-100 border border-green-500 rounded-lg w-4/13 px-3 my-2 py-2`
                      }>
                      <Text
                        style={
                          free
                            ? tw`text-white font-normal text-base`
                            : tw`text-green-600 font-normal text-base`
                        }>
                        {free ? 'Free' : 'Set Free'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}

            <View style={tw`flex-row justify-between`}>
              <Button
                title="Confirm Ride"
                containerStyle={tw`bg-black w-full mt-4`}
                buttonStyle={tw`bg-black w-full`}
                onPress={() => handleRideSubmit()}
              />
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default ConfirmRide;
