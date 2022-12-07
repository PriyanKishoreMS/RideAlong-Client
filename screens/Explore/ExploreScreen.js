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
import SearchScreen from './SearchScreen';

const ExploreScreen = () => {
  const Tab = createMaterialTopTabNavigator();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [id, setId] = useState('');

  const args = [search, page];
  useEffect(() => {
    dispatch(getAllUsers(args)).then(res => {
      setData([...data, ...res?.payload?.user]);
      setLastPage(res?.payload?.totalPages);
    });
    dispatch(getMyUser()).then(res => {
      setId(res.payload?._id);
    });
  }, [page]);

  useEffect(() => {
    dispatch(getAllUsers([search, 1])).then(res => {
      setFilterData(res.payload);
    });
  }, [search]);

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
          <Tab.Screen
            name="All"
            children={() => (
              <AllUsers
                data={data}
                search={search}
                page={page}
                setPage={setPage}
                filterData={filterData}
                lastPage={lastPage}
              />
            )}
          />

          <Tab.Screen name="Followers" children={() => <Followers id={id} />} />
        </Tab.Navigator>
      )}
    </SafeAreaView>
  );
};

export default ExploreScreen;
