import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ManuallyAddScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manual Entry</Text>
      <Text style={styles.subtitle}>Form fields will be added here</Text>
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
