// ReceiptManager/screens/ReminderScreen.tsx
// V3
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Button, Alert } from "react-native";

interface Reminder {
  id: string;
  store: string;
  warrantyExpiration: string;
}

export default function ReminderScreen() {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    setReminders([
      { id: "1", store: "Apple Store", warrantyExpiration: "2025-11-01" },
      { id: "2", store: "IKEA", warrantyExpiration: "2025-12-10" },
    ]);
  }, []);

  const scheduleNotification = (item: Reminder) => {
    Alert.alert("Reminder", `Reminder set for ${item.store}`);
  };

  const renderItem = ({ item }: { item: Reminder }) => (
    <View style={styles.card}>
      <Text style={styles.store}>{item.store}</Text>
      <Text>Expires on: {item.warrantyExpiration}</Text>
      <Button title="Remind Me" onPress={() => scheduleNotification(item)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}></Text>
      <Text style={styles.header}></Text>
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { fontSize: 24, fontWeight: "600", marginBottom: 12 },
  card: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 12,
  },
  store: { fontSize: 18, fontWeight: "bold", marginBottom: 6 },
});
