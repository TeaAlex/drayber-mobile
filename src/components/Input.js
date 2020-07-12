import React from 'react';
import {View, Text, TextInput} from 'react-native';
import tailwind from "tailwind-rn";

const Input = ({ value, onChange, label = "", placeholder = "", secureTextEntry = false}) => {

  return (
    <View style={tailwind('w-full items-center p-2')}>
      {
        label && <Text style={tailwind('font-bold w-2/3 text-indigo-700 text-base mb-2 ml-1')}>{label}</Text>
      }
      <TextInput
        style={{...tailwind('bg-white text-gray-800 p-3 w-2/3 border-gray-500 rounded')}}
        onChangeText={value => onChange(value)}
        value={value}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

export default Input;
