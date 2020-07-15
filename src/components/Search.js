import React, {useContext, useEffect} from 'react'
import {END, SearchContext, START} from "../context/SearchContext";
import {View, TouchableOpacity} from 'react-native'
import InputAddress from "./InputAddress";
import ResultsAddresses from "./ResultsAddresses";
import tailwind, {getColor} from "tailwind-rn";
import SearchSidebar from "../assets/icons/search-sidebar.svg"
import {search} from "../utils/geolocation";
import Button from "./Button";
import CloseSvg from "../assets/icons/close-outline.svg";
import {showMessage} from "react-native-flash-message";

const Search = (props) => {
  const {navigation} = props;
  const {from, setFrom, to, setTo, fromSelected, toSelected, setFromSelected, setToSelected, tripInfo, setTripInfo} = useContext(SearchContext);
  
  useEffect(() => {
    if (Object.keys(tripInfo).length > 0) {
      navigation.navigate('Map');
    }
  }, [tripInfo])
  
  const computeTrip = () => {
    if (!from || !to) {
      return showMessage({
        message: 'Erreur',
        description: 'Veuillez remplir les 2 adresses',
        type: 'danger',
        icon: 'danger',
      });
    }
    search(from, to).then(({from, to, tripInfo}) => {
      setFrom(from);
      setTo(to);
      setTripInfo(tripInfo);
    })
  }

  return (
    <View style={tailwind('bg-gray-100 h-full')}>
        <View style={tailwind('flex flex-row w-full items-center justify-center mt-4')}>
          <SearchSidebar/>
          <View style={tailwind('w-full flex w-10/12 ml-2')}>
            <View style={{...tailwind('mb-2 flex flex-row items-center'), width: '96%'}}>
              <InputAddress
                placeholder={"Départ"}
                value={from}
                setValue={setFrom}
                currentForm={START}
                isSelected={fromSelected}
                setIsSelected={setFromSelected}
              />
              <TouchableOpacity onPress={() => setFrom("")} style={tailwind('ml-1')}>
                <CloseSvg width={24} height={24} fill={getColor('gray-500')}/>
              </TouchableOpacity>
            </View>
            <View style={{...tailwind('mb-2 flex flex-row items-center'), width: '96%'}}>
              <InputAddress
                placeholder={"Arrivé"}
                value={to}
                setValue={setTo}
                currentForm={END}
                isSelected={toSelected}
                setIsSelected={setToSelected}
              />
              <TouchableOpacity onPress={() => setTo("")} style={tailwind('ml-1')}>
                <CloseSvg width={24} height={24} fill={getColor('gray-500')}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <ResultsAddresses/>
        <Button title="Valider" onPress={computeTrip} />
    </View>
  )
}

export default Search
