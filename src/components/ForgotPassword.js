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
} from 'react-native';
import {UserContext} from '../context/UserContext';
import {api} from '../utils/api';

const ForgotPassword = ({navigation}) => {
  const {user} = useContext(UserContext);
  const [email, setEmail] = useState('');

  const onPress = async () => {
    const body = {
      uid: email,
    };
    console.log(body);

    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!re.test(email) || email.length === 0) {
      return alert('Votre email est invalide');
    }
    try {
      await api('POST', '/forgot-password', body);
      navigation.navigate('Login');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.backgroundContainer}>
      <Text>Réinitialiser votre mot de passe</Text>
      <View style={styles.container}>
        <TextInput
          style={tailwind(
            'w-full bg-white border-2 border-gray-400 p-3 rounded text-gray-700 font-bold',
          )}
          label="E-mail address"
          returnKeyType="done"
          value={email}
          onChangeText={text => setEmail(text)}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
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
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
  backgroundContainer: {
    padding: 20,
    paddingTop: 200,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ForgotPassword;
