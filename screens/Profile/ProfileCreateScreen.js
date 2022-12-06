import {View, KeyboardAvoidingView} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import tw from 'twrnc';
import {SafeAreaView} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Button} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';

import {postProfile} from '../../slices/profileSlice';
import {AuthContext} from '../../hooks/useAuth';
import ProfileForm from '../../components/ProfileForm';

const ProfileCreateScreen = () => {
  const userInfo = auth().currentUser;
  const [state, setState] = useState({
    name: '',
    mobile: '',
    dob: new Date(),
    location: '',
    college: '',
    vehicleType: '',
    vehicleNumber: '',
    vehicleModel: '',
  });
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const {profile, setProfile} = useContext(AuthContext);

  const dispatch = useDispatch();

  const handleProfileSubmit = async () => {
    if (
      state.mobile == '' ||
      state.dob == '' ||
      state.location == '' ||
      state.college == '' ||
      state.vehicleType == '' ||
      (state.vehicleType !== 'None' &&
        (state.vehicleNumber == '' || state.vehicleModel == ''))
    ) {
      alert('Please fill all the fields');
    } else {
      try {
        const profiles = {
          name: userInfo.displayName,
          dob: state.dob.toString(),
          location: state.location,
          mobile: state.mobile,
          college: state.college,
          vehicleType: state.vehicleType,
          vehicleNumber: state.vehicleNumber,
          vehicleModel: state.vehicleModel,
        };
        await dispatch(postProfile({profiles}));
        // dispatch(getSingleUser()).then(res => {
        //   if (res.payload == 200) {
        //     setProfile(false);
        //   }
        // });
        setProfile(false);
        // navigation.navigate('Home');
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <SafeAreaView style={tw`bg-white h-full`}>
      <ScrollView>
        <KeyboardAvoidingView behavior="padding" style={tw`flex-1`} enabled>
          <ProfileForm
            open={open}
            setOpen={setOpen}
            date={date}
            setDate={setDate}
            state={state}
            setState={setState}
          />
          {/* left align buttons */}
          <View style={tw`flex flex-row items-center justify-center`}>
            <Button
              title="Submit"
              onPress={() => handleProfileSubmit()}
              style={tw`bg-blue-500 w-1/2`}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileCreateScreen;
