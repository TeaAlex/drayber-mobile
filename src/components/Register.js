import React, {useState, useContext} from 'react'
import {View, TextInput, Button, Text, ScrollView, StyleSheet } from "react-native";
import {api} from "../utils/api";
import {UserContext} from "../context/UserContext";
import ImagePicker from 'react-native-image-picker'

const Register = ({navigation}) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname]=useState('');
  const [lastname, setLastname]=useState('');
  const [phone_number, setPhone_number]= useState('');
  const [profile_picture_url, setProfilePictureUrl]= useState('');
  const [address, setAddress]= useState('');
  const [zip_code, setZipCode]= useState('');
  const [city, setCity]= useState('');
  const [birth_date, setBirthSate]= useState('');
  const [password_confirmation, setPasswordConfirm] = useState('');
  const {setUser} = useContext(UserContext);

  const handleChoosePhoto = () => {
    const options = {
      noData: true,
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        setPicture(response)
      }
    })
  }

  const onPress = async () => {
    const body = {
      "email": email,
      "password": password,
      "password_confirmation": password_confirmation,
      "firstname": firstname,
      "lastname": lastname
    }
    console.log(body);
    api('POST', '/register', body)
        .then(() => { navigation.navigate('Login') });

  }

  return (
    <ScrollView>
    <View style={styles.backgroundContainer}>
      <View style={styles.container}>
        <Text>Email</Text>
        <TextInput style={styles.input} style={styles.input} value={email} onChangeText={(text) => setEmail(text)}/>
      </View>
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
      {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {profile_picture_url && (<Image source={{ uri: profile_picture_url.uri }} style={{ width: 150, height: 150 }}/>)}
       
     <Button mode="contained" onPress={() => handleChoosePhoto()} >  Choisissez une photo </Button>
      </View> */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {profile_picture_url && (<Image source={{ uri: profile_picture_url.uri }} style={{ width: 150, height: 150 }}/>)}
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
        <TextInput style={styles.input} value={birth_date} onChangeText={(text) => setBirthSate(text)}/>
      </View>
      <View style={styles.container}>
        <Text>Mot de passe</Text>
        <TextInput style={styles.input} value={password} secureTextEntry={true} onChangeText={(text) => setPassword(text)}/>
      </View>
      <View style={styles.container}>
        <Text>Confirmer mot de passe</Text>
        <TextInput style={styles.input} value={password_confirmation} secureTextEntry={true} onChangeText={(text) => setPasswordConfirm(text)}/>
      </View>
      <Button title="S'inscrire" onPress={onPress}/>
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



export default Register
