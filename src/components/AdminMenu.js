import React from 'react';
import tailwind from 'tailwind-rn';
import {TouchableHighlight, View} from 'react-native';
import MenuItem from './MenuItem';
import CreditCardSvg from '../assets/icons/credit-card-outline.svg';
import CarSvg from '../assets/icons/automobile.svg';
import { ScrollView } from 'react-native-gesture-handler';

const AdminMenu = ({navigation}) => {
  const color = '#586CD9';


  return (
    <ScrollView>
    <View style={tailwind('bg-gray-100 h-full items-center w-full')}>
      <View style={tailwind('bg-blue-500 w-full')}>
        <TouchableHighlight onPress={() => navigation.navigate('DriverValidation')}>
          <MenuItem text={'Driver en attente de validation'}>
            <CarSvg width={24} height={24} fill={color} />
          </MenuItem>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => navigation.navigate('PayDriver')}>
          <MenuItem text={'Virement driver'}>
            <CreditCardSvg width={24} height={24} fill={color} />
          </MenuItem>
        </TouchableHighlight>
      </View>
    </View>
    </ScrollView>
  );
};

export default AdminMenu;
