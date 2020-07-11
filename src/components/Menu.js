import React, { useContext } from 'react';
import tailwind from 'tailwind-rn';
import {TouchableHighlight, View} from 'react-native';
import MenuItem from './MenuItem';
import PersonSvg from '../assets/icons/person.svg';
import CreditCardSvg from '../assets/icons/credit-card-outline.svg';
import Swap from '../assets/icons/swap-outline.svg';
import CarSvg from '../assets/icons/automobile.svg';
import Admin from '../assets/icons/person-done-outline.svg';
import CloseSvg from '../assets/icons/close-square-outline.svg';
import AsyncStorage from '@react-native-community/async-storage';
import {UserContext} from "./../context/UserContext";

const Menu = ({navigation}) => {
  const color = '#586CD9';


  const {user} = useContext(UserContext);

  const logout = () => {
    AsyncStorage.removeItem('token')
    navigation.navigate('Login')
  }
  const switchMode = async () => {
    const mode = await AsyncStorage.getItem('changeMode');
    if(mode === "Client"){
      if(user.driver){
        console.log(user.driver.active_driver)
        if(user.driver.active_driver === true){
          await AsyncStorage.setItem('changeMode', "Driver");
          navigation.navigate('Home')
        }else {
          alert("Votre compte Driver n'est pas encore activé")
        }
      } else {
        alert("Vous n'êtes pas chauffeur :(")
      }
    } else {
      await AsyncStorage.setItem('changeMode', "Client");
    }

  }

  const isDriver = () => {
    console.log(user)
    if(user.driver){
      return alert("Vous êtes déjà Driver ou votre compte est en attente d'activation.")
    } else {
      navigation.navigate('BecomeDriver')
    }
  }


  return (
    <View style={tailwind('bg-gray-100 h-full items-center w-full')}>
      {/*<View style={tailwind('flex flex-row items-center justify-start w-full px-2')}>*/}
      {/*  <MenuBackButton onPress={() => navigation.navigate('Map')}/>*/}
      {/*</View>*/}
      <View style={tailwind('bg-blue-500 w-full')}>
        <MenuItem text={'Mon profil'}>
          <PersonSvg width={24} height={24} fill={color} />
        </MenuItem>
        <TouchableHighlight onPress={() => navigation.navigate('PaymentFormView')}>
          <MenuItem text={'Moyen de paiements'}>
            <CreditCardSvg width={24} height={24} fill={color} />
          </MenuItem>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => switchMode()}>
          <MenuItem text={'Mode Driver'}>
            <Swap width={24} height={24} fill={color} />
          </MenuItem>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => isDriver()}>
        <MenuItem text={'Devenir chauffeur'}>
          <CarSvg width={24} height={24} fill={color} />
        </MenuItem>
        </TouchableHighlight>
        {user.user.role_id === 1 &&
            <TouchableHighlight onPress={() => navigation.navigate('Admin')}>
            <MenuItem text={'Admin'}>
              <Admin width={24} height={24} fill={color} />
            </MenuItem>
            </TouchableHighlight>
        }
        <TouchableHighlight onPress={() => logout()}>
        <MenuItem text={'Deconnexion'}>
          <CloseSvg width={24} height={24} fill={color} />
        </MenuItem>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default Menu;
