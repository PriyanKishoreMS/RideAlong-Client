import {View, Text} from 'react-native';
import React from 'react';
import {Button} from 'react-native-elements';
import {SafeAreaView} from 'react-native';

const ExploreScreen = ({navigation}) => {
  return (
    <SafeAreaView>
      <Button title="Go back to Home" onPress={() => navigation.goBack()} />
    </SafeAreaView>
  );
};

export default ExploreScreen;
