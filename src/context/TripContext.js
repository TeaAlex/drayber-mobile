import React, {createContext, useState} from 'react'

export const TripContext = createContext({});
export const SEARCHING = "SEARCHING";
export const DRIVER_FOUND = "DRIVER_FOUND";
export const TRIP_END = "TRIP_END";

const TripProvider = ({children}) => {

  const [status, setStatus] = useState(null);
  const [driverName, setDriverName] = useState(null);
  const [arrivalTime, setArrivalTime] = useState(null);

  const value = {
    status,
    setStatus,
    driverName,
    setDriverName,
    arrivalTime,
    setArrivalTime,
  }

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
}

export default TripProvider


