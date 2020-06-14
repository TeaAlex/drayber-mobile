import React, {useContext, useEffect} from 'react'
import {END, SearchContext, START} from "../context/SearchContext";
import {View, Text} from 'react-native'
import InputAddress from "./InputAddress";
import ResultsAddresses from "./ResultsAddresses";
import tailwind from "tailwind-rn";

const Search = () => {

  const {from, setFrom, to, setTo, fromSelected, toSelected, setFromSelected, setToSelected} = useContext(SearchContext);

  useEffect(() => {
    if (fromSelected === true && toSelected === true) {
      alert('recherche !')
    }
  }, [fromSelected, toSelected])

  return (
    <View style={tailwind('bg-gray-100 h-full')}>
        <View style={tailwind('flex flex-row flex-wrap w-full justify-center')}>
          <View style={tailwind('my-4 w-10/12')}>
            <InputAddress
              placeholder={"Départ"}
              value={from} setValue={setFrom}
              currentForm={START}
              isSelected={fromSelected}
              setIsSelected={setFromSelected}
            />
          </View>
          <View style={tailwind('w-10/12')}>
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
        <Text>From : {from} - To : {to}</Text>
        <Text>fromSelected : {JSON.stringify(fromSelected)} - toSelected : {JSON.stringify(toSelected)}</Text>
        <ResultsAddresses/>
    </View>
  )
}

export default Search
