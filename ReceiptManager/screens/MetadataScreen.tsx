import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";

export default function MetadataScreen() {
  const [store, setStore] = useState("");
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [warranty, setWarranty] = useState("");

  const handleSave = () => {
    console.log("Saved metadata:", { store, item, price, warranty });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.appName}>Receipt + Warranty Manager</Text>
      <Text style={styles.title}>Receipt Details</Text>

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
});
