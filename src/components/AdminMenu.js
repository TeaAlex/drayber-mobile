import React from 'react';
import tailwind from 'tailwind-rn';
import {TouchableHighlight, View} from 'react-native';
import MenuItem from './MenuItem';
import PersonSvg from '../assets/icons/person.svg';
import CarSvg from '../assets/icons/automobile.svg';

const AdminMenu = ({navigation}) => {
  const color = '#586CD9';


  return (
    <View style={tailwind('bg-gray-100 h-full items-center w-full')}>
      <View style={tailwind('bg-blue-500 w-full')}>
        <TouchableHighlight onPress={() => navigation.navigate('DriverValidation')}>
          <MenuItem text={'Compte Driver'}>
            <PersonSvg width={24} height={24} fill={color} />
          </MenuItem>
        </TouchableHighlight>
        <TouchableHighlight>
          <MenuItem text={'Compte Client'}>
            <CarSvg width={24} height={24} fill={color} />
          </MenuItem>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default AdminMenu;
