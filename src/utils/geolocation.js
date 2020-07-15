import Geolocation from "@react-native-community/geolocation";
import { PermissionsAndroid } from "react-native";
import { GOOGLE_API_KEY } from "react-native-dotenv";
import polyline from "@mapbox/polyline";

export const getCurrentPosition = new Promise((resolve, reject) => {
  Geolocation.getCurrentPosition(position => {
    const {latitude, longitude} = position.coords;
    resolve({latitude, longitude});
  }, error => {
    reject(error);
  }, {
    enableHighAccuracy: true,
    timeout: 20000
  })
})

export const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Location Permission',
        'message': 'This App needs access to your location ' +
          'so we can know where you are.'
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use locations ")
    } else {
      console.log("Location permission denied")
    }
  } catch (err) {
    console.warn(err)
  }
}

export const search = async (from, to) => {
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${from}&destination=${to}&key=${GOOGLE_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  const encodedPolyline = data.routes[0].overview_polyline.points;
  const points = polyline.decode(encodedPolyline);
  const coords = points.map(point => {
    const [latitude, longitude] = point;
    return { latitude,longitude }
  })
  const leg = data.routes[0].legs[0];
  const tripInfo = {
    distance: leg.distance.text,
    duration: leg.duration.text,
    price: parseInt(leg.distance.text) * 1.5 ? parseInt(leg.distance.text) * 1.5 : 1,
    startAddress: {
      name: leg.start_address,
      coords: {
        latitude: leg.start_location.lat,
        longitude: leg.start_location.lng
      }
    },
    endAddress: {
      name: leg.end_address,
      coords: {
        latitude: leg.end_location.lat,
        longitude: leg.end_location.lng
      }
    },
    coords,
    encodedPolyline
  }
  return {
    from: leg.start_address,
    to: leg.end_address,
    tripInfo
  }
}

