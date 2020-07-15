
import React from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Map from "./src/components/Map";
import Search from "./src/components/Search";
import SearchProvider from "./src/context/SearchContext";
import Menu from "./src/components/Menu";
import Login from "./src/components/Login";
import {getColor} from 'tailwind-rn';
import UserProvider from "./src/context/UserContext";
import Register from './src/components/Register';
import Profile from './src/components/Profile';
import ProfileUpdate from './src/components/ProfileUpdate';
import BecomeDriver from './src/components/BecomeDriver';
import AdminMenu from './src/components/AdminMenu';
import DriverValidation from './src/components/DriverValidation';
import ValidateAccount from './src/components/ValidateAccount';
import Offer from "./src/components/Offer";
import PaymentFormView from './src/components/PaymentFormView';
import ForgotPassword from './src/components/ForgotPassword';
import NewPassword from './src/components/NewPassword';
import FlashMessage from 'react-native-flash-message';
import Contact from './src/components/Contact';
import TripProvider from "./src/context/TripContext";
import HomeScreen from './src/components/HomeScreen';
import PayDriver from './src/components/PayDriver';
import ValidatePayment from './src/components/ValidatePayment';
import HistoryTrip from './src/components/HistoryTrip';
import TripRecap from "./src/components/TripRecap";


const Stack = createStackNavigator();

function App() {
  return (
    <UserProvider>
      <SearchProvider>
        <TripProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Login"
              screenOptions={{
                headerStyle: {
                  backgroundColor: getColor('indigo-700'),
                },
                headerTintColor: getColor('gray-100'),
              }}
            >
              <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
              <Stack.Screen name="Map" component={Map} options={{headerShown: false}}/>
              <Stack.Screen name="Search" component={Search} options={{title: 'Itinéraire'}}/>
              <Stack.Screen name="Menu" component={Menu} options={{title: 'Menu'}}/>
              <Stack.Screen name="Register" component={Register} options={{title: 'Inscription'}}/>
              <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
              <Stack.Screen name="PaymentFormView" component={PaymentFormView} options={{title: 'Moyen de paiement'}}/>
              <Stack.Screen name="Profile" component={Profile} options={{title: 'Profil'}}/>
              <Stack.Screen name="ProfileUpdate" component={ProfileUpdate} options={{title: 'Modifier mon Profil'}}/>
              <Stack.Screen name="BecomeDriver" component={BecomeDriver} options={{title: 'Devenir chauffeur'}}/>
              <Stack.Screen name="Admin" component={AdminMenu} options={{title: 'Admin'}}/>
              <Stack.Screen name="DriverValidation" component={DriverValidation} options={{title: 'Comptes a valider'}}/>
              <Stack.Screen name="ValidateAccount" component={ValidateAccount} options={{title: 'Validation'}}/>
              <Stack.Screen name="Offer" component={Offer} options={{headerShown: false}}/>
              <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{title: "Mot de passe oublié"}}/>
              <Stack.Screen name="NewPassword" component={NewPassword} options={{title: 'Nouveau mot de passe'}}/>
              <Stack.Screen name="HistoryTrip" component={HistoryTrip} options={{title: 'Historique des courses'}}/>
              <Stack.Screen name="Contact" component={Contact} options={{title: 'Contact'}}/>
              <Stack.Screen name="PayDriver" component={PayDriver} options={{title: 'Virements a effectuer'}}/>
              <Stack.Screen name="ValidatePayment" component={ValidatePayment} options={{title: 'Valider le paiement'}}/>
              <Stack.Screen name="TripRecap" component={TripRecap} options={{title: 'Récapitulatif de la course'}}/>
            </Stack.Navigator>
          </NavigationContainer>
        </TripProvider>
      </SearchProvider>
        <FlashMessage position="bottom" animated={true} />
    </UserProvider>


  );
}

export default App;
