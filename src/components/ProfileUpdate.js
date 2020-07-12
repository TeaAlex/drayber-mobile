import React, {useState, useContext, useEffect} from 'react'
import {View, TextInput, Button, Text, ScrollView, StyleSheet,Image, Keyboard } from "react-native";
import {api} from "../utils/api";
import {UserContext} from "../context/UserContext";
import ImagePicker from 'react-native-image-picker'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";

const ProfileUpdate = ({navigation}) => {
  const {user, setUser} = useContext(UserContext);
  const [firstname, setFirstname]=useState(user.user.firstname);
  const [lastname, setLastname]=useState(user.user.lastname);
  const [phone_number, setPhone_number]= useState(user.user.phone_number);
  const [profile_picture_url, setProfilePictureUrl]= useState(user.user.profile_picture_url);
  const [address, setAddress]= useState(user.user.address);
  const [zip_code, setZipCode]= useState(user.user.zip_code);
  const [city, setCity]= useState(user.user.city);
  const [birth_date, setBirthSate]= useState(user.user.birth_date);
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
      
      const reformated = currentDate.getDate().toString() + "-" +currentDate.getMonth().toString()+ "-" + currentDate.getFullYear().toString();
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
    <View style={styles.backgroundContainer}>
      
      <View style={styles.container}>
        <Text>Prénom</Text>
        <TextInput style={styles.input} value={firstname} onChangeText={(text) => setFirstname(text)}/>
      </View>
      <View style={styles.container}>
        <Text>Nom</Text>
        <TextInput style={styles.input} value={lastname} onChangeText={(text) => setLastname(text)}/>
      </View>
      <View style={styles.container}>
        <Text>Téléphone</Text>
        <TextInput style={styles.input} value={phone_number} onChangeText={(text) => setPhone_number(text)}/>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

      {profile_picture_url && (<Image source={{ uri: `data:image/jpeg;base64,${base64Image}` }} style={{ width: 150, height: 150 }}/>)}

     <Button mode="contained" onPress={() => handleChoosePhoto()} title="Choisissez une photo" />
      </View>
      <View style={styles.container}>
        <Text>Adresse</Text>
        <TextInput style={styles.input} value={address} onChangeText={(text) => setAddress(text)}/>
      </View>
      <View style={styles.container}>
        <Text>Code postal</Text>
        <TextInput style={styles.input} value={zip_code} onChangeText={(text) => setZipCode(text)}/>
      </View>
      <View style={styles.container}>
        <Text>Ville</Text>
        <TextInput style={styles.input} value={city} onChangeText={(text) => setCity(text)}/>
      </View>
      <View style={styles.container}>
        <Text>Date de naissance</Text>
        <TextInput style={styles.input} onFocus={showDatepicker}  value={birth_date.toString()}  />
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
      </View>
      
      <Button title="Modifier mes infos" onPress={onPress}/>
    </View>
    </ScrollView>
  )

}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
  input: {
    backgroundColor: "white",
  },
  error: {
    fontSize: 14,
    color: "red",
    paddingHorizontal: 4,
    paddingTop: 4,
  },
  backgroundContainer: { 
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  }
});



export default ProfileUpdate

