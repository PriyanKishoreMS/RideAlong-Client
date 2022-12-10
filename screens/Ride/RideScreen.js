import {View, TextInput, SafeAreaView, ScrollView} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useDispatch} from 'react-redux';
import React, {useState, useEffect} from 'react';
import tw from 'twrnc';

import MenuButton from '../../components/utils/MenuButton';
import AllRides from './AllRides';
import FollowingRides from './FollowingRides';
import {getAllRides} from '../../slices/rideSlice';
import SearchScreen from './SearchScreen';

const RideScreen = ({navigation}) => {
  const Tab = createMaterialTopTabNavigator();
  const dispatch = useDispatch();
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(getAllRides([search, 1])).then(res => {
      setFilterData(res.payload);
    });
  }, [search]);

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`px-5 pt-5 pb-2 flex-row items-center`}>
        <MenuButton />
        <TextInput
          style={tw`bg-slate-200 rounded-xl px-4 py-2 w-5/6`}
          placeholder="Find Rides"
          onChangeText={text => setSearch(text)}
        />
      </View>
      {search.length > 0 ? (
        <SearchScreen navigation={navigation} rides={filterData} />
      ) : (
        <Tab.Navigator
          screenOptions={{
            // tabBarIndicatorStyle: {backgroundColor: '#3b82f6'},
            tabBarLabelStyle: {
              fontSize: 14,
              fontWeight: 'bold',
              textTransform: 'none',
            },
            tabBarStyle: {backgroundColor: 'white'},
          }}>
          <Tab.Screen
            name="All"
            children={() => <AllRides navigation={navigation} />}
          />
          <Tab.Screen
            name="Friends"
            children={() => <FollowingRides navigation={navigation} />}
          />
        </Tab.Navigator>
      )}
    </SafeAreaView>
  );
};

export default RideScreen;
