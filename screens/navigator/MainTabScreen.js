import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

import HomeScreen from '../HomeScreen';
import ExploreScreen from '../ExploreScreen';
import ProfileScreen from '../ProfileScreen';
import MapScreen from '../MapScreen';
import UpdateProfileScreen from '../UpdateProfileScreen';
import SingleProfileScreen from '../SingleProfileScreen';
import RideScreen from '../RideScreen';

const HomeStack = createStackNavigator();
const ExploreStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#fff"
      barStyle={{backgroundColor: '#000'}}>
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarStyle: {display: 'none'},
          tabBarIcon: ({color}) => (
            <Icon name="ios-home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={ExploreStackScreen}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({color}) => (
            <Icon name="ios-search" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Ride"
        component={RideScreen}
        options={{
          tabBarLabel: 'Rides',
          tabBarIcon: ({color}) => (
            <Icon name="ios-car" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          // tabBarLabel: 'Profile',
          tabBarIcon: ({color}) => (
            <Icon name="ios-person" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabScreen;

const MainStackComponent = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainStack"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const ProfileStackComponent = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileStack1"
        component={ProfileScreen}
        options={{headerShown: false}}></Stack.Screen>
      <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} />
    </Stack.Navigator>
  );
};

const ExploreStackComponent = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ExploreStack"
        component={ExploreScreen}
        options={{headerShown: false}}></Stack.Screen>
      <Stack.Screen
        name="SingleProfile"
        component={SingleProfileScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="HomeStack"
      component={MainStackComponent}
      options={{headerShown: false}}
    />
  </HomeStack.Navigator>
);

const ExploreStackScreen = () => (
  <ExploreStack.Navigator>
    <ExploreStack.Screen
      name="ExploreStackScreen"
      component={ExploreStackComponent}
      options={{headerShown: false}}
    />
  </ExploreStack.Navigator>
);

const ProfileStackScreen = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen
      name="ProfileStack"
      component={ProfileStackComponent}
      options={{
        headerShown: false,
      }}
    />
  </ProfileStack.Navigator>
);
