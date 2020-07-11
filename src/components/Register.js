import React, {useState, useContext} from 'react'
import {View, TextInput, Button, Text, ScrollView, StyleSheet,Image } from "react-native";
import {api} from "../utils/api";
import ImagePicker from 'react-native-image-picker'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";
import {showMessage, hideMessage} from 'react-native-flash-message';

const Register = ({navigation}) => {
    const [email, setEmail] = useState('@a.fr');
    const [password, setPassword] = useState('aaa');
    const [firstname, setFirstname] = useState('reds');
    const [lastname, setLastname] = useState('rods');
    const [phone_number, setPhone_number] = useState('0612345678');
    const [profile_picture_url, setProfilePictureUrl] = useState(null);
    const [address, setAddress] = useState('1 rue de Saint Denis');
    const [zip_code, setZipCode] = useState('75001');
    const [city, setCity] = useState('Paris');
    const [birth_date, setBirthSate] = useState('1990-10-10');
    const [password_confirmation, setPasswordConfirm] = useState('');
    const [base64Image, setBase64Image]=useState(null)

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

    const handleChoosePhoto = () => {
        const options = {
          mediaType: 'photo',
    
        }
        ImagePicker.launchImageLibrary(options, (response) => {
          if (response.data) {
            const fileName = response.fileName.split(' ').join('_');
            const currentTime = moment().format('X');
            const source = {
              name: email+"-"+currentTime+"-"+fileName,
              data: response.data
               
            };
            setProfilePictureUrl(source);
            setBase64Image(source.data);
          }
        })
      }

    const onPress = async () => {
        const body = {
            "email": email,
            "password": password,
            "password_confirmation": password_confirmation,
            "firstname": firstname,
            "lastname": lastname,
            "phone_number":phone_number,
            "address": address,
            "zip_code": zip_code,
            "city": city,
            "birth_date": birth_date,
            "profile_picture_url":profile_picture_url.name
        }
        console.log(profile_picture_url.name);
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if(!re.test(email) || email.length === 0 ){
            return showMessage({
                message: 'Erreur',
                description: 'Votre email est invalide.',
                type: 'danger',
                icon: 'danger',
              });
            //return alert("Votre email est invalide");
        }
        if(password.length === 0 ||
            password_confirmation.length === 0 ||
            firstname.length === 0 ||
            phone_number.length === 0 ||
            address.length === 0 ||
            zip_code.length === 0 ||
            city.length === 0 ||
            birth_date.length === 0){
            return showMessage({
                message: 'Erreur',
                description: 'Tout les champs doivent être renseigner.',
                type: 'danger',
                icon: 'danger',
            });    
            //return alert("Tout les champs doivent être renseigner");
        }

        if(password !== password_confirmation){
            return showMessage({
                message: 'Erreur',
                description: 'Les deux mots de passe ne correspondent pas.',
                type: 'danger',
                icon: 'danger',
            });  
            //return alert("Les deux mots de passe ne correspondent pas");
        }

        try {
            await api('POST', '/register', body);
            if(profile_picture_url){
                console.log(profile_picture_url)
                await api('POST', '/upload', profile_picture_url);
            }
            navigation.navigate('Login');
            return showMessage({
                message: 'Succès',
                description: 'Vous allez recevoir un courriel vous permettant de confirmer votre compte.',
                type: 'success',
                icon: 'success',
              });
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <ScrollView>
            <View style={styles.backgroundContainer}>
                <View style={styles.container}>
                    <Text>Email</Text>
                    <TextInput
                        style={styles.input}
                        style={styles.input}
                        value={email}
                        onChangeText={text => setEmail(text)}
                    />
                </View>
                <View style={styles.container}>
                    <Text>Prénom</Text>
                    <TextInput
                        style={styles.input}
                        value={firstname}
                        onChangeText={text => setFirstname(text)}
                    />
                </View>
                <View style={styles.container}>
                    <Text>Nom</Text>
                    <TextInput
                        style={styles.input}
                        value={lastname}
                        onChangeText={text => setLastname(text)}
                    />
                </View>
                <View style={styles.container}>
                    <Text>Téléphone</Text>
                    <TextInput
                        style={styles.input}
                        value={phone_number}
                        keyboardType='numeric'
                        onChangeText={text => setPhone_number(text)}
                    />
                </View>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    {profile_picture_url && (<Image source={{ uri: `data:image/jpeg;base64,${base64Image}` }} style={{ width: 150, height: 150 }}/>)}

                    <Button
                        mode="contained"
                        onPress={() => handleChoosePhoto()}
                        title="Choisissez une photo"
                    />
                </View>
                <View style={styles.container}>
                    <Text>Adresse</Text>
                    <TextInput
                        style={styles.input}
                        value={address}
                        onChangeText={text => setAddress(text)}
                    />
                </View>
                <View style={styles.container}>
                    <Text>Code postal</Text>
                    <TextInput
                        style={styles.input}
                        value={zip_code}
                        keyboardType='numeric'
                        onChangeText={text => setZipCode(text)}
                    />
                </View>
                <View style={styles.container}>
                    <Text>Ville</Text>
                    <TextInput
                        style={styles.input}
                        value={city}
                        onChangeText={text => setCity(text)}
                    />
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
                <View style={styles.container}>
                    <Text>Mot de passe</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        secureTextEntry={true}
                        onChangeText={text => setPassword(text)}
                    />
                </View>
                <View style={styles.container}>
                    <Text>Confirmer mot de passe</Text>
                    <TextInput
                        style={styles.input}
                        value={password_confirmation}
                        secureTextEntry={true}
                        onChangeText={text => setPasswordConfirm(text)}
                    />
                </View>
                <Button title="S'inscrire" onPress={onPress} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 12,
    },
    input: {
        backgroundColor: 'white',
    },
    error: {
        fontSize: 14,
        color: 'red',
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
    },
});

export default Register;
