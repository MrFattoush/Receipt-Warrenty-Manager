// screens/UpdateReceiptScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { API_URL } from '../config';
import listStyles from '../styles';

type RootStackParamList = {
  Dashboard: undefined;
  ViewReceipts: undefined;
  UpdateReceipt: { id: string };
};

type Props = {
  route: RouteProp<RootStackParamList, 'UpdateReceipt'>;
  navigation: StackNavigationProp<RootStackParamList, 'UpdateReceipt'>;
};

export default function UpdateReceiptScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    store_name: '',
    amount: '',
    receipt_date: '',
  });
  const [error, setError] = useState<string | null>(null);

  // Helper to ensure date is in YYYY-MM-DD
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.includes('/')) {
      const [month, day, year] = dateStr.split('/');
      return `${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`;
    }
    return dateStr; // already YYYY-MM-DD
  };

  // Load receipt
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/get-receipt/${id}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to load receipt');
        const json = await res.json();
        if (!json.success) throw new Error(json.message || 'Failed to load receipt');
        const r = json.receipt;
        setForm({
          store_name: r.store_name ?? '',
          amount: String(r.amount ?? ''),
          receipt_date: r.receipt_date ?? '',
        });
      } catch (err: any) {
        console.error('Update load error', err);
        setError(err.message || 'Error loading receipt');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Save receipt
  const save = async () => {
    setSaving(true);
    setError(null);

    // Basic validation
    if (!form.store_name.trim()) {
      setError('Store name is required');
      setSaving(false);
      return;
    }
    if (!form.amount.trim() || isNaN(Number(form.amount))) {
      setError('Amount must be a number');
      setSaving(false);
      return;
    }
    if (!form.receipt_date.trim()) {
      setError('Date is required');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/update-receipt/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          store_name: form.store_name,
          amount: parseFloat(form.amount),
          receipt_date: formatDate(form.receipt_date),
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to update receipt');
      }

      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to update receipt');

      Alert.alert('Saved', 'Receipt updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      console.error('Update save error', err);
      setError(err.message || 'Failed to save receipt');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  return (
    <View style={listStyles.container}>
      <Button title="← Back" onPress={() => navigation.goBack()} />
      <Text style={listStyles.title}>Update Receipt</Text>

      {error ? <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text> : null}

      <Text style={{ marginTop: 16 }}>Store name</Text>
      <TextInput
        value={form.store_name}
        onChangeText={(t) => setForm({ ...form, store_name: t })}
        style={listStyles.searchBar}
      />

      <Text style={{ marginTop: 16 }}>Amount</Text>
      <TextInput
        value={form.amount}
        keyboardType="numeric"
        onChangeText={(t) => setForm({ ...form, amount: t })}
        style={listStyles.searchBar}
      />

      <Text style={{ marginTop: 16 }}>Date (YYYY-MM-DD)</Text>
      <TextInput
        value={form.receipt_date}
        onChangeText={(t) => setForm({ ...form, receipt_date: t })}
        style={listStyles.searchBar}
      />

      <View style={{ marginTop: 24 }}>
        <Button title={saving ? 'Saving...' : 'Save changes'} onPress={save} disabled={saving} />
      </View>
    </View>
  );
}
