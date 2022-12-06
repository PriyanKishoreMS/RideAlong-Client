import {View, Text, TextInput} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import React, {useEffect, useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import tw from 'twrnc';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {getAllUsers} from '../../slices/userSlice';
import {getMyUser} from '../../slices/userSlice';
import MenuButton from '../../components/MenuButton';
import AllUsers from '../../components/AllUsers';
import Following from '../../components/Following';
import Followers from '../../components/Followers';

const ExploreScreen = () => {
  const Tab = createMaterialTopTabNavigator();
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [id, setId] = useState('');

  const args = [search, page];
  useEffect(() => {
    dispatch(getAllUsers(args)).then(res => {
      setData(res.payload);
    });
    dispatch(getMyUser()).then(res => {
      setId(res.payload?._id);
    });

    if (search) setPage(1);

    console.log(data, 'data from useEffect');
  }, [search, page]);

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`px-5 pt-5 pb-2 flex-row items-center`}>
        <MenuButton />
        <TextInput
          style={tw`bg-slate-200 rounded-xl px-4 py-2 w-5/6`}
          placeholder="Find People"
          onChangeText={text => setSearch(text)}
        />
      </View>
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
        <Tab.Screen
          name="All"
          children={() => (
            <AllUsers
              data={data}
              setData={setData}
              search={search}
              setSearch={setSearch}
              page={page}
              setPage={setPage}
            />
          )}
        />

        <Tab.Screen name="Followers" children={() => <Followers id={id} />} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default ExploreScreen;
