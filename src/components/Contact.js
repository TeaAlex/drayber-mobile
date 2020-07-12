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
  Picker
} from 'react-native';
import {UserContext} from '../context/UserContext';
import {api} from '../utils/api';
import {showMessage, hideMessage} from 'react-native-flash-message';


const Contact = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [selectedValue, setSelectedValue] = useState("Trajet");

  const onPress = async () => {
    // const body = {
    //   password: password,
    //   token: token,
    // };
    // console.log(body);


    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if(!re.test(email) || email.length === 0 ){
            return showMessage({
                message: 'Erreur',
                description: 'Votre email est invalide.',
                type: 'danger',
                icon: 'danger',
              });
        }
        if (description.length === 0) {
          return showMessage({
            message: 'Erreur',
            description: "Veuillez renseigner une description. ",
            type: 'danger',
            icon: 'danger',
          });
    
        }
    // try {
    //   await api('PUT', '/update-password', body);
    //   navigation.navigate('Login');
    // } catch (e) {
    //   console.error(e);
    // }
  };

  return (
    <ScrollView>
      <View style={styles.backgroundContainer}>
        <Text>Besoin d'aide? Contactez nous en remplissant ce formulaire.</Text>
        <View style={styles.container}>
          <Text>Email</Text>
          <TextInput
            style={tailwind(
              'w-full bg-white border-2 border-gray-400 p-3 mt-2 rounded text-gray-700 font-bold',
            )}
            value={email}
            onChangeText={text => setEmail(text)}
          />
        </View>
        <View style={styles.container}>
          <Text>Categorie</Text>
          <Picker
              selectedValue={selectedValue}
              style={tailwind(
                'w-full bg-white border-2 border-gray-400 p-3 mt-2 rounded text-gray-700 font-bold',
              )}
            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}>
            <Picker.Item label="Trajet" value="trip" />
            <Picker.Item label="Paiement" value="payment" />
            <Picker.Item label="Compte" value="account" />
            <Picker.Item label="Problème avec un client/driver" value="problem" />
            <Picker.Item label="Autre" value="other" />
          </Picker>
        </View>
        <View style={styles.container}>
          <Text>Description</Text>
          <TextInput
            style={tailwind(
              'w-full bg-white border-2 border-gray-400 h-40 p-3 mt-2 rounded text-gray-700 font-bold',
            )}
            multiline={true}
            value={description}
            onChangeText={text => setDescription(text)}
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

export default Contact;
