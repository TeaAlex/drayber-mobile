import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, PermissionsAndroid } from 'react-native';
import { api } from "../utils/api";
import tailwind, { getColor } from "tailwind-rn";
import MenuToggle from "../assets/icons/menu-toggle.svg";
import MapView, { Polyline, PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { directionAPI } from '../utils/googleAPI';
import polyline from "@mapbox/polyline";
import ProgressBar from "./ProgressBar";
import Geolocation from '@react-native-community/geolocation';

const Offer = ({route, navigation}) => {

  const INITIAL = 'INITIAL';
  const INIT = 'INIT';
  const ACCEPTED = 'ACCEPTED';
  const CLIENT_PICKED_UP = 'CLIENT_PICKED_UP';
  const TRIP_START = 'TRIP_START';
  const TRIP_END = 'TRIP_END';

  const NEW_COURSE = 'Nouvelle course';
  const PICK_CLIENT = 'Récuperer le client';
  const START_TRIP = 'Démarrer la course'
  const DESTINATION = 'Se rendre à la destination'

  // STATE
  const {offer} = route.params;
  const [status, setStatus] = useState(INITIAL);
  const [stepStatus, setStepStatus] = useState(NEW_COURSE);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [currentToStartCoords, setCurrentToStartCoords] = useState(null);
  const [startToEndCoords, setStartToEndCoords] = useState(null);
  const [region, setRegion] = useState({
    latitude: 48.8587741,
    longitude: 2.2069771,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  });

  const [startAddress, setStartAddress] = useState({
    label: 'Départ',
    text: offer.address_from,
    show: true
  });
  const [endAddress, setEndAddress] = useState({
    label: 'Arrivé',
    text: offer.address_to,
    show: true
  });
  const [showStartToEndCoords, setShowStartToEndCoords] = useState(true);
  const [showCurrentToStartCoords, setShowCurrentToStartCoords] = useState(true);

  const [height, setHeight] = useState({
    map: '50%',
    info: '50%'
  })


  // METHODS

  const getCurrentPosition = new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(position => {
      const {latitude, longitude} = position.coords;
      resolve({latitude, longitude});
    }, error => {
      reject(error);
    }, {
      enableHighAccuracy: true,
      timeout: 20000
    })
  })

  const onUserLocationChange = (event) => {
    if (status === INIT) {
      return
    }
    const {latitude, longitude} = event.nativeEvent.coordinate
    setRegion({latitude, longitude, latitudeDelta: 0.001, longitudeDelta: 0.001});
  }

  const requestLocationPermission = async () => {
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

  // EFFECTS

  useEffect(() => {
    const initPositions = async () => {
      requestLocationPermission();

      try {
        const {latitude, longitude} = await getCurrentPosition;
        setCurrentPosition({latitude, longitude});
        setRegion({...region, latitude, longitude});

        const {coords: currentToStartCoords} = await directionAPI({latitude, longitude}, offer.address_from);
        setCurrentToStartCoords(currentToStartCoords);

        const startToEndCoords = polyline.decode(offer.encoded_polyline).map(([latitude, longitude]) => ({
          latitude,
          longitude
        }));
        setStartToEndCoords(startToEndCoords);

        setStatus(INIT);

      } catch (e) {
        console.error(e);
      }
    }
    initPositions();
  }, [])

  useEffect(() => {
    // const statuses = [INITIAL, INIT, ACCEPTED, CLIENT_PICKED_UP, TRIP_START, TRIP_END];
    if (status === INIT || status === INITIAL) {
      setStartAddress({...startAddress, label: 'Départ', show: true});
      setEndAddress({...endAddress, label: 'Arrivé', show: true});
      setStepStatus(NEW_COURSE);
    } else if (status === ACCEPTED) {
      setStartAddress({...startAddress, label: 'Prochaine destination', show: true})
      setEndAddress({...endAddress, show: false})
      setStepStatus(PICK_CLIENT);
      setShowStartToEndCoords(false);
      setHeight({
        map: '60%',
        info: '40%'
      })
    } else if (status === CLIENT_PICKED_UP || status === TRIP_START || status === TRIP_END) {
      const stepStatus = status === CLIENT_PICKED_UP ? START_TRIP : DESTINATION
      setStartAddress({...startAddress, show: false});
      setEndAddress({...endAddress, label: 'Prochaine destination', show: true});
      setStepStatus(stepStatus);
      setShowStartToEndCoords(true);
      setShowCurrentToStartCoords(false);
    }
  }, [status])


  const accept = () => {
    // TODO SEND NOTIF TO USER => DRIVER ACCEPTED
    setStatus(ACCEPTED);
    setStepStatus(PICK_CLIENT);
    Geolocation.watchPosition(position => {
      const {latitude, longitude} = position.coords;
      setCurrentPosition({latitude, longitude})
    }, error => {
      console.error(error)
    }, {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000,
      distanceFilter: 20
    })
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

  const clientPickedUp = () => {
    setStatus(CLIENT_PICKED_UP);
    setStepStatus(DESTINATION);
  };

  const tripStart = () => {
    setStatus(TRIP_START);
    console.log('trip start')
  };

  const tripEnd = () => {
    setStatus(TRIP_END);
    alert('course terminée');
  };


  return (
    <View style={tailwind('bg-white h-full w-full')}>
      <TouchableOpacity
        style={{position: 'absolute', top: 40, left: 20, zIndex: 100}}
        onPress={() => navigation.navigate('Menu')}
      >
        <MenuToggle/>
      </TouchableOpacity>
      {
        currentPosition !== null && <MapView
          style={{...tailwind('w-full'), height: height.map}}
          provider={PROVIDER_GOOGLE}
          region={region}
          showsUserLocation={true}
          loadingEnabled={true}
          onUserLocationChange={onUserLocationChange}
        >
          <Marker
            coordinate={region}
          />

          {
            (currentToStartCoords && showCurrentToStartCoords) &&
            <Polyline
              coordinates={currentToStartCoords}
              strokeColor={getColor('teal-500')}
              strokeWidth={5}
            />
          }
          {
            (startToEndCoords && showStartToEndCoords) &&
            <Polyline
              coordinates={startToEndCoords}
              strokeColor={getColor('indigo-500')}
              strokeWidth={5}
            />
          }
        </MapView>
      }
      <View style={{...tailwind('bg-gray-100 w-full absolute bottom-0'), height: height.info}}>
        {
          status === INIT
          && <ProgressBar onCompletion={() => navigation.goBack()} timeout={1000} />
        }
        <View>
          <Text style={tailwind('text-indigo-800 font-bold text-lg text-center py-6')}>{stepStatus}</Text>
          {
            startAddress.show &&
            <View style={tailwind('bg-white p-4')}>
              <Text style={tailwind('text-gray-700 font-bold')}>{startAddress.label}</Text>
              <Text style={tailwind('text-gray-600 text-sm')}>{startAddress.text}</Text>
            </View>
          }
          {
            endAddress.show &&
            <View style={tailwind('bg-white p-4')}>
              <Text style={tailwind('text-gray-700 font-bold')}>{endAddress.label}</Text>
              <Text style={tailwind('text-gray-600 text-sm')}>{endAddress.text}</Text>
            </View>
          }
        </View>
        <View style={tailwind('flex flex-row justify-center items-center my-6')}>
          <Text style={tailwind('text-center text-indigo-800 font-bold text-lg')}>
            {offer.distance} km · {offer.duration} mins · {offer.price} €</Text>
        </View>
        {/*<Text>{status}</Text>*/}
        <View style={tailwind('flex flex-row justify-center items-center')}>
          {
            status === INIT &&
            <>
              <TouchableHighlight style={{...tailwind('bg-green-200 p-4 rounded mr-4')}} onPress={accept}>
                <Text style={tailwind('text-green-500 font-bold text-center text-lg')}> Accepter </Text>
              </TouchableHighlight>
              <TouchableHighlight style={{...tailwind('bg-red-200 p-4 rounded')}}>
                <Text style={tailwind('text-red-500 font-bold text-center text-lg')} onPress={decline}> Refuser </Text>
              </TouchableHighlight>
            </>
          }
          {
            status === ACCEPTED &&
            <TouchableHighlight style={{...tailwind('bg-teal-200 p-4 rounded mr-4')}} onPress={clientPickedUp}>
              <Text style={tailwind('text-teal-500 font-bold text-center text-lg')}> Client récuperé </Text>
            </TouchableHighlight>
          }
          {
            status === CLIENT_PICKED_UP &&
            <TouchableHighlight style={{...tailwind('bg-indigo-200 p-4 rounded mr-4')}} onPress={tripStart}>
              <Text style={tailwind('text-indigo-500 font-bold text-center text-lg')}> Demarrer la course </Text>
            </TouchableHighlight>
          }
          {
            status === TRIP_START &&
            <>
              <TouchableHighlight style={{...tailwind('bg-orange-200 p-4 rounded mr-4')}} onPress={tripEnd}>
                <Text style={tailwind('text-orange-500 font-bold text-center text-lg')}> Terminer la course </Text>
              </TouchableHighlight>
            </>
          }
        </View>
      </View>
    </View>

  )
}

export default Offer
