import React, {useState, useContext} from 'react'
import {View, TextInput, Button, Text, TouchableOpacity} from "react-native";
import {api} from "../utils/api";
import AsyncStorage from '@react-native-community/async-storage';
import {UserContext} from "../context/UserContext";


const Login = ({navigation}) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

      <View >
                <Text >Pas encore de compte? </Text>
                <Button title="Inscrivez vous" onPress={() => navigation.navigate('Register')}/>
            </View>
    </View>
  )

}

export default Login
