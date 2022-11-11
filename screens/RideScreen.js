import {View, Text, SafeAreaView, ScrollView} from 'react-native';
import React from 'react';
import MenuButton from '../components/MenuButton';
import tw from 'twrnc';

const RideScreen = () => {
  return (
    <SafeAreaView style={tw`bg-white h-full`}>
      <ScrollView>
        <View style={tw`p-5 flex-row items-center`}>
          <MenuButton />
          <Text style={tw`text-center py-2 text-xl`}>Find Rides</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RideScreen;
