import React from 'react';
import {Text, View, TouchableHighlight} from 'react-native';
import ArrowBack from '../assets/icons/arrow-back.svg';
import tailwind from 'tailwind-rn';

const MenuBackButton = ({onPress}) => {
  return (
    <View>
      <TouchableHighlight
        style={tailwind('p-2 rounded')}
        onPress={onPress}
      >
        <View style={tailwind('flex flex-row items-center')}>
          <ArrowBack width={24} height={24} fill={'#586CD9'}/>
          <Text style={tailwind('text-gray-700 font-semibold ml-2 text-lg')}>Menu</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};

export default MenuBackButton
