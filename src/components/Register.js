import React, {useState, useContext} from 'react'
import {View, TextInput, Text, ScrollView, Linking,CheckBox,Image, Keyboard } from "react-native";
import {api} from "../utils/api";
import ImagePicker from 'react-native-image-picker'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";
import {showMessage, hideMessage} from 'react-native-flash-message';
import Input from "./Input";
import Button from './Button'
import tailwind from 'tailwind-rn'


const Register = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [phone_number, setPhone_number] = useState('');
    const [profile_picture_url, setProfilePictureUrl] = useState(null);
    const [address, setAddress] = useState('');
    const [zip_code, setZipCode] = useState('');
    const [city, setCity] = useState('');
    const [birth_date, setBirthSate] = useState('');
    const [password_confirmation, setPasswordConfirm] = useState('');
    const [base64Image, setBase64Image]=useState(null)
    const [isSelected,setSelected] = useState(false);
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('');
    const [show, setShow] = useState(false);
    
 
    const onChange = (event, selectedDate) => {
      if(event.type == "set"){
       const currentDate = selectedDate || date;
       
       const reformated = moment(currentDate).format('DD-MM-YYYY');
       setShow(false);
       setBirthSate(reformated);
       
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
            quality:1, 
            maxWidth: 1280,
            maxHeight: 720
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
        let body = {}
        if(profile_picture_url === null){
             body = {
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
            }
        }else{
             body = {
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
        }
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
        if(isSelected === false){
            return showMessage({
                message: 'Erreur',
                description: 'Vous devez accepter les conditions générales d\'utilisation.',
                type: 'danger',
                icon: 'danger',
            });  
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
            <View style={tailwind('w-full flex items-center mt-12')}>
                <Input label={"Email"} value={email} onChange={setEmail} placeholder={"email@email.com"}/>
                <Input label={"Prénom"} value={firstname} onChange={setFirstname} />
                <Input label={"Nom"} value={lastname} onChange={setLastname} />
                <Input label={"Téléphone"} value={phone_number} onChange={setPhone_number} keyboardType={"numeric"}/>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    {profile_picture_url && (<Image source={{ uri: `data:image/jpeg;base64,${base64Image}` }} style={{ width: 150, height: 150 }}/>)}
                    <Button
                        mode="contained"
                        onPress={() => handleChoosePhoto()}
                        title="Choisissez une photo"
                    />
                </View>
                <Input label={"Adresse"} value={address} onChange={setAddress} />
                <Input label={"Code postal"} value={zip_code} onChange={setZipCode} keyboardType={"numeric"}/>
                <Input label={"Ville"} value={city} onChange={setCity} />
                <Input label={"Date de naissance"} onFocus={() => {Keyboard.dismiss(); showDatepicker()}} value={birth_date.toString()}  />
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
                <Input label={"Mot de passe"} value={password} onChange={setPassword} placeholder={"*****"} secureTextEntry={true} />
                <Input label={"Confirmer votre mot de passe"} value={password_confirmation} onChange={setPasswordConfirm} placeholder={"*****"} secureTextEntry={true} />
               <View style={tailwind('flex-row items-center')}>
               <CheckBox
                   value={isSelected}
                   onValueChange={setSelected}
                   />
                    <Text >J'accepte les</Text><Text style={tailwind('text-blue-500')} onPress={ ()=> Linking.openURL('https://redha95.github.io/vue-project-esgi/')} > conditions générales d'utilisations</Text>
               </View>
                <Button title="S'inscrire" onPress={onPress} />
            </View>
        </ScrollView>
    );
};

export default Register;
