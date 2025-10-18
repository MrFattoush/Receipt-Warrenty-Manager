import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { API_URL } from '../config';

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Dashboard: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    setErrorMessage('');
    
    if (!username){
      setErrorMessage('Please enter your username');
      return;
    }
    if (!password){
      setErrorMessage('Please enter your password');
      return;
    }


    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',  // for session cookies
        body: JSON.stringify({ username: username, password }),
      });

      if (response.ok) {
        console.log('Login successful');
        navigation.replace('Dashboard');  // Replace instead of navigate to prevent going back
      } else {
        const data = await response.json();         // frontend sees it as JSON instead of text
        setErrorMessage(data.message || data || 'Login failed. Check credentials.');
      }
    } catch (error) {
      console.error('Error connecting to backend:', error);
      setErrorMessage('Cannot connect to server.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Please enter your username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Please enter your password"
          secureTextEntry={hidePassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setHidePassword(!hidePassword)} style={styles.showHideButton}>
          <Text>{hidePassword ? 'Show' : 'Hide'}</Text>
        </TouchableOpacity>
      </View>

      <Button title="Enter" onPress={handleLogin} />

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={{ color: 'blue', textAlign: 'center', marginTop: 10 }}>Don’t have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

// TO DO: PAGE NEEDS TO LOOK COOL
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, alignSelf: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 12 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 12 },
  passwordInput: { flex: 1, padding: 10 },
  showHideButton: { paddingHorizontal: 10 },
});
