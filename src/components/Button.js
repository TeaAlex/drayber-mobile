import React from 'react';
import { View, Text, TextInput, TouchableHighlight } from 'react-native';
import tailwind from "tailwind-rn";

const Button = ({ title, onPress, bgColor = "bg-indigo-800", textColor = "text-white" }) => {

  return (
    <View style={tailwind('flex flex-row justify-center items-center mt-2')}>
      <TouchableHighlight style={{...tailwind( `${bgColor} p-4 rounded`)}} onPress={onPress}>
        <Text style={tailwind(`${textColor} font-bold text-center text-lg`)}> {title} </Text>
      </TouchableHighlight>
    </View>
  );
}

export default Button;
