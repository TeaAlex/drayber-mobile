import React, {useContext, useState, useEffect} from 'react';
import {UserContext} from '../context/UserContext';
import AsyncStorage from '@react-native-community/async-storage';
import {Button, Text, View, TouchableOpacity, TextInput, TouchableHighlight} from 'react-native';
import FirebaseNotifHandler from './FirebaseNotifHandler';
import tailwind from 'tailwind-rn';
import MenuToggle from '../assets/icons/menu-toggle.svg';
import MenuItem from './MenuItem';
import MapView, {Polyline, PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import InputAddress from './InputAddress';
import Swap from '../assets/icons/swap-outline.svg';
import {showMessage, hideMessage} from 'react-native-flash-message';


function HomeScreen({navigation}) {
  const color = '#586CD9';

  const {user} = useContext(UserContext);
  const [mode, setMode] = useState('');
  const [currentPosition, setCurrentPosition] = useState(null);
  const [region, setRegion] = useState({
    latitude: 48.8587741,
    longitude: 2.2069771,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  });

  const [height, setHeight] = useState({
    map: '85%',
    info: '52%',
  });

  useEffect(() => {
    async function getMode() {
      setMode(await AsyncStorage.getItem('changeMode'));
    }

    getMode();
  }, []);


  const switchMode = async () => {
    const mode = await AsyncStorage.getItem('changeMode');
    if(mode === "Client"){
      if(user.driver){
        console.log(user.driver.active_driver)
        if(user.driver.active_driver === true){
          await AsyncStorage.setItem('changeMode', "Driver");
          navigation.navigate('Home')
        }else {
          showMessage({
            message: 'Erreur',
            description: "Votre compte Driver n'est pas encore activé.",
            type: 'danger',
            icon: 'danger',
          });
          // alert("Votre compte Driver n'est pas encore activé")
        }
      } else {
        showMessage({
          message: 'Erreur',
          description: "Vous n'êtes pas chauffeur :( ",
          type: 'danger',
          icon: 'danger',
        });
        // alert("Vous n'êtes pas chauffeur :(")
      }
    } else {
      await AsyncStorage.setItem('changeMode', "Client");
    }

  }

  return (
    <View style={tailwind('h-full w-full')}>
          {user.driver &&
          <TouchableOpacity
          style={{position: 'absolute', top: 40, right: 20, zIndex: 100}}
          onPress={() => navigation.navigate('Menu')}>
          <View style={tailwind('items-center p-3  bg-indigo-800 p-4 rounded')}> 
          <Text style={tailwind('text-white font-bold text-center text-lg')}>Solde :</Text>
          </View>
        </TouchableOpacity>
}

      <TouchableOpacity
        style={{position: 'absolute', top: 40, left: 20, zIndex: 100}}
        onPress={() => navigation.navigate('Menu')}>
        <MenuToggle />
      </TouchableOpacity>
      <MapView
        style={{...tailwind('w-full'), height: height.map}}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        loadingEnabled={true}
        region={region}
      />

      <View style={tailwind('w-full items-center mt-4 p-2')}>

      {user.driver  &&
            <TouchableHighlight style={tailwind('items-center p-3 w-2/3 bg-indigo-800 p-4 mb-10 rounded')}>
           <Text style={tailwind('text-white font-bold text-center text-lg')}>
            {' '} 
            En attente d'un client ... ⏳{' '}
          </Text>
        </TouchableHighlight>
        }

        {/* {user.driver.active_driver === false && */}

        <TouchableHighlight
            style={tailwind('items-center p-3 w-2/3 bg-indigo-800 p-4 rounded')}
            onPress={() => navigation.navigate('Search')}>
          <Text style={tailwind('text-white font-bold text-center text-lg')}>
            {' '}
            Où allez vous ? {' '}
          </Text>
        </TouchableHighlight>
        
        {/* } */}

        

      </View>

      {/* <Text>Home Screen</Text>
      <Text> Mode {mode}</Text>
      <Text>Bonjour {user.user.firstname}</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
      <Button
        title="Go to Map"
        onPress={() => navigation.navigate('Map')}
      />
      <Button
        title="Go to Search"
        onPress={() => navigation.navigate('Search')}
      />
      <Button
        title="Go to Menu"
        onPress={() => navigation.navigate('Menu')}
      /> */}
      <FirebaseNotifHandler />
    </View>
  );
}

export default HomeScreen;
