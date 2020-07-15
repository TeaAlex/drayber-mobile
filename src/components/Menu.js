import React, {useContext, useState} from 'react';
import tailwind from 'tailwind-rn';
import {TouchableHighlight, View} from 'react-native';
import MenuItem from './MenuItem';
import PersonSvg from '../assets/icons/person.svg';
import HomeSvg from '../assets/icons/home-outline.svg';
import CreditCardSvg from '../assets/icons/credit-card-outline.svg';
import Swap from '../assets/icons/swap-outline.svg';
import CarSvg from '../assets/icons/automobile.svg';
import Contact from '../assets/icons/alert-circle-outline.svg';
import Admin from '../assets/icons/person-done-outline.svg';
import CloseSvg from '../assets/icons/close-square-outline.svg';
import ClockSvg from '../assets/icons/clock-outline.svg';
import AsyncStorage from '@react-native-community/async-storage';
import {UserContext} from "../context/UserContext";
import {showMessage} from 'react-native-flash-message';
import {api} from "../utils/api";

const Menu = ({navigation}) => {
  const color = '#586CD9';
  
  
  const {user, setUser} = useContext(UserContext);
  
  const [mode, setMode] = useState('Mode Driver');
  
  
  const logout = () => {
    AsyncStorage.removeItem('token')
    navigation.navigate('Login')
  }
  const switchMode = async () => {
    if (user.driver) {
      console.log(user.driver.active_driver)
      if (user.driver.active_driver === true) {
        let body = {};
        if (user.driver.is_searching === false) {
          body = {
            "is_searching": true
          }
        } else {
          body = {
            "is_searching": false
          }
        }
        
        try {
          await api('PUT', '/users/update', body);
          const user = await api('GET', '/users/current-user');
          setUser(user);
          console.log(user.driver.is_searching);
          navigation.navigate('Home')
        } catch (e) {
          console.error(e);
        }
      } else {
        showMessage({
          message: 'Erreur',
          description: "Votre compte Driver n'est pas encore activé.",
          type: 'danger',
          icon: 'danger',
        });
      }
    } else {
      showMessage({
        message: 'Erreur',
        description: "Vous n'êtes pas chauffeur :( ",
        type: 'danger',
        icon: 'danger',
      });
    }
    
    
  }
  
  const isDriver = () => {
    console.log(user)
    if (user.driver) {
      return showMessage({
        message: 'Erreur',
        description: "Vous êtes déjà Driver ou votre compte est en attente d'activation. ",
        type: 'danger',
        icon: 'danger',
      });
      // return alert("Vous êtes déjà Driver ou votre compte est en attente d'activation.")
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
        <TouchableHighlight onPress={() => navigation.navigate('Home')}>
          <MenuItem text={'Accueil'}>
            <HomeSvg width={24} height={24} fill={color}/>
          </MenuItem>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => navigation.navigate('Profile')}>
          <MenuItem text={'Mon profil'}>
            <PersonSvg width={24} height={24} fill={color}/>
          </MenuItem>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => navigation.navigate('PaymentFormView')}>
          <MenuItem text={'Moyen de paiements'}>
            <CreditCardSvg width={24} height={24} fill={color}/>
          </MenuItem>
        </TouchableHighlight>
        
        {user.driver && user.driver.is_searching === true &&
        <TouchableHighlight onPress={() => switchMode()}><MenuItem text={"Mode Client"}>
          <Swap width={24} height={24} fill={color}/>
        </MenuItem>
        </TouchableHighlight>
        }
        
        {user.driver && user.driver.is_searching === false &&
        <TouchableHighlight onPress={() => switchMode()}><MenuItem text={"Mode Driver"}>
          <Swap width={24} height={24} fill={color}/>
        </MenuItem>
        </TouchableHighlight>
        }
        <TouchableHighlight onPress={() => isDriver()}>
          <MenuItem text={'Devenir chauffeur'}>
            <CarSvg width={24} height={24} fill={color}/>
          </MenuItem>
        </TouchableHighlight>
        {user.user.role_id === 1 &&
        <TouchableHighlight onPress={() => navigation.navigate('Admin')}>
          <MenuItem text={'Admin'}>
            <Admin width={24} height={24} fill={color}/>
          </MenuItem>
        </TouchableHighlight>
        }
        
        <TouchableHighlight onPress={() => navigation.navigate('HistoryTrip')}>
          <MenuItem text={'Historique des courses'}>
            <ClockSvg width={24} height={24} fill={color}/>
          </MenuItem>
        </TouchableHighlight>
        
        <TouchableHighlight onPress={() => navigation.navigate('Contact')}>
          <MenuItem text={'Contact'}>
            <Contact width={24} height={24} fill={"orange"}/>
          </MenuItem>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => logout()}>
          <MenuItem text={'Deconnexion'}>
            <CloseSvg width={24} height={24} fill={"#BC1717"}/>
          </MenuItem>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default Menu;
