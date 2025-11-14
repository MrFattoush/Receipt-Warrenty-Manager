import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { API_URL } from '../config';
import listStyles from '../styles';

type RootStackParamList = {
  Dashboard: undefined;
  ViewWarranties: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

type WarrantyRow = {
  id: number;
  warranty_item: string | null;
  warranty_exp_date: string | null;
  store_name?: string | null;
  days_left?: number | null;
  expiringSoon?: boolean;
};

export default function ViewWarrantiesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [search, setSearch] = useState('');
  const [warranties, setWarranties] = useState<WarrantyRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWarranties = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/get-warranties`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to fetch warranties');
      }
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to fetch warranties');
      setWarranties(json.warranties || []);
    } catch (err: any) {
      console.error('Error fetching warranties:', err);
      setError(err.message || 'Error fetching warranties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarranties();
  }, []);

  const filtered = warranties.filter(w =>
    (w.warranty_item ?? '').toLowerCase().includes(search.toLowerCase())
    || (w.store_name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={listStyles.container}>
      <Button
        title="← Back to Dashboard"
        color="#777"
        onPress={() => navigation.navigate('Dashboard')}
      />

      <Text style={listStyles.title}>Your Warranties</Text>

      <TextInput
        style={listStyles.searchBar}
        placeholder="Search warranties..."
        value={search}
        onChangeText={setSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : error ? (
        <Text style={{ color: 'red' }}>{error}</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={listStyles.row}>
              <Text style={listStyles.itemTitle}>{item.warranty_item ?? item.store_name ?? 'Item'}</Text>
              <Text style={listStyles.itemMeta}>
                {item.warranty_exp_date ? new Date(item.warranty_exp_date).toLocaleDateString() : 'No expiry date'}
                {item.days_left != null ? ` • ${item.days_left >= 0 ? `${item.days_left} days left` : 'Expired'}` : ''}
              </Text>
              {item.expiringSoon ? <Text style={listStyles.warn}>Expiring soon!</Text> : null}
            </View>
          )}
          ListEmptyComponent={<Text>No warranties found</Text>}
        />
      )}
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#fff' },
//   title: { fontSize: 26, fontWeight: 'bold', marginTop: 15, marginBottom: 10 },
//   searchBar: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 10, marginBottom: 15 },
//   row: { paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
//   itemTitle: { fontSize: 18, fontWeight: '600' },
//   itemMeta: { color: '#666', marginTop: 4 },
//   warn: { color: '#d9534f', fontWeight: '700', marginTop: 6 },
// });
