import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import AsyncStorage from '@react-native-community/async-storage';
import { Text, View, TouchableOpacity, TouchableHighlight } from 'react-native';
import FirebaseNotifHandler from './FirebaseNotifHandler';
import tailwind, { getColor } from 'tailwind-rn';
import MenuToggle from '../assets/icons/menu-toggle.svg';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { showMessage } from 'react-native-flash-message';
import SearchIcon from '../assets/icons/search-outline.svg'
import HomeIcon from '../assets/icons/home-outline.svg'


function HomeScreen ({navigation}) {
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
    async function getMode () {
      setMode(await AsyncStorage.getItem('changeMode'));
    }

    getMode();
  }, []);


  const switchMode = async () => {
    const mode = await AsyncStorage.getItem('changeMode');
    if (mode === "Client") {
      if (user.driver) {
        console.log(user.driver.active_driver)
        if (user.driver.active_driver === true) {
          await AsyncStorage.setItem('changeMode', "Driver");
          navigation.navigate('Home')
        } else {
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
        <MenuToggle/>
      </TouchableOpacity>
      <MapView
        style={{...tailwind('w-full flex-grow')}}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        loadingEnabled={true}
        region={region}
      />

      <View style={{...tailwind('w-full items-center relative bg-gray-900 rounded-t-lg'), 'height': '20%'}}>

        {user.driver &&
        <TouchableHighlight style={tailwind('items-center p-3 w-2/3 bg-indigo-800 p-4 mb-10')}>
          <Text style={tailwind('text-white font-bold text-center text-lg')}>
            {' '}
            En attente d'un client ... ⏳{' '}
          </Text>
        </TouchableHighlight>
        }

        {/* {user.driver.active_driver === false && */}

        <TouchableHighlight
          style={{...tailwind('items-center p-3 w-10/12 bg-white p-6 rounded-lg absolute'),
            top: '-20%',
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.34,
            shadowRadius: 6.27,
            elevation: 10,
          }}
          onPress={() => navigation.navigate('Search')}>
          <View style={tailwind('flex flex-row justify-center w-full relative')}>
            <View style={ {...tailwind('absolute w-full'), 'left': '2%'} }>
              <SearchIcon width={24} height={24} fill={getColor('gray-700')}/>
            </View>
            <Text style={tailwind('text-gray-800 font-bold text-center text-lg')}>
              Où allez vous ?
            </Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          style={ {...tailwind('bg-white rounded-lg p-4 absolute'), top: '30%'} }
          onPress={() => { console.log('house') }}
        >
          <View style={ tailwind('flex flex-row justify-center') }>
            <View style={ tailwind('mr-2') }>
              <HomeIcon width={24} height={24} fill={getColor('gray-700')}/>
            </View>
            <Text style={tailwind('text-gray-800 font-bold text-center text-lg')}>
              Domicile
            </Text>
          </View>
        </TouchableHighlight>

      </View>
      <FirebaseNotifHandler/>
    </View>
  );
}

export default HomeScreen;
