import React, {useContext, useEffect, useState} from "react";
import tailwind from "tailwind-rn";
import {View, Text, TouchableHighlight, Image} from 'react-native';
import {UserContext} from "../context/UserContext";
import MenuItem from "./MenuItem";
import {ScrollView} from "react-native-gesture-handler";
import {api} from "../utils/api";
import moment from "moment";


const Profile = ({navigation}) => {
  
  const {user} = useContext(UserContext);
  const [base64Image, setBase64Image] = useState(null)
  
  useEffect(() => {
    try {
      if (user.user.profile_picture_url != null) {
        api('GET', '/users/getUpload/' + user.user.profile_picture_url)
        .then(body => {
          if (body != undefined) {
            setBase64Image(body.exists);
          }
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, []);
  
  return (
    
    <ScrollView>
      <MenuItem text={"Photo de profil"}>
        <Image source={{uri: `data:image/jpeg;base64,${base64Image}`}} style={{width: 50, height: 50}}/>
      </MenuItem>
      <MenuItem text={user.user.lastname + " " + user.user.firstname}>
        <Text style={tailwind('mr-3')}>Nom</Text>
      </MenuItem>
      <MenuItem text={user.user.address}>
        <Text style={tailwind('mr-3')}>Adresse</Text>
      </MenuItem>
      <MenuItem text={user.user.zip_code}>
        
        <Text style={tailwind('mr-3')}>Code Postal</Text>
      </MenuItem>
      <MenuItem text={user.user.city}>
        
        <Text style={tailwind('mr-3')}>Ville</Text>
      </MenuItem>
      <MenuItem text={user.user.phone_number}>
        
        <Text style={tailwind('mr-3')}>Téléphone</Text>
      </MenuItem>
      <MenuItem text={moment(user.user.birth_date.toString()).format('DD-MM-YYYY')}>
        
        <Text style={tailwind('mr-3')}>Date de Naissance</Text>
      </MenuItem>
      
      <View style={tailwind('flex flex-row justify-center items-center')}>
        <TouchableHighlight style={{...tailwind('bg-indigo-800 p-4 rounded mt-5')}}
                            onPress={() => navigation.navigate('ProfileUpdate')}>
          <Text style={tailwind('text-white font-bold text-center text-lg')}> Modifier mon profil </Text>
        </TouchableHighlight>
      </View>
    </ScrollView>
  
  
  )
}

export default Profile; 