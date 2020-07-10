import {GOOGLE_API_KEY} from "react-native-dotenv";
import polyline from "@mapbox/polyline";

export const directionAPI = async (from, to) => {

  if (typeof from === 'object') {
    const {lat, lon} = from;
    from = `${lat},${lon}`;
  }

  if (typeof to === 'object') {
    const {lat, lon} = to;
    to = `${lat},${lon}`;
  }

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${from}&destination=${to}&key=${GOOGLE_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  const points = polyline.decode(data.routes[0].overview_polyline.points);
  const coords = points.map(point => {
    const [latitude, longitude] = point;
    return { latitude,longitude }
  })
  const leg = data.routes[0].legs[0];
  return {
    leg,
    coords
  }
}

export const geoCoding = async (coords) => {
  const {lat, lon} = coords;
  const latLng = `${lat},${lon}`;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLng}&key=${GOOGLE_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
}
