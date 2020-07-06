import React, { useState, useEffect } from "react";
import tailwind from "tailwind-rn";
import { View, Text, TouchableHighlight, Image } from 'react-native';
import {api} from '../utils/api';
import PersonSvg from "../assets/icons/person.svg";
import MenuItem from "./MenuItem";
import { ScrollView } from "react-native-gesture-handler";


const ValidateAccount = ({route,navigation}) => {
    const color = '#586CD9';

    const [driver,setDriver] = useState(null);

    useEffect(() => {
      async function getDriverData () {
        try {
          const driver = await api('GET', '/users/'+route.params.driverId);

          setDriver(driver);
          console.log(driver);
      } catch (e) {
          console.error(e);
      }
        }
        getDriverData();
  }, []);


  return (
     
            <ScrollView >
              { driver && 
              <View>
                <MenuItem text={driver.user.firstname + " " + driver.user.lastname} >
                <PersonSvg width={24} height={24} fill={color}/>
                <Text style={tailwind('mr-3 ml-3')}>Compte : </Text>
              </MenuItem>
              <MenuItem text={driver.driver.iban} >
                <PersonSvg width={24} height={24} fill={color}/>
                <Text style={tailwind('mr-3 ml-3')}>IBAN : </Text>
              </MenuItem>
              <MenuItem text={driver.driver.bic} >
                <PersonSvg width={24} height={24} fill={color}/>
                <Text style={tailwind('mr-3 ml-3')}>BIC : </Text>
              </MenuItem>
              <MenuItem text={driver.driver.driving_licence_path} >
                <PersonSvg width={24} height={24} fill={color}/>
                <Text style={tailwind('mr-3 ml-3')}>Permis de conduire</Text>
              </MenuItem>
              </View>
              }
                
                
              <View style={tailwind('flex flex-row justify-center items-center')}>
            <TouchableHighlight style={{...tailwind('bg-indigo-800 p-4 rounded mt-5')}} >
              <Text style={tailwind('text-white font-bold text-center text-lg')}> Valider le compte </Text>
            </TouchableHighlight>
          </View>
            </ScrollView>
            
            
     
  )
}

export default ValidateAccount; 