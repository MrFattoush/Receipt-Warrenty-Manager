import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { API_URL } from '../config';

type RootStackParamList = {
  Dashboard: undefined;
  ViewReceipts: undefined;
};

type ReceiptRow = {
  id: string;
  store_name: string;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function ViewReceiptsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [search, setSearch] = useState('');
  const [receipts, setReceipts] = useState<ReceiptRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  // const receipts = [   // todo: replace this with database.
  //                      // todo: add an endpoint in backend (get-receipt)
  //   { id: '1', name: 'Target Receipt' },
  //   { id: '2', name: 'Walmart Receipt' },
  // ];

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

  useEffect(() => {
    console.log("UseEffect running")
    fetchReceipts();
    console.log(receipts);
  }, []);

  return (
    <View style={styles.container}>
      <Button 
        title="← Back to Dashboard" 
        color="#777"
        onPress={() => navigation.navigate('Dashboard')}
      />

      <Text style={styles.title}>All Receipts</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Search receipts"
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
            <Text style={styles.item}>{item.store_name + ' Receipt'}</Text>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  item: {
    paddingVertical: 15,
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
});
