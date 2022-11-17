import {View, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import React from 'react';
import tw from 'twrnc';

const SelectAddress = () => {
  return (
    <View>
      <TouchableOpacity style={tw`w-full bg-slate-200 rounded-xl`}>
        <View style={tw`flex-row items-center p-3`}>
          <Icon
            name="home-outline"
            type="ionicon"
            size={24}
            color="#2196F3"
            style={tw`px-4`}
          />
          <Text style={tw`text-base font-semibold pr-2 text-gray-700`}>
            Home
          </Text>
          <Text style={tw`font-normal `}>Home Address</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={tw`w-full bg-slate-200 mt-3 rounded-xl`}>
        <View style={tw`flex-row items-center p-3`}>
          <Icon
            name="briefcase-outline"
            type="ionicon"
            size={24}
            color="#2196F3"
            style={tw`px-4`}
          />
          <Text style={tw`text-base font-semibold pr-2 text-gray-700`}>
            College
          </Text>
          <Text style={tw`font-normal `}>College Address</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SelectAddress;
