import React, { useState} from 'react';
import tailwind from 'tailwind-rn';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import {api} from '../utils/api';
import {showMessage} from 'react-native-flash-message';
import Input from "./Input";

const NewPassword = ({navigation}) => {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [password_confirmation, setPasswordConfirm] = useState('');

  const onPress = async () => {
    const body = {
      password: password,
      password_confirmation: password_confirmation,
      token: token,
    };
    console.log(body);

    if (password.length === 0) {
      return showMessage({
        message: 'Erreur',
        description: "Veuillez renseigner un mot de passe. ",
        type: 'danger',
        icon: 'danger',
      });

    }
    if (password !== password_confirmation) {
      return showMessage({
        message: 'Erreur',
        description: "Les mots de passe ne correspondent pas ",
        type: 'danger',
        icon: 'danger',
      });
    }
    if (token.length === 0) {
      return showMessage({
        message: 'Erreur',
        description: "Veuillez renseigner un token. ",
        type: 'danger',
        icon: 'danger',
      });

    }
    try {
      await api('POST', '/update-password-by-token', body);
      navigation.navigate('Login');
      return showMessage({
        message: 'Succès',
        description: "Votre mot de passe à été réinitialisé avec succès.",
        type: 'success',
        icon: 'success',
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ScrollView>
      <View  style={tailwind('w-full flex items-center mt-12')}>
        <Text>Réinitialiser votre mot de passe</Text>
        <Input label={"Token"} value={token} onChange={text => setToken(text)} />
        <Input label={"Nouveau mot de passe"} value={password} onChange={text => setPassword(text)} placeholder={"*****"} secureTextEntry={true} />
        <Input label={"Confirmer mot de passe"} value={password_confirmation} onChange={text => setPasswordConfirm(text)} placeholder={"*****"} secureTextEntry={true} />

      <View  style={tailwind('mt-12')}>
      <TouchableHighlight
          style={tailwind('bg-indigo-800 p-4 rounded')}
          onPress={onPress}>
          <Text style={tailwind('text-white font-bold text-center text-lg')}>
            {' '}
            Envoyer{' '}
          </Text>
        </TouchableHighlight>
      </View>
      </View>
    </ScrollView>
  );
};

export default NewPassword;
