import React, {useContext, useState, useEffect} from 'react';
import { UserContext } from "../context/UserContext";
import AsyncStorage from "@react-native-community/async-storage";
import { Button, Text, View } from "react-native";
import FirebaseNotifHandler from "./FirebaseNotifHandler";

function HomeScreen({ navigation }) {

  const {user} = useContext(UserContext);

  const [mode, setMode] = useState('');

  useEffect(() => {
    async function getMode() {
      setMode(await AsyncStorage.getItem('changeMode'));
    }

    getMode();
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
      <Text> Mode {mode}</Text>
      <Text>Bonjour {user.user.firstname}</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
      <Button
        title="Go to Map"
        onPress={() => navigation.navigate('Map')}
      />
      <Button
        title="Go to Search"
        onPress={() => navigation.navigate('Search')}
      />
      <Button
        title="Go to Menu"
        onPress={() => navigation.navigate('Menu')}
      />
      <FirebaseNotifHandler/>
    </View>
  );
}

export default HomeScreen
