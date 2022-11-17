import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
// import DatePicker from 'react-native-date-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import tw from 'twrnc';
import {Button} from 'react-native-elements';

const ProfileForm = ({state, setState, open, setOpen, date, setDate}) => {
  const [dateState, setDateState] = useState(false);
  const userInfo = auth().currentUser;

  return (
    <View style={tw`flex items-center justify-center`}>
      <Image
        source={{uri: userInfo.photoURL}}
        style={tw`w-24 h-24 rounded-full mt-10`}
      />
      <Text style={tw`text-2xl font-bold m-2`}>
        Hello, {userInfo.displayName}
      </Text>
      {/* <Text style={tw`text-lg font-semibold m-2`}>Enter your details</Text> */}
      <TextInput
        style={tw` rounded-lg w-3/4 p-2 m-2 bg-gray-200`}
        placeholder="Mobile Number"
        keyboardType="number-pad"
        onChangeText={text => setState({...state, mobile: text})}
        value={state.mobile}
        //regex for mobile number
      />
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={tw`flex flex-row items-center bg-gray-200 rounded-lg w-3/4 m-2`}>
        <Text
          style={tw`font-normal ${
            dateState ? `text-black` : `text-gray-500`
          } p-1.5 m-2 w-3/4`}>
          {dateState ? date.toString().substr(4, 12) : 'Date of Birth'}
        </Text>
        <Button
          icon={{
            name: 'calendar',
            type: 'ionicon',
            color: '#007AFF',
          }}
          onPress={() => setOpen(true)}
          buttonStyle={tw`rounded-lg bg-transparent`}
          yearPlaceholder="Year"
          monthPlaceholder="Month"
          dayPlaceholder="Day"
        />

        {open && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || date;
              setOpen(false);
              setDate(currentDate);
              setState({...state, dob: currentDate});
              setDateState(true);
            }}
          />
        )}
      </TouchableOpacity>
      <TextInput
        style={tw`bg-gray-200 rounded-lg w-3/4 p-2 m-2`}
        placeholder="Location"
        onChangeText={text => setState({...state, location: text})}
        value={state.location}
      />
      <TextInput
        style={tw`bg-gray-200 rounded-lg w-3/4 p-2 m-2`}
        placeholder="College"
        onChangeText={text => setState({...state, college: text})}
        value={state.college}
      />
      <View style={tw`border-2 border-gray-200 rounded-lg w-3/4 m-2 `}>
        <RNPickerSelect
          onValueChange={value => setState({...state, vehicleType: value})}
          items={[
            {label: 'Bike', value: 'Bike'},
            {label: 'Car', value: 'Car'},
            {label: 'None', value: 'None'},
          ]}
          placeholder={{
            label: 'Select Vehicle Type',
            value: null,
          }}
          style={tw`text-black`}
          // style={tw`w-3/4 m-2 border-2 border-gray-200 text-gray-400 rounded-lg p-2`}
        />
      </View>
      {state.vehicleType !== 'None' ? (
        <>
          <TextInput
            style={tw`bg-gray-200 rounded-lg w-3/4 p-2 m-2`}
            placeholder="Vehicle Number"
            onChangeText={text => setState({...state, vehicleNumber: text})}
            value={state.vehicleNumber}
          />
          <TextInput
            style={tw`bg-gray-200 rounded-lg w-3/4 p-2 m-2`}
            placeholder="Vehicle Model"
            onChangeText={text => setState({...state, vehicleModel: text})}
            value={state.vehicleModel}
          />
        </>
      ) : null}
    </View>
  );
};

export default ProfileForm;
