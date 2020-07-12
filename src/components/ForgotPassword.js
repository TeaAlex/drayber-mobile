import React, {useContext, useState} from 'react';
import tailwind from 'tailwind-rn';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import {UserContext} from '../context/UserContext';
import {api} from '../utils/api';
import {showMessage, hideMessage} from 'react-native-flash-message';
import Input from './Input';
import Button from './Button';
import {ScrollView} from 'react-native-gesture-handler';

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
      return showMessage({
        message: 'Erreur',
        description: 'Votre email est invalide.',
        type: 'danger',
        icon: 'danger',
      });
    }
    try {
      await api('POST', '/forgot-password', body);
      navigation.navigate('Login');
      return showMessage({
        message: 'Succès',
        description:
          'Vous allez recevoir un courriel vous permettant de réinitialiser votre mot de passe.',
        type: 'success',
        icon: 'success',
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ScrollView>
      <View style={tailwind('w-full flex items-center mt-12')}>
        <Input
          label={'Email'}
          value={email}
          onChange={setEmail}
          placeholder={'email@email.com'}
        />
        <Button title="Envoyer" onPress={onPress} />
      </View>
    </ScrollView>
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
