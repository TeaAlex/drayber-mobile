import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import tailwind, { getColor } from "tailwind-rn";
import CheckMark from "../assets/icons/check-mark.svg";
import Button from "./Button";
import { api } from "../utils/api";

const TripRecap = ({route, navigation}) => {

  const id = route.params.tripId
  const [trip, setTrip] = useState(null);
  const [driver, setDriver] = useState(null);
  const [client, setClient] = useState(null);


  useEffect(() => {

    const init = async () => {
      const {trip, driver, client} = await api('GET', `/trip/get/${id}`);
      setTrip(trip);
      setDriver(driver);
      setClient(client);
    }
    init();
  }, [])

  return (
    <>
      {
        trip && driver && client &&
        <View style={tailwind('p-8')}>
          <View style={tailwind('flex flex-row')}>
            <Text style={tailwind('text-green-500 font-bold text-xl mb-2 mr-2')}>
              COURSE TERMINÉE
            </Text>
            <CheckMark width={24} height={24} fill={getColor('green-500')}/>
          </View>

          <View style={tailwind('mb-2')}>
            <Text style={tailwind('text-gray-600 text-base')}>Chauffeur</Text>
            <View>
              <Text style={tailwind('text-gray-800 font-bold text-lg')}>{driver.firstname} {driver.lastname}</Text>
            </View>
          </View>

          <View>
            <Text style={tailwind('text-gray-600 text-base')}>Client</Text>
            <View>
              <Text style={tailwind('text-gray-800 font-bold text-lg')}>{client.firstname} {client.lastname}</Text>
            </View>
          </View>

          <View style={tailwind('flex flex-row mt-6')}>
            <Text style={tailwind('text-gray-700 font-bold text-xl mb-2 mr-2')}>
              RECAPITULATIF
            </Text>
          </View>

          <View style={tailwind('mb-4')}>
            <View style={tailwind('mb-4')}>
              <Text style={tailwind('text-gray-600 font-bold text-lg')}>Adresse de départ</Text>
              <Text style={tailwind('text-gray-700 text-base')}>{trip.start_address}</Text>
            </View>
            <View>
              <Text style={tailwind('text-gray-600 font-bold text-lg')}>Adresse d'arrivé</Text>
              <Text style={tailwind('text-gray-700 text-base')}>{trip.end_address}</Text>
            </View>
          </View>

          <View>
            <Text style={tailwind('text-gray-700 text-lg mb-1 font-bold ')}>Distance parcourue : {trip.distance}</Text>
            <Text style={tailwind('text-gray-700 text-lg mb-1 font-bold ')}>Durée : {trip.duration}</Text>
            <Text style={tailwind('text-gray-700 text-lg mb-1 font-bold ')}>Prix : {trip.price}€</Text>
          </View>

          <Button title={"Retournez à l'accueil"} onPress={() => navigation.navigate('Home')}/>
        </View>
      }
    </>
  )


}

export default TripRecap
