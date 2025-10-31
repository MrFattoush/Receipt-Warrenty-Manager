import React, { useState } from "react";
import { View, Text, Button, Image, StyleSheet } from "react-native";

export default function UploadReceiptScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const mockPickImage = () => {
    setImageUri("https://via.placeholder.com/200x200.png?text=Receipt+Preview");
  };

  const handleUpload = () => {
    console.log("Uploading receipt:", imageUri);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>Receipt + Warranty Manager</Text>
      <Text style={styles.title}>Upload Receipt</Text>

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <Text style={{ marginBottom: 15 }}>No image selected yet</Text>
      )}

      <Button title="Take / Select Photo" onPress={mockPickImage} />
      <Button title="Upload" onPress={handleUpload} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  appName: { position: "absolute", top: 40, left: 20, fontSize: 14, color: "#555" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  image: { width: 200, height: 200, borderRadius: 10, marginVertical: 15 },
});
