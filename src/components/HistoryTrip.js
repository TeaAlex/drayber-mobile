import React, { useState, useContext, useEffect } from 'react'
import { View, Button, Text, ScrollView, } from "react-native";
import tailwind from 'tailwind-rn';
import { api } from '../utils/api';
import { UserContext } from '../context/UserContext';
import moment from "moment";


const HistoryTrip = () => {
  const {user} = useContext(UserContext);
  const [trips, setTrips] = useState([]);
  const [offers, setOffers] = useState([]);
  const [races, setRaces] = useState([]);

  useEffect(() => {
    async function getTrips () {
      try {
        if (user.driver) {
          console.log("ici")
          let allTrip = await api('GET', '/trip/driver_trip');
          setTrips(allTrip);
          allTrip.forEach(async trip => {
            const race = await api('GET', `/offer/${trip.offer_id}`);
            const client = await api('GET', `/users/${trip.client_id}`);
            race.client_name = client.user.firstname;
            setRaces(oldRaces=> [...oldRaces, race]);
          });
          allTrip = await api('GET', '/trip/client_trip');
          allTrip.forEach(async trip => {
            const offer = await api('GET', `/offer/${trip.offer_id}`);
            const driver = await api('GET', `/users/${trip.driver_id}`);
            offer.driver_name = driver.user.firstname;
            setOffers(oldOffers => [...oldOffers, offer]);
          });
          
        } else {
          const allTrip = await api('GET', '/trip/client_trip');
          setTrips(allTrip);
          allTrip.forEach(async trip => {
            const offer = await api('GET', `/offer/${trip.offer_id}`);
            const driver = await api('GET', `/users/${trip.driver_id}`);
            offer.driver_name = driver.user.firstname;
            setOffers(oldOffers => [...oldOffers, offer]);
          });

        }

      } catch (e) {
        console.error(e);
      }
    }

    getTrips();

  }, []);

  return (
    <ScrollView>
      { user.driver && races && races.map((race, key) =>
      <View
      key={key}
      style={tailwind(
        'bg-white px-1 border-gray-200 border-t border-b h-40 flex-row items-center',
      )}>
      <View style={tailwind(
        'relative flex-initial h-full w-9/12 p-4',
      )}>
        <Text style={tailwind('text-gray-800 font-bold my-1 flex-row')}>Depart : <Text
          style={tailwind('text-gray-500 font-medium ')}>{race.address_from}</Text></Text>
        <Text style={tailwind('text-gray-800 font-bold mt-2 flex-row')}>Arrivée : <Text
          style={tailwind('text-gray-500 font-medium ')}>{race.address_to}</Text></Text>
          <Text style={tailwind('text-gray-800 font-bold mt-2 flex-row')}>Client : <Text
          style={tailwind('text-gray-500 font-medium ')}>{race.client_name}</Text></Text>
      </View>
      <View style={tailwind(
        'content-center flex-1 h-full px-2 w-3/12',
      )}>
        <Text style={tailwind('bg-purple-400 rounded-full px-4 py-1 mt-3 text-xs text-center font-semibold text-gray-700 mr-2')}>Course</Text>
        <Text style={tailwind('text-gray-800 font-bold my-5 flex-row')}>{moment(race.created_at).format("DD-MM-YYYY")}</Text>
        <Text style={tailwind('bg-pink-200 rounded-full px-4 py-1 mt-3 text-base font-semibold text-gray-700 mr-2')}>{race.price} €</Text>
      </View>
    </View>
      
      )} 


      { offers.length != 0 && offers.map((offer, key) =>
        <View
          key={key}
          style={tailwind(
            'bg-white px-1 border-gray-200 border-t border-b h-40 flex-row items-center',
          )}>
          <View style={tailwind(
            'relative flex-initial h-full w-9/12 p-4',
          )}>
            <Text style={tailwind('text-gray-800 font-bold my-1 flex-row')}>Depart : <Text
              style={tailwind('text-gray-500 font-medium ')}>{offer.address_from}</Text></Text>
            <Text style={tailwind('text-gray-800 font-bold mt-2 flex-row')}>Arrivée : <Text
              style={tailwind('text-gray-500 font-medium ')}>{offer.address_to}</Text></Text>
              <Text style={tailwind('text-gray-800 font-bold mt-2 flex-row')}>Chauffeur : <Text
              style={tailwind('text-gray-500 font-medium ')}>{offer.driver_name}</Text></Text>
          </View>
          <View style={tailwind(
            'content-center flex-1 h-full px-2 ',
          )}>
             <Text style={tailwind('bg-purple-200 rounded-full px-4 py-1 mt-3 text-center text-xs font-semibold text-gray-700 mr-2')}>Trajet</Text>
            <Text style={tailwind('text-gray-800 font-bold my-5 flex-row')}>{moment(offer.created_at).format("DD-MM-YYYY")}</Text>
            <Text style={tailwind('bg-gray-200 rounded-full px-4 py-1 mt-3 text-base font-semibold text-gray-700 mr-2')}>{offer.price} €</Text>
          </View>
        </View>
          )}
    </ScrollView>

  );
}

export default HistoryTrip