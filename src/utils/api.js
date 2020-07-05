import {API_URL} from 'react-native-dotenv'
import AsyncStorage from '@react-native-community/async-storage';

const api = async (method, url, body) => {

  const headers = {
    'Content-Type': 'application/json'
  }

  try {
    const token = await AsyncStorage.getItem('token');
    if (token !== null) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    console.error(e)
  }

  const options = {
    method,
    headers
  }

  if (body) {
    options['body'] = JSON.stringify(body)
  }

  try {
    const response = await fetch(`${API_URL}${url}`, options);
    return await response.json();
  } catch (e) {
    console.error(e)
  }

}

export {api}
