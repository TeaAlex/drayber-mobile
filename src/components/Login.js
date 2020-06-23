import React, {useState, useContext} from 'react'
import {View, TextInput, Button, Text} from "react-native";
import {api} from "../utils/api";
import AsyncStorage from '@react-native-community/async-storage';
import {UserContext} from "../context/UserContext";


const Login = ({navigation}) => {

  const [email, setEmail] = useState('alex@alex.com');
  const [password, setPassword] = useState('toto');
  const {setUser} = useContext(UserContext);

  const onPress = async () => {
    const body = {
      uid: email,
      password
    }
    const {token} = await api('POST', '/login', body);
    try {
      await AsyncStorage.setItem('token', token);
      const user = await api('GET', '/users/current-user');
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
