import React, {useState, useContext} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {api} from '../utils/api';
import AsyncStorage from '@react-native-community/async-storage';
import {UserContext} from '../context/UserContext';
import messaging from "@react-native-firebase/messaging";
import {showMessage, hideMessage} from 'react-native-flash-message';
import Input from "./Input";
import Button from './Button'
import tailwind from 'tailwind-rn'
import { ScrollView } from 'react-native-gesture-handler';


const Login = ({navigation}) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {setUser} = useContext(UserContext);

  const onPress = async () => {
    const body = {
      uid: email,
      password
    }

    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(!re.test(email) || email.length === 0){
      return showMessage({
        message: 'Erreur',
        description: 'Votre email est invalide.',
        type: 'danger',
        icon: 'danger',
      });
    }
    if(password.length === 0){

     return showMessage({
        message: 'Erreur',
        description: 'Veuillez renseigner un mot de passe.',
        type: 'danger',
        icon: 'danger',
      });
    }
    const {token} = await api('POST', '/login', body);
    try {
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('changeMode', 'Client');
      const user = await api('GET', '/users/current-user');
      setUser(user);
      messaging().getToken().then(token =>  {
        console.log(token)
        api('POST', '/users/save-device-token', { device_token: token })
      });
      navigation.navigate('Home');
    } catch (e) {
      console.error(e);
    }
  };


    return (
      <ScrollView>
        <View style={tailwind('w-full flex items-center mt-16')}>
            <Image source={require('../assets/drayberandlogo.png')}></Image>
            <Input label={"Email"} value={email} onChange={setEmail} placeholder={"email@email.com"}/>
            <Input label={"Mot de passe"} value={password} onChange={setPassword} placeholder={"*****"} secureTextEntry={true} />
            <Button title="Se connecter" onPress={onPress} />
            <View style={tailwind('w-full flex items-center mt-3')}>
              <View style={tailwind('w-2/3 flex items-center mb-1')}>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text style={tailwind('text-indigo-800 font-bold')}>Mot de passe oublié ?</Text>
                </TouchableOpacity>
              </View>
              <View style={tailwind('w-2/3 flex items-center mb-1')}>
                <Text style={tailwind('text-gray-800 mb-1')}>Pas encore de compte ? </Text>
                <Button title={"S'inscrire"} onPress={() => navigation.navigate('Register')}>
                </Button>
              </View>
            </View>
        </View>
        </ScrollView>
    );

};

export default Login;
