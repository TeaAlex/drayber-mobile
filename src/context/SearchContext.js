import React, {createContext, useState} from 'react'

export const SearchContext = createContext({});

export const START = "start"
export const END = "end"

const SearchProvider = ({children}) => {
  
  let home = "24 rue des hirondelles, pontault-combault"
  let gare = "gare d'emerainville pontault-combault";
  const [addresses, setAddresses] = useState([])
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [selectedAddress, setSelectedAddress] = useState("")
  const [currentForm, setCurrentForm] = useState("")
  const [fromSelected, setFromSelected] = useState(true)
  const [toSelected, setToSelected] = useState(true)
  const [tripInfo, setTripInfo] = useState({})

  const value = {
    addresses,
    setAddresses,
    from,
    setFrom,
    to,
    setTo,
    selectedAddress,
    setSelectedAddress,
    currentForm,
    setCurrentForm,
    fromSelected,
    toSelected,
    setFromSelected,
    setToSelected,
    tripInfo,
    setTripInfo
  }

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export default SearchProvider


