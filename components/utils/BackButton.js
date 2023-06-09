import React from 'react';
import {Button} from 'react-native-elements';
import tw from 'twrnc';

const BackButton = ({navigation}) => {
  return (
    <Button
      // title="Back"
      onPress={() => navigation.goBack()}
      icon={{
        name: 'arrow-left',
        type: 'font-awesome',
        color: 'white',
        size: 15,
      }}
      // button at the left bottom corner
      containerStyle={tw`absolute top-0 left-0 m-3 z-50`}
      buttonStyle={tw`bg-gray-800 rounded-xl w-10 h-10`}
    />
  );
};

export default BackButton;
