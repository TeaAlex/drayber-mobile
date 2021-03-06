import React, { useState, useEffect } from "react";
import tailwind from "tailwind-rn";
import { Text, TouchableOpacity } from 'react-native';
import {api} from '../utils/api';
import PersonSvg from "../assets/icons/person.svg";
import MenuItem from "./MenuItem";
import { ScrollView } from "react-native-gesture-handler";



const PayDriver = ({navigation}) => {
    const color = '#586CD9';

    const [drivers,setDrivers] = useState([]);

    useEffect(() => {
      async function getDriversToValidate () {
        try {
          const allDrivers = await api('GET', '/users/get-all-drivers');
          const allUsers = await api('GET', '/users/get-all');
          // console.log(drivers)
          var drivers_to_pay = []
          for(let i = 0;i< allDrivers.users.length;i++){
            if(allDrivers.users[i].credit !== 0 && allDrivers.users[i].active_driver === true){
              drivers_to_pay.push(allDrivers.users[i])
            }
          }
          var tab = []
          for(let y = 0; y< allUsers.users.length;y++){
              for(let w = 0;w<drivers_to_pay.length;w++){
                if(drivers_to_pay[w].user_id === allUsers.users[y].id){
                  tab.push(drivers_to_pay[w], allUsers.users[y]);
                }
              }
          }
          setDrivers(tab);
      } catch (e) {
          console.error(e);
      }
        }
        getDriversToValidate();
  }, []);

  return (
     
            <ScrollView >
        {
          drivers && drivers.filter(id => id.firstname).map((driver, index) =>
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate('ValidatePayment',{
                driverId: driver.id,
              })}
            >
            <MenuItem text={driver.firstname + " " + driver.lastname} >
              <PersonSvg width={24} height={24} fill={color}/>
              <Text style={tailwind('mr-3 ml-3')}>Driver a créditer :</Text>
             </MenuItem>
            </TouchableOpacity>
          )
        }       
            </ScrollView>
            
            
     
  )
}

export default PayDriver; 