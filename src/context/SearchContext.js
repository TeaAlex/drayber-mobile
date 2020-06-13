import React, {createContext, useState} from 'react'

export const SearchContext = createContext({});

export const START = "start"
export const END = "end"

const SearchProvider = ({children}) => {
  const [addresses, setAddresses] = useState([])
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [selectedAddress, setSelectedAddress] = useState("")
  const [currentForm, setCurrentForm] = useState("")

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
    setCurrentForm
  }

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export default SearchProvider


