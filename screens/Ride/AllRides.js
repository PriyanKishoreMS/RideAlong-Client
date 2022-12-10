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
import {Icon} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';
import tw from 'twrnc';

import {getAllRides} from '../../slices/rideSlice';
import {getRideById} from '../../slices/rideSlice';

const AllRides = ({navigation}) => {
  const dispatch = useDispatch();

  const [rides, setRides] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getAllRides(['', page])).then(res => {
      setLastPage(res?.payload?.totalPages);
      let arrData = [...rides, ...res?.payload?.rides];
      let uniqe = new Set(arrData.map(a => JSON.stringify(a)));
      arrData = Array.from(uniqe).map(a => JSON.parse(a));
      setRides(arrData);
    });
  }, [page]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     setRides([]);
  //     setPage(1);
  //   }, []),
  // );

  const onRefresh = () => {
    setIsRefreshing(true);
    setRides([]);
    setPage(1);
    setIsRefreshing(false);
  };

  const itemView = ({item, index}) => {
    return (
      <View style={tw`px-3 py-2`}>
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
              <Text style={tw`text-lg font-semibold ml-1`}>{item?.seats}</Text>
              <Text style={tw`text-lg font-semibold ml-2`}>₹{item?.price}</Text>
            </View>
            <View style={tw`flex pr-1`}>
              <Text style={tw`text-lg font-bold text-right`}>
                {new Date(item?.timestamp).toUTCString().substring(0, 11)}
              </Text>
              <Text style={tw`text-sm text-right`}>
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
            <Text style={tw`font-bold text-lg`}>{item?.user.name}</Text>
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
              <Text style={tw`text-sm w-9/10`}>
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
    page > lastPage ? setPage(lastPage + 1) : setPage(page + 1);
  };

  return (
    <View style={tw`flex-1 bg-stone-100`}>
      <View style={tw`justify-between items-center px-2`}>
        <FlatList
          onRefresh={onRefresh}
          refreshing={isRefreshing}
          data={rides}
          ListEmptyComponent={
            onRefresh ? (
              <View style={tw`flex-1 justify-center items-center`}>
                <ActivityIndicator size="large" color="#2196f3" />
              </View>
            ) : (
              <View style={tw`flex-1 justify-center items-center`}>
                <Text style={tw`text-lg font-bold`}>No Rides Found</Text>
              </View>
            )
          }
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

export default AllRides;
