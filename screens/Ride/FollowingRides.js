import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Button} from 'react-native-elements';
import {Icon} from 'react-native-elements';
import tw from 'twrnc';

import {getFollowingRides} from '../../slices/rideSlice';
import {getRideById} from '../../slices/rideSlice';

const FollowingRides = ({navigation}) => {
  const dispatch = useDispatch();

  const [rides, setRides] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getFollowingRides(page)).then(res => {
      setLastPage(res?.payload?.totalPages);
      let arrData = [...rides, ...res?.payload?.rides];
      let uniqe = new Set(arrData.map(a => JSON.stringify(a)));
      arrData = Array.from(uniqe).map(a => JSON.parse(a));
      setRides(arrData);
    });
  }, [page]);

  const onRefresh = () => {
    dispatch(getFollowingRides(1)).then(res => {
      setLastPage(res?.payload?.totalPages);
      setRides(res?.payload?.rides);
    });
  };

  const itemView = ({item, index}) => {
    return (
      <View style={tw`mx-5 mb-5`}>
        <TouchableOpacity
          key={index}
          onPress={async () => {
            await dispatch(getRideById(item?._id)).then(res =>
              navigation.navigate('SingleRide'),
            );
          }}
          style={tw`bg-white p-3 rounded-xl shadow-xl w-full`}>
          <View style={tw`flex-row justify-between`}>
            <View style={tw`flex-row items-center`}>
              <Image
                source={{uri: item?.user.photoURL}}
                style={tw`w-10 h-10 rounded-xl mr-2`}
              />
              {item?.vehicleType === 'car' ? (
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
              <Text style={tw`text-lg font-semibold ml-1 text-gray-600`}>
                {item?.seats}
              </Text>
              <Text style={tw`text-lg font-semibold ml-2 text-gray-600`}>
                ₹{item?.price}
              </Text>
            </View>
            <View style={tw`flex pr-1`}>
              <Text style={tw`text-lg font-bold text-right text-gray-600`}>
                {new Date(item?.timestamp).toUTCString().substring(0, 11)}
              </Text>
              <Text style={tw`text-sm text-right text-black`}>
                {new Date(item?.timestamp)
                  .toLocaleTimeString()
                  .split(':')
                  .slice(0, 2)
                  .join(':')}
                {new Date(item?.timestamp)
                  .toLocaleTimeString()
                  //split the time string at the second colon
                  .substring(8, 11)}
              </Text>
            </View>
          </View>
          <View style={tw`flex`}>
            <Text style={tw`font-bold text-lg text-gray-600`}>
              {item?.user.name}
            </Text>
            {/* source to destination */}
            <View style={tw`flex-row my-2`}>
              <Icon
                name="my-location"
                type="material"
                color="#2196f3"
                size={20}
                style={tw`mr-1`}
              />
              <Text style={tw`text-sm w-9/10 text-black`}>
                {item?.source.length > 40
                  ? item?.source.substring(0, 40) + '...'
                  : item?.source}
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
              <Text style={tw`text-sm w-9/10 text-black`}>
                {item?.destination.length > 40
                  ? item?.destination.substring(0, 40) + '...'
                  : item?.destination}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const paging = () => {
    page > lastPage ? setPage(lastPage) : setPage(page + 1);
  };

  return (
    <View style={tw`flex-1 bg-stone-100`}>
      <View style={tw` justify-between items-center mt-3`}>
        <FlatList
          data={rides}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            paging();
          }}
          style={tw`bg-stone-100 w-full`}
          onEndReachedThreshold={0.5}
          renderItem={itemView}
        />
      </View>
    </View>
  );
};

export default FollowingRides;
