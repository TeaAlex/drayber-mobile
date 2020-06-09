import React from 'react'
import MapView , {PROVIDER_GOOGLE} from "react-native-maps";
import {View, StyleSheet, Dimensions} from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
})

const Map = () => {
  return (
    <View>
      <MapView
        style={styles.mapStyle}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 48.8566,
          longitude: 2.3522,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    </View>
  )
}

export default Map
