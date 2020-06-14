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
  const [fromSelected, setFromSelected] = useState(false)
  const [toSelected, setToSelected] = useState(false)

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
    setToSelected
  }

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export default SearchProvider


