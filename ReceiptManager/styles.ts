import { StyleSheet } from 'react-native';

const listStyles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', marginTop: 15, marginBottom: 10 },
  searchBar: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 10, marginBottom: 15 },
  row: { paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
  itemTitle: { fontSize: 18, fontWeight: '600' },
  itemMeta: { color: '#666', marginTop: 4 },
  warn: { color: '#d9534f', fontWeight: '700', marginTop: 6 },
});

export default listStyles;