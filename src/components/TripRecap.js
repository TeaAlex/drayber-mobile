import React, { useEffect, useState, useContext } from 'react';
import {UserContext} from "../context/UserContext";
import {Text, TouchableOpacity, View} from 'react-native';
import tailwind, { getColor } from "tailwind-rn";
import CheckMark from "../assets/icons/check-mark.svg";
import Button from "./Button";
import { api } from "../utils/api";


const TripRecap = ({route, navigation}) => {

  const id = route.params.tripId
  const [trip, setTrip] = useState(null);
  const [driver, setDriver] = useState(null);
  const [client, setClient] = useState(null);
  const {user} = useContext(UserContext);
  const ratings = [1, 2, 3, 4, 5];
  
  
  useEffect(() => {

    const init = async () => {
      const {trip, driver, client} = await api('GET', `/trip/get/${id}`);
      setTrip(trip);
      setDriver(driver);
      setClient(client);
      await api('POST', '/trip/pay', {
        trip_id: trip.id
      })
    }
    init();
  }, [])
  
  const rate = async (value) => {
    try {
      console.log(driver.id, value);
      await api('POST', '/users/rating', {
        user_id: driver.id,
        rating: value
      })
    } catch (e) {
      console.log('RATE ERROR');
    }
    navigation.navigate('Home');
  }

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
          
          {
            user.user.id === client.id &&
              <View style={tailwind('mt-6')}>
                <Text style={tailwind('text-gray-600 text-base mb-3')}>Notez votre chauffeur</Text>
                <View style={tailwind('flex flex-row justify-center')}>
                  <View style={tailwind('flex flex-row justify-around items-center w-2/3')}>
                    {
                      ratings.map(r => {
                        return (<TouchableOpacity key={r} onPress={() => rate(r)}>
                          <Text
                            style={tailwind('font-bold text-center bg-yellow-200 rounded-full w-10 h-10 p-2 mb-3 text-yellow-500 text-base')}>{r}</Text>
                        </TouchableOpacity>)
                      })
                    }
                  </View>
                </View>
              </View>
          }
          <View>
          
          </View>

          <Button title={"Retournez à l'accueil"} onPress={() => navigation.navigate('Home')}/>
        </View>
      }
    </>
  )


}

export default TripRecap
