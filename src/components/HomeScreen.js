import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { Text, View, TouchableOpacity, TouchableHighlight, ActivityIndicator } from 'react-native';
import FirebaseNotifHandler from './FirebaseNotifHandler';
import tailwind, { getColor } from 'tailwind-rn';
import MenuToggle from '../assets/icons/menu-toggle.svg';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import SearchIcon from '../assets/icons/search-outline.svg'
import HomeIcon from '../assets/icons/home-outline.svg'
import { getCurrentPosition, requestLocationPermission, search } from "../utils/geolocation";
import {SearchContext} from "../context/SearchContext";
import {geoCoding} from "../utils/googleAPI";
import { api } from "../utils/api";
import Geolocation from "@react-native-community/geolocation";


function HomeScreen ({navigation}) {

  const {user} = useContext(UserContext);
  const {setTo, setFrom, setTripInfo} = useContext(SearchContext);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [region, setRegion] = useState({
    latitude: 48.8587741,
    longitude: 2.2069771,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  });
  

  useEffect(() => {
    const setPosition = async () => {
      await requestLocationPermission();
      const {latitude, longitude} = await getCurrentPosition;
      setCurrentPosition({latitude, longitude});
      await api('PUT', '/users/update', {
        lat: latitude,
        lng: longitude
      })
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      });
      await computeAddress(latitude, longitude);
    }
    setPosition();
  }, [])

  useEffect(() => {
    const id = Geolocation.watchPosition(({coords}) => {
        const {latitude, longitude} = coords;
        setCurrentPosition(coords);
        setRegion({...region, latitude, longitude});
      },
      (e) => console.log(e),
      {
        enableHighAccuracy: true,
        distanceFilter: 200,
      })
    return Geolocation.clearWatch(id);
  }, [])


  const computeAddress = async (latitude, longitude) => {
    const addresses = await geoCoding({
      lat: latitude,
      lon: longitude
    });
    if (addresses.length > 0) {
      setCurrentAddress(addresses[0].formatted_address);
    }
  }
  
  const goHome = async () => {
    const userAddress = user.user.address;
    const {from, to, tripInfo} = await search(currentAddress, userAddress);
    setFrom(from);
    setTo(to);
    setTripInfo(tripInfo);
    navigation.navigate('Map');
  }

  return (
    <View style={tailwind('h-full w-full')}>
      {user.driver && user.driver.active_driver === true && user.driver.is_searching &&
        <TouchableOpacity
          style={{position: 'absolute', top: 40, right: 20, zIndex: 100}}
          onPress={() => navigation.navigate('Menu')}>
          <View style={tailwind('items-center p-3  bg-indigo-800 p-4 rounded-full')}>
            <Text style={tailwind('text-indigo-100 font-bold text-center text-base')}>
              {user.driver.credit} €
            </Text>
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
      >
        {
          currentPosition !== null &&
          <Marker coordinate={currentPosition}/>
        }
      </MapView>

      <View style={{...tailwind('w-full items-center relative bg-gray-900 rounded-t-lg'), 'height': '20%'}}>

        { user.driver && user.driver.active_driver === true && user.driver.is_searching &&
          <TouchableHighlight style={tailwind('items-center p-3 w-2/3 bg-white rounded-lg p-4 mt-10')}>
            <View>
              <Text style={tailwind('text-gray-700 font-bold text-center text-lg')}>
                En attente d'un client ...
              </Text>
              <ActivityIndicator/>
            </View>
          </TouchableHighlight>
        }


        {
          (!user.driver || user.driver && user.driver.active_driver === false || (user.driver && user.driver.active_driver === true && user.driver.is_searching === false)) &&
            <TouchableHighlight
              style={{
                ...tailwind('items-center p-3 w-10/12 bg-white p-6 rounded-lg absolute'),
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
              onPress={async () => {
                const {latitude, longitude} = currentPosition;
                await computeAddress(latitude, longitude);
                setFrom(currentAddress);
                navigation.navigate('Search')
              }}>
              <View style={tailwind('flex flex-row justify-center w-full relative')}>
                <View style={{...tailwind('absolute w-full'), 'left': '2%'}}>
                  <SearchIcon width={24} height={24} fill={getColor('gray-700')}/>
                </View>
                <Text style={tailwind('text-gray-800 font-bold text-center text-lg')}>
                  Où allez vous ?
                </Text>
              </View>
            </TouchableHighlight>
        }

        {
          (!user.driver || user.driver && user.driver.active_driver === false || (user.driver && user.driver.active_driver === true && user.driver.is_searching === false)) && (user.user.address) &&
            <TouchableHighlight
              style={{...tailwind('bg-white rounded-lg p-4 absolute'), top: '45%'}}
              onPress={goHome}
            >
              <View style={tailwind('flex flex-row justify-center')}>
                <View style={tailwind('mr-2')}>
                  <HomeIcon width={24} height={24} fill={getColor('gray-700')}/>
                </View>
                <Text style={tailwind('text-gray-800 font-bold text-center text-lg')}>
                  Domicile
                </Text>
              </View>
            </TouchableHighlight>
        }
      </View>
      <FirebaseNotifHandler/>
    </View>
  );
}

export default HomeScreen;
