import React, {createContext, useState} from 'react'

export const TripContext = createContext({});
export const SEARCHING = "SEARCHING";
export const DRIVER_FOUND = "DRIVER_FOUND";
export const TRIP_END = "TRIP_END";
export const DRIVER_NOT_FOUND = "DRIVER_NOT_FOUND";

const TripProvider = ({children}) => {

  const [status, setStatus] = useState(null);
  const [driverName, setDriverName] = useState(null);
  const [driver, setDriver] = useState(null);
  const [arrivalTime, setArrivalTime] = useState(null);
  const [tripRecap, setTripRecap] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);

  const value = {
    status,
    setStatus,
    driverName,
    setDriverName,
    arrivalTime,
    setArrivalTime,
    driver,
    setDriver,
    tripRecap,
    setTripRecap,
    phoneNumber,
    setPhoneNumber
  }

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
}

export default TripProvider


