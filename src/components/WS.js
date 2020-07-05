import React, {useEffect, useContext} from 'react'
import SocketIOClient from "socket.io-client";
import {Button, Text, View} from "react-native";
import {API_URL} from 'react-native-dotenv';
import {UserContext} from "../context/UserContext";
import {api} from "../utils/api";

function WS() {

  const {user} = useContext(UserContext);
  const socket = SocketIOClient(API_URL);

  const onPress = () => {
    socket.emit('press', {
      id: user.id
    });
  }

  const sendNotif = async () => {
    console.log('send notif');
    await api('POST', '/test')
  }

  return (
    <View>
      <Text>TEST WS</Text>
      {/*<Text>{JSON.stringify(user)}</Text>*/}
      <Button onPress={onPress} title="SEND TO WS"/>
      <Button onPress={sendNotif} title="SEND NOTIF"/>
    </View>
  )
}

export default WS
