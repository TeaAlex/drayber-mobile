import {API_URL} from 'react-native-dotenv'
import AsyncStorage from '@react-native-community/async-storage';

import {showMessage, hideMessage} from 'react-native-flash-message';

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

    if(response.ok === true && response.status >= 200 && response.status < 300) {
      const responseJSON = await response.json();
      return responseJSON;
    } else {
        let error = await response.text();
        error = JSON.parse(error);
        console.log(error.message);
        return showMessage({
          message: 'Erreur',
          description: error.message,
          type: 'danger',
          icon: 'danger',
      });    
    }
  } catch (e) {
    console.error(e)
  }

}

export {api}
