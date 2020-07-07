import React, {useState, useContext} from 'react'
import {View, TextInput, Button, Text, ScrollView, StyleSheet,Image } from "react-native";
import {api} from "../utils/api";
import ImagePicker from 'react-native-image-picker'

const Register = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [phone_number, setPhone_number] = useState('0612345678');
    const [profile_picture_url, setProfilePictureUrl] = useState(null);
    const [address, setAddress] = useState('1 rue de Saint Denis');
    const [zip_code, setZipCode] = useState('75001');
    const [city, setCity] = useState('Paris');
    const [birth_date, setBirthSate] = useState('1990-10-10');
    const [password_confirmation, setPasswordConfirm] = useState('');

    const handleChoosePhoto = () => {
        const options = {
            noData: true,
        };
        ImagePicker.launchImageLibrary(options, response => {
            if (response.uri) {
                setProfilePictureUrl(response);
            }
        });
    };

    const onPress = async () => {
        const body = {
            "email": email,
            "password": password,
            "password_confirmation": password_confirmation,
            "firstname": firstname,
            "lastname": lastname,
            "phone_number":phone_number,
            "address": address,
            "zip_code": zip_code,
            "city": city,
            "birth_date": birth_date
        }

        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if(!re.test(email) || email.length === 0 ){
            return alert("Votre email est invalide");
        }
        if(password.length === 0 ||
            password_confirmation.length === 0 ||
            firstname.length === 0 ||
            phone_number.length === 0 ||
            address.length === 0 ||
            zip_code.length === 0 ||
            city.length === 0 ||
            birth_date.length === 0){

            return alert("Tout les champs doivent être renseigner");
        }

        if(password !== password_confirmation){
            return alert("Les deux mots de passe ne correspondent pas");
        }

        try {
            await api('POST', '/register', body);

            navigation.navigate('Login');
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <ScrollView>
            <View style={styles.backgroundContainer}>
                <View style={styles.container}>
                    <Text>Email</Text>
                    <TextInput
                        style={styles.input}
                        style={styles.input}
                        value={email}
                        onChangeText={text => setEmail(text)}
                    />
                </View>
                <View style={styles.container}>
                    <Text>Prénom</Text>
                    <TextInput
                        style={styles.input}
                        value={firstname}
                        onChangeText={text => setFirstname(text)}
                    />
                </View>
                <View style={styles.container}>
                    <Text>Nom</Text>
                    <TextInput
                        style={styles.input}
                        value={lastname}
                        onChangeText={text => setLastname(text)}
                    />
                </View>
                <View style={styles.container}>
                    <Text>Téléphone</Text>
                    <TextInput
                        style={styles.input}
                        value={phone_number}
                        keyboardType='numeric'
                        onChangeText={text => setPhone_number(text)}
                    />
                </View>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    {profile_picture_url && (
                        <Image
                            source={{uri: profile_picture_url.uri}}
                            style={{width: 150, height: 150}}
                        />
                    )}

                    <Button
                        mode="contained"
                        onPress={() => handleChoosePhoto()}
                        title="Choisissez une photo"
                    />
                </View>
                <View style={styles.container}>
                    <Text>Adresse</Text>
                    <TextInput
                        style={styles.input}
                        value={address}
                        onChangeText={text => setAddress(text)}
                    />
                </View>
                <View style={styles.container}>
                    <Text>Code postal</Text>
                    <TextInput
                        style={styles.input}
                        value={zip_code}
                        keyboardType='numeric'
                        onChangeText={text => setZipCode(text)}
                    />
                </View>
                <View style={styles.container}>
                    <Text>Ville</Text>
                    <TextInput
                        style={styles.input}
                        value={city}
                        onChangeText={text => setCity(text)}
                    />
                </View>
                <View style={styles.container}>
                    <Text>Date de naissance</Text>
                    <TextInput
                        style={styles.input}
                        value={birth_date}
                        onChangeText={text => setBirthSate(text)}
                    />
                    {/* <Button onPress={showDatepicker} title="Show date picker!" />
        {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={(date) => setBirthSate(date)}
        />
      )} */}
                </View>
                <View style={styles.container}>
                    <Text>Mot de passe</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        secureTextEntry={true}
                        onChangeText={text => setPassword(text)}
                    />
                </View>
                <View style={styles.container}>
                    <Text>Confirmer mot de passe</Text>
                    <TextInput
                        style={styles.input}
                        value={password_confirmation}
                        secureTextEntry={true}
                        onChangeText={text => setPasswordConfirm(text)}
                    />
                </View>
                <Button title="S'inscrire" onPress={onPress} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 12,
    },
    input: {
        backgroundColor: 'white',
    },
    error: {
        fontSize: 14,
        color: 'red',
        paddingHorizontal: 4,
        paddingTop: 4,
    },
    backgroundContainer: {
        flex: 1,
        padding: 20,
        width: '100%',
        maxWidth: 340,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Register;
