import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import tw from 'twrnc';

const MenuButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.toggleDrawer();
      }}
      style={tw`rounded-full`}>
      <Icon
        name="menu"
        type="ionicon"
        color="black"
        size={22}
        style={tw`p-2 bg-slate-200 rounded-xl mr-3`}
      />
    </TouchableOpacity>
  );
};

export default MenuButton;
