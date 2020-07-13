import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {CreditCardInput} from 'react-native-credit-card-input';
import {UserContext} from '../context/UserContext';
import {api} from "../utils/api";
import { YOUR_STRIPE_PUBLIC_KEY } from 'react-native-dotenv';
//import stripe from 'tipsi-stripe';

/*stripe.setOptions({
  publishableKey: YOUR_STRIPE_PUBLIC_KEY,
});*/

/**
 * Renders the payment form and handles the credit card data
 * using the CreditCardInput component.
 */


const PaymentFormView = async ({navigation}) => {
  var formdata = null;

  const {user} = useContext(UserContext);
  const loggeduser = user.user;

  const saveCard = async () => {
    const result = await stripe.confirmCardSetup(loggeduser.client_secret, {
      payment_method: {
        card: formdata.values,
        billing_details: {
          name: loggeduser.firstname + ' ' + loggeduser.lastname,
        },
      }
    });
  }

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
/*
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
              onChange={(data) => formdata = data}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button onClick={() => saveCard()} title="Ajouter" />
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
*/
  return (
    <View>
      <Text>PLOP</Text>
    </View>
  );
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

