import React, {useState, useContext, useEffect} from 'react';
import {View, TextInput, Button, Text, TouchableOpacity} from 'react-native';
import {api} from '../utils/api';
import AsyncStorage from '@react-native-community/async-storage';
import {UserContext} from '../context/UserContext';
import messaging from "@react-native-firebase/messaging";
import {showMessage, hideMessage} from 'react-native-flash-message';


const Login = ({navigation}) => {

  const [email, setEmail] = useState('support@drayber.fr');
  const [password, setPassword] = useState('aaa');
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
        <View>
            <View>
                <Text>Email</Text>
                <TextInput value={email} onChangeText={text => setEmail(text)} />
            </View>
            <View>
                <Text>Mot de passe</Text>
                <TextInput
                    value={password}
                    secureTextEntry={true}
                    onChangeText={text => setPassword(text)}
                />
            </View>
            <Button title="Se connecter" onPress={onPress} />

            <View>
                <Text>Pas encore de compte? </Text>
                <Button
                    title="Inscrivez vous"
                    onPress={() => navigation.navigate('Register')}
                />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text>Mot de passe oublié ?</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => navigation.navigate('NewPassword')}>
        <Text>Mot de passe oubliée ?</Text>
      </TouchableOpacity>*/}
        </View>
    );

};

export default Login;
