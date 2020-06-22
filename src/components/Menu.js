import React from "react";
import tailwind from "tailwind-rn";
import {View} from "react-native";
import MenuBackButton from "./MenuBackButton";
import MenuItem from "./MenuItem";
import PersonSvg from "../assets/icons/person.svg";
import CreditCardSvg from "../assets/icons/credit-card-outline.svg";
import CarSvg from "../assets/icons/automobile.svg";
import CloseSvg from "../assets/icons/close-square-outline.svg";

const Menu = ({navigation}) => {

  const color = '#586CD9'

  return (
    <View style={tailwind('bg-gray-100 h-full items-center w-full')}>
      {/*<View style={tailwind('flex flex-row items-center justify-start w-full px-2')}>*/}
      {/*  <MenuBackButton onPress={() => navigation.navigate('Map')}/>*/}
      {/*</View>*/}
      <View style={tailwind('bg-blue-500 w-full')}>
        <MenuItem text={'Mon profil'}>
          <PersonSvg width={24} height={24} fill={color}/>
        </MenuItem>
        <MenuItem text={'Moyen de paiements'}>
          <CreditCardSvg width={24} height={24} fill={color}/>
        </MenuItem>
        <MenuItem text={'Devenir chauffeur'}>
          <CarSvg width={24} height={24} fill={color}/>
        </MenuItem>
        <MenuItem text={'Deconnexion'}>
          <CloseSvg width={24} height={24} fill={color}/>
        </MenuItem>
      </View>
    </View>
  )
}

export default Menu
