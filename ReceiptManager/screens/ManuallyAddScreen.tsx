import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';



export default function ManuallyAddScreen() {

  const [merchant, setMerchant] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manual Entry</Text>
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
      placeholder="Purchase Date"
      keyboardType="numeric"
      value={purchaseDate}
      onChangeText={setPurchaseDate}
      />


      <Button title="Save Receipt" onPress={() => console.log('Submit pressed')}/>
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
