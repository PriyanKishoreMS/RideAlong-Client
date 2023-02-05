import {View, Text, SafeAreaView, Image} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import MenuButton from '../../components/utils/MenuButton';

const NotificationScreen = ({notification}) => {
  // console.log(
  //   notification,
  //   '\n---------------notification here -----------------\n',
  // );
  return (
    <SafeAreaView style={tw`bg-white h-full`}>
      <View style={tw`p-5`}>
        {/* menu icon for sidebar */}
        <View style={tw`flex-row items-center`}>
          <MenuButton />
          <Text style={tw`text-xl font-light text-gray-700`}>
            Notifications
          </Text>
        </View>
      </View>
      {notification.length > 0 ? (
        notification.map((item, index) => (
          <View key={index} style={tw`flex-row p-5 items-center`}>
            {/* profile picture */}
            <View style={tw`w-10 h-10 rounded-full bg-gray-300`}>
              <Image
                source={{uri: item.data.picture}}
                style={tw`w-full h-full rounded-full`}
              />
            </View>
            <View style={tw`pl-3`}>
              <Text style={tw`text-lg font-medium text-gray-700`}>
                {item.notification.title}
              </Text>
              <Text style={tw`text-sm font-light text-gray-700`}>
                {item.notification.body}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <View style={tw`p-5 items-center`}>
          <Text style={tw`text-xl font-medium text-gray-500`}>
            No new notifications
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default NotificationScreen;
