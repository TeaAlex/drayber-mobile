<<<<<<< HEAD
import React, {useState, useContext} from 'react';
import {View, TextInput, Button, Text, TouchableOpacity} from 'react-native';
import {api} from '../utils/api';
import AsyncStorage from '@react-native-community/async-storage';
import {UserContext} from '../context/UserContext';

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
            return alert("Votre email est invalide");
        }
        if(password.length === 0){

            return alert("Veuillez renseigner un mot de passe");
        }
        const {token} = await api('POST', '/login', body);
        try {
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('changeMode', 'Client');
            const user = await api('GET', '/users/current-user');
            setUser(user);
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
        </View>
    );
};

export default Login;
=======
import React, {useState, useContext, useEffect} from 'react'
import {View, TextInput, Button, Text} from "react-native";
import {api} from "../utils/api";
import AsyncStorage from '@react-native-community/async-storage';
import {UserContext} from "../context/UserContext";
import messaging from "@react-native-firebase/messaging";


const Login = ({navigation}) => {

  const [email, setEmail] = useState('alex@alex.com');
  const [password, setPassword] = useState('toto');
  const {setUser} = useContext(UserContext);

  useEffect(() => {
    messaging().getToken().then(token => api('POST', '/users/save-device-token', { device_token: token }));
  }, [])

  const onPress = async () => {
    const body = {
      uid: email,
      password
    }
    const {token} = await api('POST', '/login', body);
    try {
      await AsyncStorage.setItem('token', token);
      const {user} = await api('GET', '/users/current-user');
      setUser(user);
      navigation.navigate('Home');
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <View>
      <View>
        <Text>Email</Text>
        <TextInput value={email} onChangeText={(text) => setEmail(text)}/>
      </View>
      <View>
        <Text>Mot de passe</Text>
        <TextInput value={password} secureTextEntry={true} onChangeText={(text) => setPassword(text)}/>
      </View>
      <Button title="Se connecter" onPress={onPress}/>
    </View>
  )

}

export default Login
>>>>>>> wip
