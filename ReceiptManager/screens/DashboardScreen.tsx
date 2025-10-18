import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { API_URL } from '../config';

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Dashboard: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function DashboardScreen() {
  const navigation = useNavigation<NavigationProp>();

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'GET',
        credentials: 'include',
      });
      navigation.replace('Login');  // Replace to prevent going back after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Receipt Manager!</Text>
      <Text style={styles.subtitle}>You're successfully logged in</Text>
      
      <View style={styles.buttonContainer}>
        <Button title="Logout" onPress={handleLogout} color="#ff6b6b" />
      </View>
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
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
});

