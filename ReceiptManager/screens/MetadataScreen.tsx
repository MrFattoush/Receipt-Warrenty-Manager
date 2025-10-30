import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Image } from "react-native";
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.appName}>Receipt + Warranty Manager</Text>
      <Text style={styles.title}>Receipt Details</Text>

      {imageUri && (
        <View style={styles.imageContainer}>
          <Text style={styles.imageLabel}>Captured Receipt:</Text>
          <Image source={{ uri: imageUri }} style={styles.receiptImage} />
        </View>
      )}

      <TextInput style={styles.input} placeholder="Store Name" value={store} onChangeText={setStore} />
      <TextInput style={styles.input} placeholder="Item Name" value={item} onChangeText={setItem} />
      <TextInput style={styles.input} placeholder="Price ($)" value={price} onChangeText={setPrice} />
      <TextInput
        style={styles.input}
        placeholder="Warranty Expiration Date"
        value={warranty}
        onChangeText={setWarranty}
      />

      <Button title="Save" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: 20 },
  appName: { position: "absolute", top: 40, left: 20, fontSize: 14, color: "#555" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 12 },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  imageLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  receiptImage: {
    width: 200,
    height: 250,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#DD27F5",
  },
});
