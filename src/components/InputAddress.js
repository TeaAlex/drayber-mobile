import React, {useEffect, useContext} from 'react'
import {SearchContext} from "../context/SearchContext";
import tailwind from "tailwind-rn";
import {TextInput, TouchableOpacity, View} from "react-native";
import useDebounce from "../hooks/useDebounce";
import {GOOGLE_API_KEY} from 'react-native-dotenv';
import CloseSvg from '../assets/icons/clock-outline.svg';


const InputAddress = (props) => {

  const {placeholder, value, setValue, currentForm, isSelected, setIsSelected} = props;
  const debouncedValue = useDebounce(value, 10);
  const {setAddresses, setCurrentForm} = useContext(SearchContext);

  useEffect( () => {
      if (debouncedValue && !isSelected) {
        const autocomplete = async (text) => {
          const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&language=fr&key=${GOOGLE_API_KEY}&sessiontoken=123`;
          const response = await fetch(url);
          const data = await response.json();
          const addresses = data.predictions.map(({id, structured_formatting}) => {
            const { main_text, secondary_text } = structured_formatting
            return {
              id,
              main_text,
              secondary_text
            }
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
