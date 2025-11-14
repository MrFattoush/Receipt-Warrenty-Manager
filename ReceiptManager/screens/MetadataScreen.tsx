import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Dashboard: undefined;
  ScanReceipt: undefined;
  ManuallyAdd: undefined;
  MetadataScreen: { imageUri: string };
};

type MetadataScreenRouteProp = RouteProp<RootStackParamList, 'MetadataScreen'>;
type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function MetadataScreen() {
  const route = useRoute<MetadataScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const [store, setStore] = useState("");
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [warranty, setWarranty] = useState("");

  const imageUri = route.params?.imageUri;

  const handleSave = () => {
    console.log("Saved metadata:", { store, item, price, warranty, imageUri });
    // TODO: Save metadata to backend
    navigation.navigate('Dashboard');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Receipt Details</Text>
        <Text style={styles.headerSubtitle}>Review and confirm your purchase information</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {imageUri && (
          <View style={styles.imageCard}>
            <Image source={{ uri: imageUri }} style={styles.receiptImage} />
            <View style={styles.imageOverlay}>
              <Text style={styles.imageLabel}>📸 Captured Receipt</Text>
            </View>
          </View>
        )}

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>🏪 Store Name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g., Best Buy, Target, Amazon" 
              value={store} 
              onChangeText={setStore}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>🛍️ Item Name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g., Laptop, Headphones, TV" 
              value={item} 
              onChangeText={setItem}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>💰 Price</Text>
            <View style={styles.priceInputContainer}>
              <Text style={styles.dollarSign}>$</Text>
              <TextInput 
                style={styles.priceInput} 
                placeholder="0.00" 
                value={price} 
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>📅 Warranty Expiration</Text>
            <TextInput 
              style={styles.input} 
              placeholder="MM/DD/YYYY" 
              value={warranty} 
              onChangeText={setWarranty}
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Save Receipt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F8F9FA" 
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: "800", 
    color: "#1A1A1A",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    fontWeight: "400",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  imageCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  receiptImage: {
    width: "100%",
    height: 280,
    borderRadius: 12,
    resizeMode: "cover",
  },
  imageOverlay: {
    marginTop: 12,
  },
  imageLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#DD27F5",
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: { 
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5, 
    borderColor: "#E0E0E0", 
    borderRadius: 12, 
    padding: 16,
    fontSize: 16,
    color: "#1A1A1A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingLeft: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dollarSign: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginRight: 4,
  },
  priceInput: {
    flex: 1,
    padding: 16,
    paddingLeft: 4,
    fontSize: 16,
    color: "#1A1A1A",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButton: {
    backgroundColor: "#DD27F5",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    shadowColor: "#DD27F5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
