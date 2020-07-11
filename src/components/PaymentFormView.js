import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {CreditCardInput} from 'react-native-credit-card-input';
import {UserContext} from '../context/UserContext';

/**
 * Renders the payment form and handles the credit card data
 * using the CreditCardInput component.
 */


const PaymentFormView = ({navigation}) => {

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
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Ajouter" />
        </View>
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

