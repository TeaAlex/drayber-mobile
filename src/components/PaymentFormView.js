import React, {useContext, useState, useEffect} from 'react';
import CreditCardSvg from '../assets/icons/credit-card-outline.svg';
import tailwind from 'tailwind-rn';
import {StyleSheet, Text, View, Button, TouchableHighlight, Alert} from 'react-native';
import MenuItem from './MenuItem';
import {CreditCardInput} from 'react-native-credit-card-input';
import {UserContext} from '../context/UserContext';
import {api} from "../utils/api";
import { YOUR_STRIPE_PUBLIC_KEY, YOUR_STRIPE_PRIVATE_KEY } from 'react-native-dotenv';
import { showMessage } from 'react-native-flash-message';

//import stripe from 'tipsi-stripe';

/*stripe.setOptions({
  publishableKey: YOUR_STRIPE_PUBLIC_KEY,
});*/

/**
 * Renders the payment form and handles the credit card data
 * using the CreditCardInput component.
 */

const PaymentFormView = ({navigation}) => {
  const color = '#586CD9';
  const {user,setUser} = useContext(UserContext);
  const [card, setCard] = useState(user.card);
  const loggeduser = user.user;
  
  const handleChange = (form) => {
    console.log(form.values);
    setCard(form.values);
  }

  const saveCard = async () => {
    console.log("SaveCard");
    console.log(card);
    console.log(loggeduser);
    console.log("HASN'T STRIPE ID",(loggeduser.client_stripe_id == null));
    if(loggeduser.client_stripe_id == null){
      //create customer for current user
      const create_customer = await api('POST', '/payment/create-stripe-customer');

      if(create_customer.status == "Created"){
        loggeduser.client_stripe_id = create_customer.user.client_stripe_id;
        loggeduser.client_secret = create_customer.user.client_stripe_secret;
      }
      //prepare to get payment method
      console.log(create_customer);
    }

    const params = { 
      'type': 'card',
      'card[number]': card.number,
      'card[exp_month]': card.expiry.split('/')[0],
      'card[exp_year]': card.expiry.split('/')[1],
      'card[cvc]': card.cvc,
    };
    try{
      // SAVE CARD ON STRIPE
      const result = await fetch('https://api.stripe.com/v1/payment_methods', {
        headers: {
          // Use the correct MIME type for your server
          Accept: 'application/json',
          // Use the correct Content Type to send data in request body
          'Content-Type': 'application/x-www-form-urlencoded',
          // Use the Stripe publishable key as Bearer
          Authorization: `Bearer ${YOUR_STRIPE_PUBLIC_KEY}`,
        },
    
        // Use a proper HTTP method
        method: 'post',
        // Format the credit card data to a string of key-value pairs
        // divided by &
        body: Object.keys(params)
          .map(key => key + '=' + params[key])
          .join('&'),
      }).then(response => response.json());
      console.log("CB Result : ",result);
      
      if(!result.error){
        const pm_id = result.id;
  
        // ATTACH CARD TO CURRENT USER
        console.log("LOGGED USER : ",loggeduser.client_stripe_id);
        const param2 = {
          'customer': loggeduser.client_stripe_id
        };
        const attach_card = await fetch('https://api.stripe.com/v1/payment_methods/'+pm_id+'/attach', {
          headers: {
            // Use the correct MIME type for your server
            Accept: 'application/json',
            // Use the correct Content Type to send data in request body
            'Content-Type': 'application/x-www-form-urlencoded',
            // Use the Stripe publishable key as Bearer
            Authorization: `Bearer ${YOUR_STRIPE_PRIVATE_KEY}`,
          },
      
          // Use a proper HTTP method
          method: 'post',
          // Format the credit card data to a string of key-value pairs
          // divided by &
          body: Object.keys(param2)
            .map(key => key + '=' + param2[key])
            .join('&'),
        }).then(response => response.json());
        console.log("ATTACH Result : ",attach_card);

        if(!attach_card.error){
          // SEND PAYMENT_METHOD TO API TO SAVE IT
          const pm_save_on_api = await api('POST', '/payment/save-payment-customer', {
            'payment_method_id': pm_id
          });
          if(pm_save_on_api.status == "Success"){
            user.user.client_stripe_payment_method = pm_id;
            setUser(user);
            navigation.navigate('Menu');
            return showMessage({
              message: 'Succès',
              description: 'Votre carte bancaire à bien été enregistrée',
              type: 'success',
              icon: 'success',
            });
          } else {
            return showMessage({
              message: 'Erreur',
              description: pm_save_on_api.message,
              type: 'danger',
              icon: 'danger',
            });
          }
        } else {
          return showMessage({
            message: 'Erreur',
            description: 'Une erreur est sûrvenue lors de l\'enregistement de la carte, merci de réessayer ultérieurement.',
            type: 'danger',
            icon: 'danger',
          });
        }
      } else {
        return showMessage({
          message: 'Erreur',
          description: 'Une erreur est sûrvenue lors de l\'enregistement de la carte, merci de réessayer ultérieurement.',
          type: 'danger',
          icon: 'danger',
        });
      }
    }catch(e){
      console.log("ERROR CB/ATTACH : ",e);
      return showMessage({
        message: 'Erreur',
        description: 'Une erreur est sûrvenue lors de l\'enregistement de la carte, merci de réessayer ultérieurement.',
        type: 'danger',
        icon: 'danger',
      });
    }
  }

  const verif_before_drop = () => {
    Alert.alert(
      "Voulez-vous supprimer la carte ?",
      "Supprimer la carte",
      [
        {
          text: "Non",
          onPress: () => console.log("Annulation de la suppression"),
          style: "cancel"
        },
        { text: "OK", onPress: () => dropCard() }
      ],
      { cancelable: true }
    );
  }

  const dropCard = async () => {
    const detach_card = await fetch('https://api.stripe.com/v1/payment_methods/'+loggeduser.client_stripe_payment_method+'/detach', {
      headers: {
        // Use the correct MIME type for your server
        Accept: 'application/json',
        // Use the correct Content Type to send data in request body
        'Content-Type': 'application/x-www-form-urlencoded',
        // Use the Stripe publishable key as Bearer
        Authorization: `Bearer ${YOUR_STRIPE_PRIVATE_KEY}`,
      },
      // Use a proper HTTP method
      method: 'post',
    }).then(response => response.json());
    console.log("DROP CARD Result : ",detach_card);
    if(!detach_card.error){
      const res_detach = await api("PUT","/users/update/",{
        'client_stripe_payment_method': null
      });
      const current_user = user;
      current_user.user.client_stripe_payment_method = null;
      setUser(current_user);
      if(res_detach.status == "Success"){
        navigation.navigate('Menu');
        return showMessage({
          message: 'Succès',
          description: 'La carte à été supprimé avec succès',
          type: 'success',
          icon: 'success',
        });
      } else {
        console.log("ERROR CB/DETACH : ",res_detach.message);
        return showMessage({
          message: 'Erreur',
          description: res_detach.message,
          type: 'danger',
          icon: 'danger',
        });
      }
    } else {
      console.log("ERROR CB/DETACH : ",e);
      return showMessage({
        message: 'Erreur',
        description: 'Une erreur est sûrvenue lors de la suppression de la carte, merci de réessayer ultérieurement.',
        type: 'danger',
        icon: 'danger',
      });
    }
  }

  useEffect(() => {
    const load_card = async () => {
      try {
        if(loggeduser.client_stripe_payment_method != null){
          //get CARD details
          const card_getted = await fetch('https://api.stripe.com/v1/payment_methods/'+loggeduser.client_stripe_payment_method, {
            headers: {
              // Use the correct MIME type for your server
              Accept: 'application/json',
              // Use the correct Content Type to send data in request body
              'Content-Type': 'application/x-www-form-urlencoded',
              // Use the Stripe publishable key as Bearer
              Authorization: `Bearer ${YOUR_STRIPE_PRIVATE_KEY}`,
            },
            // Use a proper HTTP method
            method: 'GET',
          }).then(response => response.json());
    
          if(!card_getted.error){
            setCard(card_getted.card)
          } else {
            showMessage({
              message: 'Erreur',
              description: 'Impossible de récupérer les modes de paiement.',
              type: 'danger',
              icon: 'danger',
            });
          }
        }
      } catch (e) {
          console.error("ERROR ON GETTING CARDS",e);
      }
    };
    load_card();
  }, []);

  if(loggeduser.client_stripe_payment_method == null){
    return (
      <View>
        <View>
          <CreditCardInput
              autoFocus
              requiresName
              requireCVC={true}
              requirePostalCode={true}
              validColor="black"
              invalidColor="red"
              placeholderColor="darkgray"
              labelStyle={{color: 'black', fontSize: 13}}
              inputStyle={{color: 'black', fontSize: 16}}
              onChange={handleChange}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button onPress={saveCard} title="Ajouter" />
        </View>
      </View>
    );
  } else {
    
    return (
      <View>
        {
          card && <View style={tailwind('bg-gray-100 h-full items-center w-full')}>
            <View style={tailwind('bg-blue-500 w-full')}>
              <TouchableHighlight onPress={verif_before_drop}>
                <MenuItem text={card.brand.toUpperCase() + " xxxx" + card .last4}>
                  <CreditCardSvg width={24} height={24} fill={color} />
                </MenuItem>
              </TouchableHighlight>
            </View>
          </View>
        }
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  buttonWrapper: {
    padding: 10,
    zIndex: 100,
  },
  alertTextWrapper: {
    flex: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertIconWrapper: {
    padding: 5,
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertText: {
    color: '#c22',
    fontSize: 16,
    fontWeight: '400',
  },
  alertWrapper: {
    backgroundColor: '#ecb7b7',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 5,
    paddingVertical: 5,
    marginTop: 10,
  },
});

export default PaymentFormView;

