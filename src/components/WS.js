import React, {useEffect, useContext} from 'react'
import SocketIOClient from "socket.io-client";
import {Button, Text, View} from "react-native";
import {API_URL} from 'react-native-dotenv';
import {UserContext} from "../context/UserContext";

function WS() {

  const {user} = useContext(UserContext);
  const position = {

  };
  const socket = SocketIOClient(API_URL);

  useEffect(() => {
    socket.on('news', (data) => {
      console.log(data);
    })
  })

  const onPress = () => {
    socket.emit('press', {
      id: user.id
    });
  }

  return (
    <View>
      <Text>TEST WS</Text>
      <Text>{JSON.stringify(user)}</Text>
      <Button onPress={onPress} title="SEND TO SERVER"/>
    </View>
  )
}

export default WS
