import React, {useState, useContext} from 'react'
import {View, TextInput, Text, StyleSheet,Image,TouchableOpacity } from "react-native";
import {api} from "../utils/api";
import ImagePicker from 'react-native-image-picker'

import moment from "moment";
import {UserContext} from '../context/UserContext';
import {showMessage, hideMessage} from 'react-native-flash-message';
import Input from "./Input";
import Button from './Button'
import tailwind from 'tailwind-rn'
import { ScrollView } from 'react-native-gesture-handler';

const BecomeDriver = ({navigation}) => {
    const [iban, setIban] = useState('');
    const [bic, setBic] = useState('');
    const [driving_licence_path, setDriving_licence_path] = useState(null);
    const [base64Image, setBase64Image]=useState(null)

    const {user,setUser} = useContext(UserContext);

    const handleChoosePhoto = () => {
        const options = {
            mediaType: 'photo',
            quality:1, 
            maxWidth: 1280,
            maxHeight: 720
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

                return showMessage({
                    message: 'Erreur',
                    description: 'Tout les champs doivent être renseigner.',
                    type: 'danger',
                    icon: 'danger',
                  });
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
        showMessage({
            message: 'Succées',
            description: 'La demande a été prise en compte, votre demande est en attente de validation.',
            type: 'success',
            icon: 'success',
          });
        navigation.navigate('Home');
    }

    return (
        <ScrollView>
            <View style={tailwind('w-full flex items-center mt-12')}>
                <Input label={"IBAN"} value={iban} onChange={setIban} maxLength={34}/>
                <Input label={"BIC"} value={bic} onChange={setBic} maxLength={11}/>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    {driving_licence_path && (<Image source={{ uri: `data:image/jpeg;base64,${base64Image}` }} style={{ width: 150, height: 150 }}/>)}

                    <Button
                        mode="contained"
                        onPress={() => handleChoosePhoto()}
                        title="Recto du Permis de conduire"
                    />
                </View>
                <Button title="Devenir chauffeur" onPress={onPress} />
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
        alignItems: 'center',
    },
    
});

export default BecomeDriver;
