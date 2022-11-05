import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {store} from './store';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import 'react-native-gesture-handler';
import StackNavigator from './navigators/StackNavigator';
import {AuthProvider} from './hooks/useAuth';
import 'react-native-gesture-handler';

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaProvider>
          <AuthProvider>
            <StackNavigator />
          </AuthProvider>
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
