import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ScanReceiptScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Receipt</Text>
      <Text style={styles.subtitle}>Camera functionality will be added here</Text>
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
});
