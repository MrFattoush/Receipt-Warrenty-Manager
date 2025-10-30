import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../config';


type RootStackParamList = {
  ManuallyAddScreen: undefined;
  Dashboard: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function ManuallyAddScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [merchant, setMerchant] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSaveReceipt = async () => {
    setErrorMessage('');

    if (!merchant){
      setErrorMessage('please enter merchant');
      return;
    }
    if (!totalAmount){
      setErrorMessage('please enter amount');
      return;
    }
    if (!purchaseDate){
      setErrorMessage('please enter purchase date');
      return;
    }


    try {
      const response = await fetch(`${API_URL}/add-receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',  // for session cookies
        body: JSON.stringify({merchant, totalAmount, purchaseDate}),
      });

      if (response.ok) {
        console.log('Received Receipt Data Successfully!');
        navigation.replace('Dashboard');  // Replace instead of navigate to prevent going back
      } else {
        const data = await response.json();         // frontend sees it as JSON instead of text
        setErrorMessage(data.message || data || 'Receipt Data Receival Failed. Try Again');
      }
    } catch (error) {
      console.error('Error connecting to backend:', error);
      setErrorMessage('Cannot connect to server.');
    }

  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manual Entry</Text>
      {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
      <TextInput
      style={styles.input}
      placeholder="Merchant Name"
      value={merchant}
      onChangeText={setMerchant}
      />

      <TextInput
      style={styles.input}
      placeholder="Total Amount"
      keyboardType="decimal-pad"
      value={totalAmount}
      onChangeText={setTotalAmount}
      />

      <TextInput
      style={styles.input}
      placeholder="MM/DD/YYYY"
      keyboardType="numeric"
      value={purchaseDate}
      onChangeText={(text) => {
      // Remove non-numeric characters
      let cleaned = text.replace(/\D/g, '');

      // Automatically add slashes as user types
      if (cleaned.length > 4) {
      cleaned = cleaned.slice(0, 8);
      const formatted = cleaned.replace(/^(\d{2})(\d{2})(\d{0,4}).*/, '$1/$2/$3');
      setPurchaseDate(formatted);
      } else if (cleaned.length > 2) {
      const formatted = cleaned.replace(/^(\d{2})(\d{0,2})/, '$1/$2');
      setPurchaseDate(formatted);
      } else {
      setPurchaseDate(cleaned);
      }
    }}
  maxLength={10}
/>


      <Button title="Save Receipt" onPress={handleSaveReceipt}/>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 12 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 12 },
  passwordInput: { flex: 1, padding: 10 },
  showHideButton: { paddingHorizontal: 10 },
});
