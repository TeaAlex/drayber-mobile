import React, {useContext, useState} from 'react';
import tailwind from 'tailwind-rn';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  TouchableHighlight,
  Button,
  ScrollView,
} from 'react-native';
import {UserContext} from '../context/UserContext';
import {api} from '../utils/api';
import {showMessage, hideMessage} from 'react-native-flash-message';


const NewPassword = ({navigation}) => {
  const {user} = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [password_confirmation, setPasswordConfirm] = useState('');

  const onPress = async () => {
    const body = {
      password: password,
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
      await api('PUT', '/update-password', body);
      navigation.navigate('Login');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ScrollView>
      <View style={styles.backgroundContainer}>
        <Text>Réinitialiser votre mot de passe</Text>
        <View style={styles.container}>
          <Text>Token</Text>
          <TextInput
            style={tailwind(
              'w-full bg-white border-2 border-gray-400 p-3 rounded text-gray-700 font-bold',
            )}
            value={token}
            secureTextEntry={true}
            onChangeText={text => setToken(text)}
          />
        </View>
        <View style={styles.container}>
          <Text>Nouveau mot de passe</Text>
          <TextInput
            style={tailwind(
              'w-full bg-white border-2 border-gray-400 p-3 rounded text-gray-700 font-bold',
            )}
            value={password}
            secureTextEntry={true}
            onChangeText={text => setPassword(text)}
          />
        </View>
        <View style={styles.container}>
          <Text>Confirmer mot de passe</Text>
          <TextInput
            style={tailwind(
              'w-full bg-white border-2 border-gray-400 p-3 rounded text-gray-700 font-bold',
            )}
            value={password_confirmation}
            secureTextEntry={true}
            onChangeText={text => setPasswordConfirm(text)}
          />
        </View>
        <TouchableHighlight
          style={tailwind('bg-indigo-800 p-4 rounded')}
          onPress={onPress}>
          <Text style={tailwind('text-white font-bold text-center text-lg')}>
            {' '}
            Envoyer{' '}
          </Text>
        </TouchableHighlight>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
    paddingTop: 10,
  },
  backgroundContainer: {
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NewPassword;