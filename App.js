import React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Map from "./src/components/Map";
import Search from "./src/components/Search";
import SearchProvider from "./src/context/SearchContext";
import Menu from "./src/components/Menu";
import Login from "./src/components/Login";
import {getColor} from 'tailwind-rn';
import WS from "./src/components/WS";
import UserProvider from "./src/context/UserContext";
import Register from './src/components/Register';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
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
      {/*<Button*/}
      {/*  title="WS"*/}
      {/*  onPress={() => navigation.navigate('WS')}*/}
      {/*/>*/}
    </View>
  );
}

function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <UserProvider>
      <SearchProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerStyle: {
                backgroundColor: getColor('indigo-500'),
              },
              headerTintColor: getColor('gray-100'),
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil'}} />
            <Stack.Screen name="Details" component={DetailsScreen} />
            <Stack.Screen name="Map" component={Map} options={{ headerShown: false }} />
            <Stack.Screen name="Search" component={Search} options={{ title: 'Itinéraire'}}/>
            <Stack.Screen name="Menu"  component={Menu} options={{ title: 'Paramètres'}} />
            <Stack.Screen name="Register"  component={Register} options={{ title: 'Inscription'}} />
            <Stack.Screen name="WS"  component={WS} options={{ title: 'WS'}} />
            <Stack.Screen name="Login"  component={Login} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </SearchProvider>
    </UserProvider>

  );
}

export default App;
