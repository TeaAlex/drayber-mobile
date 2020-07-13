import React, {useState, useContext, useEffect} from 'react'
import {View,  Button, Text, ScrollView, } from "react-native";
import tailwind from 'tailwind-rn';
import { api } from '../utils/api';
import { UserContext } from '../context/UserContext';


const HistoryTrip = () => {
  const {user} = useContext(UserContext);
    const [trips, setTrips] = useState([]);
    const [offers, setOffers] = useState([]);

  useEffect(() => {
    async function getTrips () {
      try {
        if(user.driver){
          const allTrip = await api('GET', '/trip/driver_trip');
          setTrips(allTrip);
          const offer = [];
          console.log("je suis la");
          trips.map(async function(trip, key) {
            const allOffers = await api('GET', '/offer/'+trip.offer_id);
            offer.push(allOffers)
          })


        }else{
          const allTrip = await api('GET', '/trip/client_trip');
          setTrips(allTrip);
          const searchoffers = [];
          allTrip.map(async function(trip, key) {
            console.log("je suis ici");
            const body = await api('GET', '/offer/'+trip.offer_id);
            console.log(body);
            searchoffers.push(body)
          })
          //console.log(serachoffers);
          setOffers(searchoffers)
        }
        
    } catch (e) {
        console.error(e);
    }
      }
    getTrips();
    
}, []);

      
    return(
    <ScrollView>
      { offers  && offers.map((offer, key) => 
        
        <View
      style={tailwind(
        'bg-white px-1 border-gray-200 border-t border-b h-32 flex-row items-center',
      )}> 
      <View  style={tailwind(
        'relative flex-initial h-24 w-9/12 p-4',
      )}>
      <Text style={tailwind('text-gray-800 font-bold my-1 flex-row')}>Depart  : <Text style={tailwind('text-gray-500 font-medium ')}>{offer.address_from}</Text></Text>
      <Text style={tailwind('text-gray-800 font-bold my-1 flex-row')}>Arrivée : <Text style={tailwind('text-gray-500 font-medium ')}>{offer.address_to}</Text></Text>
      </View>
      <View  style={tailwind(
        'content-center flex-1 h-20 p-2 ',
      )}>
        <Text style={tailwind('text-gray-800 font-bold my-1 flex-row')}>{offer.created_at}</Text>
      <Text style={tailwind('text-gray-800 font-medium text-center my-1 flex-row text-lg')}>{offer.price} €</Text>
      </View>
    </View>
    
      ) }
      </ScrollView>
        
    );
}

export default HistoryTrip