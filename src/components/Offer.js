import React, {useContext, useEffect, useState} from 'react';
import {View, Button, Text, TouchableOpacity, TouchableHighlight} from 'react-native';
import {api} from "../utils/api";
import tailwind from "tailwind-rn";
import MenuToggle from "../assets/icons/menu-toggle.svg";
import MapView, {Polyline, PROVIDER_GOOGLE} from "react-native-maps";
import {UserContext} from "../context/UserContext";
import {directionAPI, geoCoding} from '../utils/googleAPI';
import polyline from "@mapbox/polyline";
import {useDecrement} from "../hooks/useDecrement";


const Offer = ({route, navigation}) => {

  const {offer} = route.params;

  const {user} = useContext(UserContext);
  const [currentPositionToStartAddressCoords, setCurrentPositionToStartAddressCoords] = useState(null);
  const userCoords = {
    lat: user.lat,
    lon: user.lng
  };
  const [currentPositionAddress, setCurrentPositionAddress] = useState("");

  const [count, decrement] = useDecrement(100, 10);


  useEffect(() => {
    const init = async () => {
      const {coords} = await directionAPI(userCoords, offer.address_from);
      setCurrentPositionToStartAddressCoords(coords);
      const addresses = await geoCoding(userCoords);
      const {formatted_address} = addresses[0];
      setCurrentPositionAddress(formatted_address);
    }
    init();
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      decrement();
    }, 1000)
    return function () {
      clearInterval(timer)
    }
  }, [count])

  useEffect(() => {
    if (count <= 0) {
      navigation.goBack();
    }
  }, [count])


  const startToEndCoords = polyline.decode(offer.encoded_polyline)
                          .map(point => {
                            const [latitude, longitude] = point;
                            return { latitude,longitude }
                          });




  const accept = () => {
    console.log('accept');
  }

  const decline = async () => {
    try {
      const {offer: updatedOffer} = await api('POST', `/offer/${offer.id}/reject`);
      await api('POST', `/offer/${updatedOffer.id}/find-driver`);
    } catch (e) {
      console.error(e);
    }
    navigation.goBack();
  }

  return (
    <View style={tailwind('flex-1 bg-white items-center justify-center')}>
      <TouchableOpacity
        style={{position: 'absolute', top: 40, left: 20, zIndex: 100}}
        onPress={() => navigation.navigate('Menu')}
      >
        <MenuToggle/>
      </TouchableOpacity>
      <MapView
        style={tailwind('h-full w-full')}
        provider={PROVIDER_GOOGLE}
        region={{
          latitude: offer.start_address_lat,
          longitude: offer.start_address_lon,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        loadingEnabled={true}
      >
        {
          currentPositionToStartAddressCoords &&
          <Polyline
            coordinates={currentPositionToStartAddressCoords}
            strokeColor="red"
            strokeWidth={3}
          />
        }
        {
          startToEndCoords &&
          <Polyline
            coordinates={startToEndCoords}
            strokeColor="green"
            strokeWidth={3}
          />
        }
      </MapView>
      <View style={{...tailwind('bg-gray-100 w-full absolute bottom-0'), height: "50%"}}>
        <View style={{...tailwind('bg-green-500 h-2'), width: `${count}%`}}>
          {/*<Text>{count}</Text>*/}
        </View>
        {/*<Text style={tailwind('text-indigo-800 font-bold text-lg text-center py-6')}>Nouvelle course</Text>*/}
        <View>
          <View style={tailwind('bg-white p-4')}>
            <Text style={tailwind('text-gray-700 font-bold')}>Ma position</Text>
            <Text style={tailwind('text-gray-600 text-sm')}>{currentPositionAddress}</Text>
          </View>
          <View style={tailwind('bg-white p-4')}>
            <Text style={tailwind('text-gray-700 font-bold')}>Départ</Text>
            <Text style={tailwind('text-gray-600 text-sm')}>{offer.address_from}</Text>
          </View>
          <View style={tailwind('bg-white p-4')}>
            <Text style={tailwind('text-gray-700 font-bold')}>Arrivé</Text>
            <Text style={tailwind('text-gray-600 text-sm')}>{offer.address_to}</Text>
          </View>
        </View>
        <View style={tailwind('flex flex-row justify-center items-center my-6')}>
          <Text style={tailwind('text-center text-indigo-800 font-bold text-lg')}>{offer.distance} km
            · {offer.duration} mins · {offer.price} €</Text>
        </View>
        <View style={tailwind('flex flex-row justify-center items-center')}>
          <TouchableHighlight style={{...tailwind('bg-green-200 p-4 rounded mr-4')}} onPress={() => {}}>
            <Text style={tailwind('text-green-500 font-bold text-center text-lg')}> Accepter </Text>
          </TouchableHighlight>
          <TouchableHighlight style={{...tailwind('bg-red-200 p-4 rounded')}} onPress={accept}>
            <Text style={tailwind('text-red-500 font-bold text-center text-lg')} onPress={decline}> Refuser </Text>
          </TouchableHighlight>
        </View>
      </View>
    </View>

  )
}

export default Offer
