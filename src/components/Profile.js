import React, { useContext, useEffect } from "react";
import tailwind from "tailwind-rn";
import { View, Text, TouchableHighlight, Image } from 'react-native';
import {UserContext} from "../context/UserContext";
import PersonSvg from "../assets/icons/person.svg";
import MenuItem from "./MenuItem";
import { ScrollView } from "react-native-gesture-handler";
import DateTimePicker from '@react-native-community/datetimepicker';


const Profile = ({navigation}) => {
  
    const {user} = useContext(UserContext);
    const color = '#586CD9';
    

  return (
     
            <ScrollView >
              <MenuItem text={user.user.lastname + " " + user.user.firstname} >
                <PersonSvg width={24} height={24} fill={color}/>
                <Text style={tailwind('mr-3')}>Nom</Text>

              </MenuItem>
              <MenuItem text={user.user.address} >
                <PersonSvg width={24} height={24} fill={color}/>
                <Text style={tailwind('mr-3')}>Adresse</Text>
              </MenuItem>
              <MenuItem text={user.user.zip_code} >
                <PersonSvg width={24} height={24} fill={color}/>
                <Text style={tailwind('mr-3')}>Code Postal</Text>
              </MenuItem>
              <MenuItem text={user.user.city} >
                <PersonSvg width={24} height={24} fill={color}/>
                <Text style={tailwind('mr-3')}>Ville</Text>
              </MenuItem>
              <MenuItem text={user.user.phone_number} >
                <PersonSvg width={24} height={24} fill={color}/>
                <Text style={tailwind('mr-3')}>Téléphone</Text>
              </MenuItem>
              <MenuItem text={user.user.birth_date}  >
                <PersonSvg width={24} height={24} fill={color}/>
                <Text style={tailwind('mr-3')}>Date de Naissance</Text>
              </MenuItem>
                
                
              <View style={tailwind('flex flex-row justify-center items-center')}>
            <TouchableHighlight style={{...tailwind('bg-indigo-800 p-4 rounded mt-5')}} onPress={() => navigation.navigate('ProfileUpdate')}>
              <Text style={tailwind('text-white font-bold text-center text-lg')} > Modifier mon profil </Text>
            </TouchableHighlight>
          </View>
            </ScrollView>
            
            
     
  )
}

export default Profile; 