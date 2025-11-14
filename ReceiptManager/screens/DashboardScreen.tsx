import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { API_URL } from '../config';

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Dashboard: undefined;
  ScanReceipt: undefined;
  ManuallyAdd: undefined;
  ViewReceipts: undefined;
  ViewWarranties: undefined;
  MetadataScreen: { imageUri: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function DashboardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleNewReceipt = () => {
    setModalVisible(true);
  };

  const handleScanReceipt = () => {
    setModalVisible(false);
    navigation.navigate('ScanReceipt');
  };

  const handleManuallyAdd = () => {
    setModalVisible(false);
    navigation.navigate('ManuallyAdd');
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Receipt Manager!</Text>
      <Text style={styles.subtitle}>You're successfully logged in</Text>
      {/* Gives User option to choose between camera upload or manually filling in data */}
      <Button title="New Receipt" onPress={handleNewReceipt} color="#DD27F5" />

      <Button 
        title="View Receipts"  
        onPress={() => navigation.navigate('ViewReceipts')} 
        color="#4B7BE5" 
      />

      <View style={{ height: 10 }} />

      <Button 
        title="View Warranties"  
        onPress={() => navigation.navigate('ViewWarranties')} 
        color="#4CAF50" 
      />

      
      <View style={styles.buttonContainer}>
        <Button title="Logout" onPress={handleLogout} color="#ff6b6b" />
      </View>

      {/* Modal for choosing receipt entry method */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Receipt Entry Method</Text>
            
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={handleScanReceipt}
            >
              <Text style={styles.modalButtonText}>Scan Receipt</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={handleManuallyAdd}
            >
              <Text style={styles.modalButtonText}>Manual Entry</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#DD27F5',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
  },
});

