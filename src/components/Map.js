import React, { useContext, useState, useEffect } from 'react'
import MapView, { PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { View, Text, TouchableHighlight, TouchableOpacity, ActivityIndicator } from "react-native";
import tailwind from "tailwind-rn";
import { SearchContext } from "../context/SearchContext";
import MenuToggle from "../assets/icons/menu-toggle.svg";
import { api } from "../utils/api";
import { TripContext, DRIVER_FOUND, TRIP_END, SEARCHING, DRIVER_NOT_FOUND } from "../context/TripContext";
import {showMessage} from "react-native-flash-message";

const Map = ({navigation}) => {

  const {from, to, tripInfo} = useContext(SearchContext);
  const {status, setStatus, driverName, arrivalTime, phoneNumber} = useContext(TripContext);
  const [offer, setOffer] = useState(null);

  useEffect(() => {
    if (status === DRIVER_NOT_FOUND) {
      setTimeout(() => {
        setStatus(null);
      }, 3000)
    }
  }, [status])

  const onPress = async () => {
    const {distance, duration, price, startAddress, endAddress, encodedPolyline} = tripInfo
    const payload = {
      distance,
      duration,
      price,
      startAddress,
      endAddress,
      encodedPolyline
    }
    await api('POST', '/users/geoloc-notif');
    console.log('geoloc notif sent');
    try {
      setTimeout(async () => {
        const {offer} = await api('POST', '/offer/create', {tripInfo: payload});
        setOffer(offer);
        const {status} = await api('POST', `/offer/${offer.id}/find-driver`);
        setStatus(SEARCHING);
        console.log('create offer');
        console.log(status);
      }, 1500)
    } catch (e) {
      setStatus(null);
      console.log(e);
    }
  }

  const cancel = async () => {
    try {
      await api('PUT', `/offer/${offer.id}/update`, {
        cancel: true
      })
      console.log('CANCEL');
      await api('POST', `/offer/${offer.id}/cancel-notification`)
      setStatus(null);
      navigation.navigate('Home');
      return showMessage({
        message: 'Succès',
        description: 'Recherche annulée',
        type: 'success',
        icon: 'success',
      })
    } catch (e) {
      console.log(e)
    }
  }


  return (
    <>
      {
        Object.keys(tripInfo).length > 0 ?
          <View style={tailwind('bg-white h-full w-full')}>
            <TouchableOpacity
              style={{position: 'absolute', top: 40, left: 20, zIndex: 100}}
              onPress={() => navigation.navigate('Menu')}
            >
              <MenuToggle/>
            </TouchableOpacity>
            {
              status === DRIVER_NOT_FOUND &&
              <View style={{...tailwind('flex flex-row justify-center w-full absolute z-50'), 'top': '20%'}}>
                <View style={tailwind('w-3/4 bg-white border-red-100 p-6 border-t-4 border-orange-400 rounded')}>
                  <Text style={tailwind('text-orange-500 font-bold text-lg mb-2')}>Aucun chauffeur disponible</Text>
                  <Text style={tailwind('text-gray-600 text-base')}>Veuillez ré-essayer plus tard</Text>
                </View>
              </View>
            }
            {
              status === SEARCHING &&
              <View style={{...tailwind('flex flex-row justify-center w-full absolute z-50'), 'top': '20%'}}>
                <View style={tailwind('w-3/4 bg-white border-red-100 p-6 border-t-4 border-indigo-400 rounded')}>
                  <Text style={tailwind('text-indigo-800 font-bold text-lg mb-2')}>Recherche en cours...</Text>
                  <ActivityIndicator/>
                </View>
              </View>
            }
            {
              status === DRIVER_FOUND &&
              <View style={{...tailwind('flex flex-row justify-center w-full absolute z-50'), 'top': '20%'}}>
                <View style={tailwind('w-3/4 bg-white border-red-100 p-6 border-t-4 border-indigo-400 rounded')}>
                  <Text style={tailwind('text-indigo-800 font-bold text-lg mb-2')}>CHAUFFEUR EN ROUTE</Text>
                  <Text style={tailwind('text-gray-700 font-bold mb-1 text-base')}>{driverName}</Text>
                  <Text style={tailwind('text-gray-600 text-base')}>Arrivé prévu à {arrivalTime}</Text>
                  <Text style={tailwind('text-gray-600 text-base')}>{phoneNumber}</Text>
                </View>
              </View>
            }
            <MapView
              style={{...tailwind('w-full flex-grow')}}
              provider={PROVIDER_GOOGLE}
              region={{
                latitude: tripInfo.startAddress.coords.latitude,
                longitude: tripInfo.startAddress.coords.longitude,
                latitudeDelta: 0.048,
                longitudeDelta: 0.048,
              }}
              loadingEnabled={true}
            >
              {
                tripInfo && tripInfo.coords && tripInfo.coords.length > 0 &&
                <Polyline
                  coordinates={tripInfo.coords}
                  strokeColor="#434190"
                  strokeWidth={3}
                />
              }
            </MapView>
            {
              tripInfo && tripInfo.coords && tripInfo.coords.length > 0 &&
              <View style={{...tailwind('bg-gray-100 w-full pb-6')}}>
                <Text style={tailwind('text-indigo-800 font-bold text-lg text-center py-6')}>Récapitulatif de la
                  course
                </Text>
                <View>
                  <View style={tailwind('bg-white p-4')}>
                    <Text style={tailwind('text-gray-700 font-bold')}>Départ</Text>
                    <Text style={tailwind('text-gray-600 text-sm')}>{from}</Text>
                  </View>
                  <View style={tailwind('bg-white p-4')}>
                    <Text style={tailwind('text-gray-700 font-bold')}>Arrivé</Text>
                    <Text style={tailwind('text-gray-600 text-sm')}>{to}</Text>
                  </View>
                </View>
                <View style={tailwind('flex flex-row justify-center items-center my-6')}>
                  <Text
                    style={tailwind('text-center text-indigo-800 font-bold text-lg')}>{tripInfo.distance} · {tripInfo.duration} · {tripInfo.price} €</Text>
                </View>
                {
                  (status !== DRIVER_FOUND && status !== SEARCHING && status !== TRIP_END) &&
                  <View style={tailwind('flex flex-row justify-center items-center')}>
                    <TouchableHighlight style={{...tailwind('bg-indigo-800 p-4 rounded')}} onPress={onPress}>
                      <Text style={tailwind('text-white font-bold text-center text-lg')}>
                        Rechercher un chauffeur
                      </Text>
                    </TouchableHighlight>
                  </View>
                }
                {
                  (status === SEARCHING || status === DRIVER_FOUND) &&
                  <View style={tailwind('flex flex-row justify-center items-center')}>
                    <TouchableHighlight style={{...tailwind('bg-red-200 p-4 rounded')}} onPress={cancel}>
                      <Text style={tailwind('text-red-500 font-bold text-center text-lg')}>
                        Annuler
                      </Text>
                    </TouchableHighlight>
                  </View>
                }
              </View>
            }
          </View>
          : <ActivityIndicator size={"large"}/>
      }
    </>
  )
}

export default Map
