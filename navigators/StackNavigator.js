import React, {useContext, useState, useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';

import auth from '@react-native-firebase/auth';
import {useDispatch} from 'react-redux';

import {AuthContext} from '../hooks/useAuth';
import {getMyProfile} from '../slices/profileSlice';

import ProfileCreateScreen from '../screens/ProfileCreateScreen';
import LoginScreen from '../screens/LoginScreen';
import MainTabScreen from '../screens/navigator/MainTabScreen';
import {DrawerContent} from '../screens/DrawerContent';

const Drawer = createDrawerNavigator();
const CreateProfileStack = createStackNavigator();
const LoginStack = createStackNavigator();

const StackNavigator = () => {
  const {user, setUser} = useContext(AuthContext);
  const {profile, setProfile} = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);

  const dispatch = useDispatch();

  const onAuthStateChanged = user => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    // dispatch(getSingleUser()).then(res => {
    //   if (res.payload == 200) {
    //     setProfile(false);
    //   }
    // });
    dispatch(getMyProfile());
    console.log(profile);
  }, [user]);

  if (initializing) return null;

  const CreateProfileStackScreen = () => (
    <CreateProfileStack.Navigator>
      <CreateProfileStack.Screen
        name="Profile-CreateStack"
        component={ProfileCreateScreen}
        options={{
          headerShown: false,
        }}
      />
    </CreateProfileStack.Navigator>
  );

  const LoginStackScreen = () => (
    <LoginStack.Navigator>
      <LoginStack.Screen
        name="LoginStack"
        component={LoginScreen}
        options={{headerShown: false}}
      />
    </LoginStack.Navigator>
  );

  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      initialRouteName="Main">
      {user ? (
        <>
          {profile ? (
            <Drawer.Screen
              name="Profile-Create"
              component={CreateProfileStackScreen}
              options={{
                headerShown: false,
              }}
            />
          ) : (
            <>
              <Drawer.Screen
                name="Ridealong"
                options={{
                  headerShown: false,
                }}
                component={MainTabScreen}
              />
            </>
          )}
        </>
      ) : (
        <Drawer.Screen
          name="Login"
          component={LoginStackScreen}
          options={{headerShown: false}}
        />
      )}
    </Drawer.Navigator>
  );
};

// const DynamicHeader = route => {
//   // console.log(route.navigation.getState());
//   const {routes} = route.navigation.getState();
//   const currentRoute = routes[routes.length - 1].name;
//   console.log(currentRoute);
//   if (currentRoute === 'Profile') {
//     return false;
//   }
//   return true;
// };

export default StackNavigator;
