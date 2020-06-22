import React, {useContext} from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import {END, SearchContext, START} from "../context/SearchContext";
import tailwind from "tailwind-rn";
import SearchResultIcon from "../assets/icons/search-result-icon.svg"

const ResultsAddresses = () => {
  const {addresses, setAddresses, currentForm, setFrom, setTo, setFromSelected, setToSelected} = useContext(SearchContext)

  const onPress = (address) => {
    const strAddress = `${address.main_text} ${address.secondary_text}`;
    if(currentForm === START){
      setFrom(strAddress);
      setFromSelected(true);
    } else if (currentForm === END) {
      setTo(strAddress);
      setToSelected(true);
    }
    setAddresses([]);
  }

  return (
    <View style={tailwind('mt-4')}>
      {
        addresses && addresses.map((address, index) =>
          <TouchableOpacity
            style={tailwind('p-4 bg-white border-t border-b border-gray-200 flex flex-row items-center')}
            onPress={() => onPress(address)}
            key={index}
          >
            <View style={tailwind('mr-3')}>
             <SearchResultIcon/>
            </View>
            <View>
              <Text style={tailwind('text-gray-800 font-bold')}>
                {address.main_text}
              </Text>
              <Text style={tailwind('text-gray-600 text-sm')}>
                {address.secondary_text}
              </Text>
            </View>
          </TouchableOpacity>
        )
      }
    </View>
  )
}

export default ResultsAddresses
