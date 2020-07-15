import React, { useEffect, useContext } from 'react';
import { View } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { TripContext, DRIVER_FOUND, TRIP_END, DRIVER_NOT_FOUND } from "../context/TripContext";
import { UserContext } from "../context/UserContext";
import { useNavigation } from '@react-navigation/native';
import {api} from "../utils/api";
import { getCurrentPosition } from "../utils/geolocation";
import {showMessage} from "react-native-flash-message";


const FirebaseNotifHandler = () => {

  const navigation = useNavigation();
  const {user} = useContext(UserContext);
  const {setDriverName, setArrivalTime, setStatus, setDriver, setPhoneNumber} = useContext(TripContext);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const {type} = remoteMessage.data;
      console.log(remoteMessage);
      if (type === "OFFER_CREATE") {
        const offer = JSON.parse(remoteMessage.data.offer);
        const phone = remoteMessage.data.phone;
        await api('PUT', '/users/update', {
          is_searching: false
        })
        console.log(phone);
        navigation.navigate('Offer', {offer, phone})
      }
      if (type === "TRIP_CREATE") {
        const driver = JSON.parse(remoteMessage.data.driver);
        const arrivalTime = remoteMessage.data.arrivalTime;
        const phoneNumber = remoteMessage.data.phoneNumber;
        setDriver(driver);
        setDriverName(`${driver.firstname} ${driver.lastname}`);
        setArrivalTime(arrivalTime);
        setStatus(DRIVER_FOUND);
        setPhoneNumber(phoneNumber);
        navigation.navigate('Map');
      }
      if (type === "TRIP_END") {
        console.log(remoteMessage);
        const trip = JSON.parse(remoteMessage.data.trip);
        setStatus(null);
        navigation.navigate('TripRecap', {tripId: trip.id});
      }
      if (type === "UPDATE_GEOLOCATION") {
        getCurrentPosition.then(({latitude, longitude}) => {
          console.log('UPDATE GEOLOCATION');
          console.log(latitude, longitude);
          api('PUT', `/users/update/${user.user.id}`, {
            lat: latitude,
            lng: longitude
          })
            .then(({user}) => console.log(user))
            .catch(e => console.log(e))
          ;
        })
      }
      if (type === "NO_DRIVER_FOUND") {
        console.log('driver not found');
        setStatus(DRIVER_NOT_FOUND);
        navigation.navigate('Map');
      }
      if (type === "TRIP_CANCEL") {
        await api('PUT', '/users/update', {
          is_searching: true
        })
        navigation.navigate('Home');
        showMessage({
          message: 'Annulation',
          description: 'La course a été annulée par le client',
          type: 'danger',
          icon: 'danger'
        })
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View/>
  )
}

export default FirebaseNotifHandler
