import React, {useState, useEffect, useContext} from 'react'
import {SearchContext} from "../context/SearchContext";
import tailwind from "tailwind-rn";
import {TextInput} from "react-native";
import useDebounce from "../hooks/useDebounce";

const InputAddress = (props) => {

  const {placeholder, value, setValue, currentForm, isSelected, setIsSelected} = props;
  const debouncedValue = useDebounce(value, 500);
  const {setAddresses, setCurrentForm} = useContext(SearchContext);

  useEffect( () => {
      if (debouncedValue && !isSelected) {
        const autocomplete = async (text) => {
          const url = `http://photon.komoot.de/api/?lang=fr&q=${text}&limit=10`;
          const response = await fetch(url);
          const data = await response.json();
          const addresses =  data.features.map(({properties}, index) => {
            const {name, postcode} = properties;
            return {index, name, postcode};
          })
          setAddresses(addresses)
          setCurrentForm(currentForm);
        }
        autocomplete(debouncedValue)
      } else {
        setAddresses([]);
      }
    },
    [debouncedValue]
  );

  return (
    <TextInput
      style={tailwind('w-full bg-white border-2 border-gray-200 p-3 rounded text-gray-700 font-bold')}
      value={value}
      placeholder={placeholder}
      onChangeText={(text) => {
        setValue(text)
        setIsSelected(false)
      }}
    />
  )

}

export default InputAddress
