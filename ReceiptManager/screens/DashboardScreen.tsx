// ReceiptManager/screens/DashboardScreen.tsx
// hi
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

interface Receipt {
  id: string;
  store: string;
  date: string;
  warrantyExpiration?: string;
}

export default function DashboardScreen() {
  const [search, setSearch] = useState("");
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [filtered, setFiltered] = useState<Receipt[]>([]);

  useEffect(() => {
    const mockData: Receipt[] = [
      {
        id: "1",
        store: "Best Buy",
        date: "2025-10-10",
        warrantyExpiration: "2026-10-10",
      },
      {
        id: "2",
        store: "Target",
        date: "2025-09-20",
        warrantyExpiration: "2025-12-01",
      },
    ];
    setReceipts(mockData);
    setFiltered(mockData);
  }, []);

  useEffect(() => {
    const result = receipts.filter((r) =>
      r.store.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, receipts]);

  const renderItem = ({ item }: { item: Receipt }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.store}>{item.store}</Text>
      <Text style={styles.date}>Purchased: {item.date}</Text>
      {item.warrantyExpiration && (
        <Text style={styles.warranty}>
          Warranty: {item.warrantyExpiration}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}></Text>
      <Text style={styles.header}></Text>
      <TextInput
        style={styles.search}
        placeholder="Search by store or item..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { fontSize: 24, fontWeight: "600", marginBottom: 12 },
  search: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  card: {
    padding: 16,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    marginBottom: 12,
  },
  store: { fontSize: 18, fontWeight: "bold" },
  date: { fontSize: 14, color: "#666" },
  warranty: { fontSize: 14, color: "#007AFF", marginTop: 4 },
});
