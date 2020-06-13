import React, {useContext} from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import {END, SearchContext, START} from "../context/SearchContext";
import tailwind from "tailwind-rn";

const ResultsAddresses = () => {
  const {addresses, currentForm, setFrom, setTo} = useContext(SearchContext)

  const setAddress = (address) => {
    const strAddress = `${address.name} ${address.postcode}`;
    if(currentForm === START){
      setFrom(strAddress);
    } else if (currentForm === END) {
      setTo(strAddress);
    }
  }

  return (
    <View style={tailwind('mt-4')}>
      {
        addresses && addresses.map((address, index) =>
          <TouchableOpacity
            style={tailwind('p-4 bg-white border-t border-b border-gray-200')}
            onPress={() => setAddress(address)}
            key={index}
          >
            <View>
              <Text style={tailwind('text-gray-800 font-bold')}>
                {address.name}
              </Text>
              <Text style={tailwind('text-gray-600 text-sm')}>
                {address.postcode}
              </Text>
            </View>
          </TouchableOpacity>
        )
      }
    </View>
  )
}

export default ResultsAddresses
