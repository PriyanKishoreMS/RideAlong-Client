import {View, Text, Image} from 'react-native';
import React, {useEffect, useContext} from 'react';
import tw from 'twrnc';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  TouchableRipple,
  Switch,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../hooks/useAuth';

export function DrawerContent(props) {
  const userInfo = auth().currentUser;
  const {logout} = useContext(AuthContext);

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View
          style={tw`flex flex-col items-center justify-center bg-gray-200 py-10 mx-3 mt-3 rounded-xl`}>
          <Avatar.Image
            source={{
              uri: userInfo?.photoURL,
            }}
            size={100}
          />
          <Title style={tw`text-black text-xl mt-3`}>
            {userInfo?.displayName}
          </Title>
          <Caption style={tw`text-base`}>{userInfo?.email}</Caption>
        </View>
        <Drawer.Section style={tw`mt-10`}>
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="home-outline" color={color} size={size} />
            )}
            label="Home"
            onPress={() => {
              props.navigation.navigate('Ride');
            }}
          />
          {/* draw border */}
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="person-outline" color={color} size={size} />
            )}
            label="Profile"
            onPress={() => {
              props.navigation.navigate('Profile');
            }}
          />
        </Drawer.Section>
      </DrawerContentScrollView>
      <Drawer.Section style={tw`mb-10`}>
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="exit-outline" color={color} size={size} />
          )}
          style={tw`bg-gray-200 rounded-xl `}
          label="Sign Out"
          onPress={() => {
            props.navigation.closeDrawer();
            logout();
          }}
        />
      </Drawer.Section>
    </View>
  );
}
