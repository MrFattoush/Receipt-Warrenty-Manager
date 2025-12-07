import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { API_URL } from '../config';
import listStyles from '../styles';

type RootStackParamList = {
  Dashboard: undefined;
  ViewReceipts: undefined;
  UpdateReceipt: { id: string };
};

type ReceiptRow = {
  id: string;
  store_name: string;
  receipt_date: string;
  amount: string;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function ViewReceiptsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [search, setSearch] = useState('');
  const [receipts, setReceipts] = useState<ReceiptRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const computeDaysAgo = (date: string) => {
    const receiptDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - receiptDate.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const noun = days === 1 ? 'day' : 'days';
    return `${days} ${noun} ago`;
  }

  const fetchReceipts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/get-receipts`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to fetch receipts');
      }
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to fetch receipts');

      setReceipts(json.receipts || []);
      console.log("Receipts: " + receipts)
    } catch (err: any) {
      console.error('Error fetching receipts:', err);
      setError(err.message || 'Error fetching receipts');
    } finally {
      setLoading(false);
    }
  };

  const deleteReceipt = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/delete-receipt?id=${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Failed to delete receipt");

    // Remove the deleted receipt locally
    setReceipts(prev => prev.filter(r => r.id !== id));
  } catch (err: any) {
    console.error("Delete error:", err);
    setError(err.message);
  }
};


  useEffect(() => {
    console.log("UseEffect running")
    fetchReceipts();
    console.log(receipts);
  }, []);

  return (
    <View style={listStyles.container}>
      <Button 
        title="← Back to Dashboard" 
        color="#777"
        onPress={() => navigation.navigate('Dashboard')}
      />

      <Text style={listStyles.title}>All Receipts</Text>

      <TextInput
        style={listStyles.searchBar}
        placeholder="Search receipts by store name"
        value={search}
        onChangeText={setSearch}
      />

      {/* <FlatList
        data={receipts.filter(r => r.store_name.toLowerCase().includes(search.toLowerCase()))}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item.store_name}</Text>
        )}
      /> */}

      {loading ? (
        <ActivityIndicator size="large" />
      ) : error ? (
        <Text style={{ color: 'red' }}>{error}</Text>
      ) : (
        <FlatList
          data={receipts.filter(r => r.store_name.toLowerCase().includes(search.toLowerCase()))}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={listStyles.row}>
              <Text style={listStyles.itemTitle}>
                {item.store_name}
                {` • $${item.amount} spent`}
              </Text>
              <Text style={listStyles.itemMeta}>
                {item.receipt_date ? new Date(item.receipt_date).toLocaleDateString() : 'No receipt date'}
                {item.receipt_date != null ? ` • ${computeDaysAgo(item.receipt_date)}` : ''}
              </Text>
              <Button
                title="Update"
                color="#ffaa00"
                onPress={() => navigation.navigate("UpdateReceipt", { id: item.id })}
              />
              {/* Delete Button */}
              <Button
                title="Delete"
                color="#d11"
                onPress={() => deleteReceipt(item.id)}
              />
            </View>
            
          )}
        />
      )}
    </View>
  );
}

// const receiptStyles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     marginTop: 15,
//     marginBottom: 10,
//   },
//   searchBar: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 15,
//   },
//   item: {
//     paddingVertical: 15,
//     fontSize: 18,
//     borderBottomWidth: 1,
//     borderColor: '#eee',
//   },
// });
