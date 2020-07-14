import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
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

  const getCard = async () => {
    const pm_card_id = user.user.client_stripe_payment_method;
    //get CARD details
    const card_getted = await fetch('https://api.stripe.com/v1/payment_methods/'+pm_card_id, {
      headers: {
        // Use the correct MIME type for your server
        Accept: 'application/json',
        // Use the correct Content Type to send data in request body
        'Content-Type': 'application/x-www-form-urlencoded',
        // Use the Stripe publishable key as Bearer
        Authorization: `Bearer ${YOUR_STRIPE_PUBLIC_KEY}`,
      },
      // Use a proper HTTP method
      method: 'GET',
    }).then(response => response.json());
    console.log("GET CB : ",card_getted);
    if(!card_getted.error){
       return card_getted.card.last4;
    } else {
      showMessage({
        message: 'Erreur',
        description: 'Impossible de récupérer les modes de paiement.',
        type: 'danger',
        icon: 'danger',
      });
    }
  }

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
        <Text>PLOP</Text>
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

