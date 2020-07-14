import React, {useState, useContext, useEffect} from 'react'
import {View, TextInput, Text, ScrollView, StyleSheet,Image, Keyboard } from "react-native";
import {api} from "../utils/api";
import {UserContext} from "../context/UserContext";
import ImagePicker from 'react-native-image-picker'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";
import Input from "./Input";
import Button from './Button'
import tailwind from 'tailwind-rn'

const ProfileUpdate = ({navigation}) => {
  const {user, setUser} = useContext(UserContext);
  const [firstname, setFirstname]=useState(user.user.firstname);
  const [lastname, setLastname]=useState(user.user.lastname);
  const [phone_number, setPhone_number]= useState(user.user.phone_number);
  const [profile_picture_url, setProfilePictureUrl]= useState(user.user.profile_picture_url);
  const [address, setAddress]= useState(user.user.address);
  const [zip_code, setZipCode]= useState(user.user.zip_code);
  const [city, setCity]= useState(user.user.city);
  const [birth_date, setBirthSate]= useState(moment(user.user.birth_date.toString()).format('DD-MM-YYYY'));
  const [oldImage]= useState(user.user.profile_picture_url);
  const [base64Image, setBase64Image]=useState(null)
  
  useEffect(() => {
    
    try {
      
      if(user.user.profile_picture_url != ""){
        api('GET', '/users/getUpload/'+user.user.profile_picture_url)
        .then(body => {
          if(body != undefined){
          setBase64Image(body.exists);
          }
        });
      }
  } catch (e) {
      console.error(e);
  }
}, []);

  const handleChoosePhoto = () => {
    const options = {
      mediaType: 'photo',
      quality:1, 
      maxWidth: 1280,
      maxHeight: 720
    }
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.data) {
        const fileName = response.fileName.split(' ').join('_');
        const currentTime = moment().format('X');
        const source = {
          name: user.user.email+"-"+currentTime+"-"+fileName,
          data: response.data
           
        };
        setProfilePictureUrl(source);
        setBase64Image(source.data);
      }
    })
  }

  const onPress = async () => {
    const body = {
      "firstname": firstname,
      "lastname": lastname,
      "phone_number":phone_number,
      "address": address,
      "zip_code": zip_code,
      "city": city,
      "birth_date": birth_date,
      "profile_picture_url":profile_picture_url.name
    }

    try {
      await api('PUT', '/users/update', body);
      if(oldImage != profile_picture_url){
      await api('POST', '/upload', profile_picture_url);
      }
      const user = await api('GET', '/users/current-user');
      setUser(user);
      navigation.navigate('Profile');
    } catch (e) {
        console.error(e);
    }
  }

   const [date, setDate] = useState(new Date());
   const [mode, setMode] = useState('date');
   const [show, setShow] = useState(false);
   

   const onChange = (event, selectedDate) => {
     if(event.type == "set"){
      const currentDate = selectedDate || date;
      
      const reformated = moment(currentDate).format('DD-MM-YYYY')
      setBirthSate(reformated);
      setShow(false);
     }else{
      setShow(false);
     }
   };

   const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
   };

   const showDatepicker = () => {
     showMode('date');
   };
   

  return (
    <ScrollView>
      <View style={tailwind('w-full flex items-center mt-12')}>
        <Input label={"Prénom"} value={firstname} onChange={setFirstname}/>
        <Input label={"Nom"} value={lastname} onChange={setLastname} />
        <Input label={"Téléphone"} value={phone_number} onChange={setPhone_number} keyboardType={"numeric"}/>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

      {profile_picture_url && (<Image source={{ uri: `data:image/jpeg;base64,${base64Image}` }} style={{ width: 150, height: 150 }}/>)}

     <Button mode="contained" onPress={() => handleChoosePhoto()} title="Choisissez une photo" />
      </View>
      <Input label={"Adresse"} value={address} onChange={setAddress} />
      <Input label={"Code postal"} value={zip_code} onChange={setZipCode} keyboardType={"numeric"}/>
      <Input label={"Ville"} value={city} onChange={setCity} />
      <Input label={"Date de naissance"} onFocus={showDatepicker} value={birth_date} />
                        {show && (
                        <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display="spinner"
                        onChange={onChange}
                        />
                    )} 
      
      <Button title="Modifier mes infos" onPress={onPress}/>
    </View>
    </ScrollView>
  )

}

export default ProfileUpdate

