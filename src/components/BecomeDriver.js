import React, {useState, useContext} from 'react'
import {View, TextInput, Button, Text, StyleSheet,Image,TouchableOpacity } from "react-native";
import {api} from "../utils/api";
import ImagePicker from 'react-native-image-picker'

import moment from "moment";
import {UserContext} from '../context/UserContext';

const BecomeDriver = ({navigation}) => {
    const [iban, setIban] = useState('');
    const [bic, setBic] = useState('');
    const [driving_licence_path, setDriving_licence_path] = useState(null);
    const [base64Image, setBase64Image]=useState(null)

    const {user,setUser} = useContext(UserContext);

    const handleChoosePhoto = () => {
        const options = {
          mediaType: 'photo',
    
        }
        ImagePicker.launchImageLibrary(options, (response) => {
          if (response.data) {
            const fileName = response.fileName.split(' ').join('_');
            const currentTime = moment().format('X');
            const source = {
              name: user.user.email+"-"+currentTime+"-"+fileName,
              data: response.data
               
            };
            setDriving_licence_path(source);
            setBase64Image(source.data);
          }
        })
      }

    const onPress = async () => {
        const body = {
            "iban": iban,
            "bic": bic,
            "driving_licence_path":driving_licence_path.name
        }

        if(iban.length === 0 ||
            driving_licence_path.length === 0 ||
            bic.length === 0){

            return alert("Tout les champs doivent être renseigner");
        }
        console.log(body);
        try {
            await api('POST', '/users/create-driver', body);
            const user = await api('GET', '/users/current-user');
            await api('POST', '/upload', driving_licence_path);
            setUser(user);

        } catch (e) {
            console.error(e);
        }
        alert("La demande a été prise en compte, votre demande est en attente de validation")
        navigation.navigate('Home');
    }

    return (
            <View style={styles.backgroundContainer}>
                <View style={styles.container}>
                    <Text>IBAN</Text>
                    <TextInput
                        style={styles.input}
                        style={styles.input}
                        value={iban}
                        onChangeText={text => setIban(text)}
                        maxLength={34}
                    />
                </View>
                <View style={styles.container}>
                    <Text>BIC</Text>
                    <TextInput
                        style={styles.input}
                        value={bic}
                        keyboardType='numeric'
                        onChangeText={text => setBic(text)}
                        maxLength={11}
                    />
                </View>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    {driving_licence_path && (<Image source={{ uri: `data:image/jpeg;base64,${base64Image}` }} style={{ width: 150, height: 150 }}/>)}

                    <Button
                        mode="contained"
                        onPress={() => handleChoosePhoto()}
                        title="Recto du Permis de conduire"
                    />
                </View>
               <View style={styles.bottom}>
               <TouchableOpacity onPress={onPress}>
                <Text style={styles.button}>Devenir chauffeur</Text>
               </TouchableOpacity>
                </View>

            </View>
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
        alignItems: 'center',
    },
    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
      },
      button: {
        backgroundColor:'#5E2B97',
        padding:20,
        borderRadius:20,
        alignItems:"center",
        textTransform:"uppercase",
        borderColor:"black",
        color:"white",
        fontWeight:"bold"
      }
});

export default BecomeDriver;
