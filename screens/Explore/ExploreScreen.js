import {View, Text, TextInput} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import tw from 'twrnc';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {getAllUsers} from '../../slices/userSlice';
import {getMyUser} from '../../slices/userSlice';
import MenuButton from '../../components/utils/MenuButton';
import AllUsers from './AllUsers';
import Following from './Following';
import Followers from './Followers';
import SearchScreen from './SearchScreen';

const ExploreScreen = () => {
  const Tab = createMaterialTopTabNavigator();
  const dispatch = useDispatch();
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState('');
  const [id, setId] = useState('');

  useEffect(() => {
    dispatch(getAllUsers([search, 1])).then(res => {
      setFilterData(res.payload);
    });
  }, [search]);

  useEffect(() => {
    dispatch(getMyUser()).then(res => {
      setId(res.payload?._id);
    });
  }, []);

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`px-5 pt-5 pb-2 flex-row items-center bg-white`}>
        <MenuButton />
        <TextInput
          style={tw`bg-slate-200 rounded-xl px-4 py-2 w-5/6`}
          placeholder="Find People"
          onChangeText={text => setSearch(text)}
        />
      </View>
      {search.length > 0 ? (
        <SearchScreen data={filterData} />
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
          <Tab.Screen name="Following" children={() => <Following id={id} />} />
          <Tab.Screen name="All" children={() => <AllUsers />} />

          <Tab.Screen name="Followers" children={() => <Followers id={id} />} />
        </Tab.Navigator>
      )}
    </SafeAreaView>
  );
};

export default ExploreScreen;
