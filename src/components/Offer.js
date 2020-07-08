import React, {useContext, useEffect, useState} from 'react';
import {View, Button, Text, TouchableOpacity, TouchableHighlight, PermissionsAndroid} from 'react-native';
import {api} from "../utils/api";
import tailwind from "tailwind-rn";
import MenuToggle from "../assets/icons/menu-toggle.svg";
import MapView, {Polyline, PROVIDER_GOOGLE, Marker} from "react-native-maps";
import {UserContext} from "../context/UserContext";
import {directionAPI, geoCoding} from '../utils/googleAPI';
import polyline from "@mapbox/polyline";
import ProgressBar from "./ProgressBar";
import RNLocation from "react-native-location";
import Geolocation from '@react-native-community/geolocation';


async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Location Permission',
        'message': 'This App needs access to your location ' +
          'so we can know where you are.'
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use locations ")
    } else {
      console.log("Location permission denied")
    }
  } catch (err) {
    console.warn(err)
  }
}


const Offer = ({route, navigation}) => {

  const {offer} = route.params;

  const {user} = useContext(UserContext);
  const [currentPositionToStartAddressCoords, setCurrentPositionToStartAddressCoords] = useState(null);
  const userCoords = {
    lat: user.lat,
    lon: user.lng
  };
  const [currentPositionAddress, setCurrentPositionAddress] = useState("");

  const [position, setPosition] = useState(null);
  const [isAccepted, setIsAccepted] = useState(true);

  const onUserLocationChange = (event) => {
    const {latitude, longitude} = event.nativeEvent.coordinate
    setRegion(region => ({...region, latitude, longitude}))
  }

  const LATITUDE_DELTA = 0.005;
  const LONGITUDE_DELTA = 0.005;

  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  })


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
    console.log('RENDER');
    requestLocationPermission();

    // get initial position
    Geolocation.getCurrentPosition((position) => {
      const {latitude, longitude} = position.coords;
      setRegion(region => ({...region, latitude, longitude}))
      }, (error) => console.log(error),
      {
        timeout: 20000,
        enableHighAccuracy: true,
        maximumAge: 1000,
    })

    Geolocation.watchPosition(position => {
      const {latitude, longitude} = position.coords;
      setPosition({latitude, longitude})
      console.log({latitude, longitude})
    }, error => {
      console.error(error)
    }, {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000,
      distanceFilter: 10
    })

  }, [])

  // watch position



  // RNLocation.configure({
  //   distanceFilter: 200
  // })
  // RNLocation.requestPermission({
  //   ios: "whenInUse",
  //   android: {
  //     detail: "coarse",
  //     interval: 20000,
  //   }
  // }).then(granted => {
  //   if (granted) {
  //     const unsubscribe = RNLocation.subscribeToLocationUpdates(locations => {
  //       const {latitude, longitude} = locations[0];
  //       setPosition({latitude, longitude});
  //     })
  //   }
  // })

  // useEffect(() => {
  //   const getPosition = async () => {
  //     RNLocation.configure({
  //       distanceFilter: 200
  //     })
  //     const granted = await RNLocation.requestPermission({
  //       ios: "whenInUse",
  //       android: {
  //         detail: "coarse"
  //       }
  //     })
  //     if (granted) {
  //       const unsubscribe = RNLocation.subscribeToLocationUpdates(locations => {
  //         const {latitude, longitude} = locations[0];
  //         if (latitude && longitude) {
  //           setPosition({ latitude, longitude });
  //           console.log(position);
  //           unsubscribe();
  //         }
  //       });
  //     }
  //   }
  //   getPosition();
  //
  // }, [])





  const startToEndCoords = polyline.decode(offer.encoded_polyline)
                          .map(([latitude, longitude]) => {
                            return { latitude,longitude }
                          });

  const accept = () => {
    console.log('accept');
    setIsAccepted(true);
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
      {
        position !== null && <MapView
          style={tailwind('h-full w-full')}
          provider={PROVIDER_GOOGLE}
          region={region}
          showsUserLocation={true}
          loadingEnabled={true}
          onUserLocationChange={onUserLocationChange}
        >
          {
            position &&
            <Marker
              coordinate={region}
            />
          }
          {/*{*/}
          {/*  currentPositionToStartAddressCoords &&*/}
          {/*  <Polyline*/}
          {/*    coordinates={currentPositionToStartAddressCoords}*/}
          {/*    strokeColor="red"*/}
          {/*    strokeWidth={3}*/}
          {/*  />*/}
          {/*}*/}
          {
            startToEndCoords &&
            <Polyline
              coordinates={startToEndCoords}
              strokeColor="blue"
              strokeWidth={5}
            />
          }
        </MapView>
      }
      <View style={{...tailwind('bg-gray-100 w-full absolute bottom-0'), height: "20%"}}>
        {
          !isAccepted && <ProgressBar/>
        }
        {
          position && <Text>{JSON.stringify(position)}</Text>
        }
        {/*<Text style={tailwind('text-indigo-800 font-bold text-lg text-center py-6')}>Nouvelle course</Text>*/}
        {/*<View>*/}
        {/*  <View style={tailwind('bg-white p-4')}>*/}
        {/*    <Text style={tailwind('text-gray-700 font-bold')}>Ma position</Text>*/}
        {/*    <Text style={tailwind('text-gray-600 text-sm')}>{currentPositionAddress}</Text>*/}
        {/*  </View>*/}
        {/*  <View style={tailwind('bg-white p-4')}>*/}
        {/*    <Text style={tailwind('text-gray-700 font-bold')}>Départ</Text>*/}
        {/*    <Text style={tailwind('text-gray-600 text-sm')}>{offer.address_from}</Text>*/}
        {/*  </View>*/}
        {/*  <View style={tailwind('bg-white p-4')}>*/}
        {/*    <Text style={tailwind('text-gray-700 font-bold')}>Arrivé</Text>*/}
        {/*    <Text style={tailwind('text-gray-600 text-sm')}>{offer.address_to}</Text>*/}
        {/*  </View>*/}
        {/*</View>*/}
        <View style={tailwind('flex flex-row justify-center items-center my-6')}>
          <Text style={tailwind('text-center text-indigo-800 font-bold text-lg')}>
            {offer.distance} km · {offer.duration} mins · {offer.price} €</Text>
        </View>
        <View style={tailwind('flex flex-row justify-center items-center')}>
          <TouchableHighlight style={{...tailwind('bg-green-200 p-4 rounded mr-4')}} onPress={accept}>
            <Text style={tailwind('text-green-500 font-bold text-center text-lg')}> Accepter </Text>
          </TouchableHighlight>
          <TouchableHighlight style={{...tailwind('bg-red-200 p-4 rounded')}}>
            <Text style={tailwind('text-red-500 font-bold text-center text-lg')} onPress={decline}> Refuser </Text>
          </TouchableHighlight>
        </View>
      </View>
    </View>

  )
}

export default Offer
