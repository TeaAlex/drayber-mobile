import React, {useContext, useEffect} from 'react'
import {END, SearchContext, START} from "../context/SearchContext";
import {View, Text} from 'react-native'
import InputAddress from "./InputAddress";
import ResultsAddresses from "./ResultsAddresses";
import tailwind from "tailwind-rn";
import SearchSidebar from "../assets/icons/search-sidebar.svg"
import {GOOGLE_API_KEY} from "react-native-dotenv";
import polyline from "@mapbox/polyline";

const Search = (props) => {
  const {navigation} = props;
  const {from, setFrom, to, setTo, fromSelected, toSelected, setFromSelected, setToSelected, tripInfo, setTripInfo} = useContext(SearchContext);

  useEffect( () => {
    if (fromSelected === true && toSelected === true) {
      const search = async () => {
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${from}&destination=${to}&key=${GOOGLE_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        const encodedPolyline = data.routes[0].overview_polyline.points;
        const points = polyline.decode(encodedPolyline);
        const coords = points.map(point => {
          const [latitude, longitude] = point;
          return { latitude,longitude }
        })
        const leg = data.routes[0].legs[0];
        setFrom(leg.start_address);
        setTo(leg.end_address);
        setTripInfo({
          distance: leg.distance.text,
          duration: leg.duration.text,
          price: parseInt(leg.distance.text) * 2,
          startAddress: {
            name: leg.start_address,
            coords: {
              latitude: leg.start_location.lat,
              longitude: leg.start_location.lng
            }
          },
          endAddress: {
            name: leg.end_address,
            coords: {
              latitude: leg.end_location.lat,
              longitude: leg.end_location.lng
            }
          },
          coords,
          encodedPolyline
        })
      }
      search();
    }
  }, [fromSelected, toSelected])

  useEffect(() => {
    if (Object.keys(tripInfo).length > 0) {
      navigation.navigate('Map');
    }
  }, [tripInfo])

  return (
    <View style={tailwind('bg-gray-100 h-full')}>
        <View style={tailwind('flex flex-row w-full items-center justify-center mt-4')}>
          <SearchSidebar/>
          <View style={tailwind('w-full flex w-10/12 ml-2')}>
            <View style={tailwind('mb-2')}>
              <InputAddress
                placeholder={"Départ"}
                value={from}
                setValue={setFrom}
                currentForm={START}
                isSelected={fromSelected}
                setIsSelected={setFromSelected}
              />
            </View>
            <View style={tailwind('')}>
              <InputAddress
                placeholder={"Arrivé"}
                value={to}
                setValue={setTo}
                currentForm={END}
                isSelected={toSelected}
                setIsSelected={setToSelected}
              />
            </View>
          </View>
        </View>
        <ResultsAddresses/>
    </View>
  )
}

export default Search
