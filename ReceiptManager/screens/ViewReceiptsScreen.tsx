import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Dashboard: undefined;
  ViewReceipts: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function ViewReceiptsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [search, setSearch] = useState('');

  
  const receipts = [   // todo: replace this with database.
                       // todo: add an endpoint in backend (get-receipt)
    { id: '1', name: 'Target Receipt' },
    { id: '2', name: 'Walmart Receipt' },
  ];

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

      <FlatList
        data={receipts.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item.name}</Text>
        )}
      />
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
