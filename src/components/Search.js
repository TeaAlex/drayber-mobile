import React, {useContext, useEffect} from 'react'
import {END, SearchContext, START} from "../context/SearchContext";
import {View, Text} from 'react-native'
import InputAddress from "./InputAddress";
import ResultsAddresses from "./ResultsAddresses";
import tailwind from "tailwind-rn";
import SearchSidebar from "../assets/icons/search-sidebar.svg"
import {search} from "../utils/geolocation";

const Search = (props) => {
  const {navigation} = props;
  const {from, setFrom, to, setTo, fromSelected, toSelected, setFromSelected, setToSelected, tripInfo, setTripInfo} = useContext(SearchContext);

  useEffect( () => {
    if (fromSelected === true && toSelected === true) {
      search(from, to).then(({from, to, tripInfo}) => {
        setFrom(from);
        setTo(to);
        setTripInfo(tripInfo);
      })
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
