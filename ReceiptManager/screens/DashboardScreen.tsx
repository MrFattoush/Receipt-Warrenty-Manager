import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
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
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'GET',
        credentials: 'include',
      });
      navigation.replace('Login');
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
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back!</Text>
          <Text style={styles.headerSubtitle}>Manage your receipts & warranties</Text>
        </View>
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => setShowLogoutMenu(!showLogoutMenu)}
        >
          <View style={styles.menuDot} />
          <View style={styles.menuDot} />
          <View style={styles.menuDot} />
        </TouchableOpacity>
      </View>

      {/* Logout Dropdown Menu */}
      {showLogoutMenu && (
        <View style={styles.logoutMenu}>
          <TouchableOpacity 
            style={styles.logoutMenuItem} 
            onPress={() => {
              setShowLogoutMenu(false);
              handleLogout();
            }}
          >
            <Text style={styles.logoutMenuText}>🚪 Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Action Card */}
        <TouchableOpacity style={styles.primaryCard} onPress={handleNewReceipt}>
          <View style={styles.primaryCardIcon}>
            <Text style={styles.primaryCardIconText}>+</Text>
          </View>
          <Text style={styles.primaryCardTitle}>Add New Receipt</Text>
          <Text style={styles.primaryCardSubtitle}>Scan or enter manually</Text>
        </TouchableOpacity>

        {/* Quick Actions Grid */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={[styles.actionCard, styles.actionCardBlue]} 
            onPress={() => navigation.navigate('ViewReceipts')}
          >
            <View style={styles.actionCardIcon}>
              <Text style={styles.actionCardIconText}>📄</Text>
            </View>
            <Text style={styles.actionCardTitle}>My Receipts</Text>
            <Text style={styles.actionCardSubtitle}>View all</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, styles.actionCardGreen]} 
            onPress={() => navigation.navigate('ViewWarranties')}
          >
            <View style={styles.actionCardIcon}>
              <Text style={styles.actionCardIconText}>🛡️</Text>
            </View>
            <Text style={styles.actionCardTitle}>Warranties</Text>
            <Text style={styles.actionCardSubtitle}>Active items</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Activity</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>—</Text>
              <Text style={styles.statLabel}>Total Receipts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>—</Text>
              <Text style={styles.statLabel}>Active Warranties</Text>
            </View>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>💡</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Pro Tip</Text>
            <Text style={styles.infoText}>
              Keep your receipts organized to easily track purchases and manage warranties
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal for choosing receipt entry method */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity 
            style={styles.modalContent}
            activeOpacity={1}
          >
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Add New Receipt</Text>
            <Text style={styles.modalSubtitle}>Choose how you'd like to add your receipt</Text>
            
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={handleScanReceipt}
            >
              <View style={styles.modalButtonIcon}>
                <Text style={styles.modalButtonIconText}>📷</Text>
              </View>
              <View style={styles.modalButtonContent}>
                <Text style={styles.modalButtonTitle}>Scan Receipt</Text>
                <Text style={styles.modalButtonSubtitle}>Use your camera to capture</Text>
              </View>
              <Text style={styles.modalButtonArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={handleManuallyAdd}
            >
              <View style={styles.modalButtonIcon}>
                <Text style={styles.modalButtonIconText}>✏️</Text>
              </View>
              <View style={styles.modalButtonContent}>
                <Text style={styles.modalButtonTitle}>Manual Entry</Text>
                <Text style={styles.modalButtonSubtitle}>Type details yourself</Text>
              </View>
              <Text style={styles.modalButtonArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 3,
  },
  menuDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#666',
  },
  logoutMenu: {
    position: 'absolute',
    top: 110,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
    minWidth: 150,
  },
  logoutMenuItem: {
    padding: 16,
  },
  logoutMenuText: {
    fontSize: 16,
    color: '#ff6b6b',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  primaryCard: {
    backgroundColor: '#DD27F5',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#DD27F5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryCardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  primaryCardIconText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  primaryCardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  primaryCardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionCardBlue: {
    backgroundColor: '#4B7BE5',
  },
  actionCardGreen: {
    backgroundColor: '#4CAF50',
  },
  actionCardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionCardIconText: {
    fontSize: 24,
  },
  actionCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  actionCardSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#DD27F5',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
  },
  infoCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 25,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  modalButtonIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  modalButtonIconText: {
    fontSize: 24,
  },
  modalButtonContent: {
    flex: 1,
  },
  modalButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 3,
  },
  modalButtonSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  modalButtonArrow: {
    fontSize: 24,
    color: '#ccc',
    fontWeight: '300',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});
