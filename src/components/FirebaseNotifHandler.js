import React, { useEffect, useContext } from 'react';
import { View } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { TripContext, DRIVER_FOUND, SEARCHING, TRIP_END, DRIVER_NOT_FOUND } from "../context/TripContext";
import { UserContext } from "../context/UserContext";
import { useNavigation } from '@react-navigation/native';
import {api} from "../utils/api";


const FirebaseNotifHandler = () => {

  const navigation = useNavigation();
  const {user} = useContext(UserContext);
  const {setDriverName, setArrivalTime, setStatus, setDriver} = useContext(TripContext);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const {type} = remoteMessage.data;
      console.log(remoteMessage);
      if (type === "OFFER_CREATE") {
        const offer = JSON.parse(remoteMessage.data.offer);
        navigation.navigate('Offer', {offer})
      }
      if (type === "TRIP_CREATE") {
        const driver = JSON.parse(remoteMessage.data.driver);
        const arrivalTime = remoteMessage.data.arrivalTime;
        setDriver(driver);
        setDriverName(`${driver.firstname} ${driver.lastname}`);
        setArrivalTime(arrivalTime);
        setStatus(DRIVER_FOUND);
        navigation.navigate('Map');
      }
      if (type === "TRIP_END") {
        const driver = JSON.parse(remoteMessage.data.driver);
        setDriverName(`${driver.firstname} ${driver.lastname}`);
        setStatus(TRIP_END);
        navigation.navigate('Map');
      }
      if (type === "UPDATE_GEOLOCATION") {
        getCurrentPosition.then(({latitude, longitude}) => {
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
    });

    return unsubscribe;
  }, []);

  return (
    <View/>
  )
}

export default FirebaseNotifHandler
