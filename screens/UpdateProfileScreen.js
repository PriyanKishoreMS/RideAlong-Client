import {View, KeyboardAvoidingView} from 'react-native';
import React, {useContext, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {AuthContext} from '../hooks/useAuth';
import {useDispatch} from 'react-redux';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import {getSingleProfile} from '../slices/profileSlice';
import {Button} from 'react-native-elements';

import {postProfile} from '../slices/profileSlice';
import ProfileForm from '../components/ProfileForm';

const UpdateProfileScreen = () => {
  const [state, setState] = useState({
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
  const navigation = useNavigation();

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
        if (state.vehicleType == 'None') {
          state.vehicleNumber = 'NA';
          state.vehicleModel = 'NA';
        }
        const profiles = {
          dob: state.dob.toString(),
          location: state.location,
          mobile: state.mobile,
          college: state.college,
          vehicleType: state.vehicleType,
          vehicleNumber: state.vehicleNumber,
          vehicleModel: state.vehicleModel,
        };
        await dispatch(postProfile({profiles}));
        setProfile(false);
        navigation.goBack();
        dispatch(getSingleProfile());
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
          <View
            style={tw`flex flex-row items-center justify-center mt-2 mb-10 px-12`}>
            <Button
              title="Submit"
              onPress={() => handleProfileSubmit()}
              containerStyle={tw`bg-black w-full mt-4`}
              buttonStyle={tw`bg-black w-full`}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateProfileScreen;
