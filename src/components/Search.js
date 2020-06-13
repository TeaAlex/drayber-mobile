import React, {useContext} from 'react'
import {END, SearchContext, START} from "../context/SearchContext";
import {View} from 'react-native'
import InputAddress from "./InputAddress";
import ResultsAddresses from "./ResultsAddresses";
import tailwind from "tailwind-rn";

const Search = () => {

  const {from, setFrom, to, setTo} = useContext(SearchContext);

  return (
    <View style={tailwind('bg-gray-100 h-full')}>
        <View style={tailwind('flex flex-row flex-wrap w-full justify-center')}>
          <View style={tailwind('my-4 w-2/3')}>
            <InputAddress placeholder={"Départ"} value={from} setValue={setFrom} currentForm={START}/>
          </View>
          <View style={tailwind('w-2/3')}>
            <InputAddress placeholder={"Arrivé"} value={to} setValue={setTo} currentForm={END}/>
          </View>
        </View>
        <ResultsAddresses/>
    </View>
  )
}

export default Search
