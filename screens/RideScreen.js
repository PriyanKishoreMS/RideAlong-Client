import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MenuButton from '../components/MenuButton';
import tw from 'twrnc';
import {useSelector, useDispatch} from 'react-redux';
import {getAllRides} from '../slices/rideSlice';
import {Icon} from 'react-native-elements';

const RideScreen = () => {
  const [rides, setRides] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllRides()).then(res => setRides(res.payload));
  }, []);

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView>
        <View style={tw`p-5 flex-row items-center`}>
          <MenuButton />
          <TextInput
            style={tw`bg-gray-200 rounded-xl px-4 py-2 w-5/6`}
            placeholder="Find Rides"
          />
        </View>
        <View style={tw`flex justify-between items-center mb-3 px-5`}>
          {rides &&
            rides.map((ride, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={tw`bg-white p-3 rounded-xl shadow-xl w-full mb-3`}>
                  <View style={tw`flex-row justify-between`}>
                    <View style={tw`flex-row items-center`}>
                      <Image
                        source={{uri: ride.user.photoURL}}
                        style={tw`w-10 h-10 rounded-xl mr-2`}
                      />
                      {ride.vehicleType === 'car' ? (
                        <Icon
                          name="directions-car"
                          type="material"
                          color="#737373"
                          size={30}
                        />
                      ) : (
                        <Icon
                          name="two-wheeler"
                          type="material"
                          color="#737373"
                          size={40}
                        />
                      )}
                      <Text style={tw`text-lg font-semibold ml-1`}>
                        {ride.seats}
                      </Text>
                      <Text style={tw`text-lg font-semibold ml-2`}>
                        ₹{ride.price}
                      </Text>
                    </View>
                    <View style={tw`flex pr-1`}>
                      <Text style={tw`text-lg font-bold text-right`}>
                        {ride.date.substr(0, 10)}
                      </Text>
                      <Text style={tw`text-sm text-right`}>
                        {ride.time.substr(16, 5)}
                      </Text>
                    </View>
                  </View>
                  <View style={tw`flex`}>
                    <Text style={tw`font-bold text-lg`}>{ride.user.name}</Text>
                    {/* source to destination */}
                    <View style={tw`flex-row my-2`}>
                      <Icon
                        name="my-location"
                        type="material"
                        color="#2196f3"
                        size={20}
                        style={tw`mr-1`}
                      />
                      <Text style={tw`text-sm w-9/10`}>
                        {ride.source.length > 40
                          ? ride.source.substring(0, 40) + '...'
                          : ride.source}
                      </Text>
                    </View>
                    <View style={tw`flex-row `}>
                      <Icon
                        name="location-on"
                        type="material"
                        // dark red color
                        color="#b71c1c"
                        size={20}
                        style={tw`mr-1`}
                      />
                      <Text style={tw`text-sm w-9/10`}>
                        {ride.destination.length > 40
                          ? ride.destination.substring(0, 40) + '...'
                          : ride.destination}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RideScreen;
