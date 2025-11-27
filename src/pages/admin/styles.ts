import { StyleSheet } from 'react-native';
import { themes } from '../../global/themes';

export const style = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  tableHeader: { padding: 8, flexDirection: 'row', backgroundColor: '#fafafa', borderBottomWidth: 1, borderColor: '#eee' },
  tableRow: { padding: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tableCell: { flex: 1 },
  tableCellSmall: { width: 80, textAlign: 'center' },
  classCard: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  classCell: { color: '#666' },
  userBox: { marginBottom: 8 },
  userBoxText: { fontWeight: '700' },
  userBoxSub: { color: '#666', marginTop: 2 },
  userBoxRounded: { backgroundColor: '#ebebeb', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8 },
  userBoxRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  userBoxLeft: { flex: 1, paddingRight: 12 },
  userBoxActions: { flexDirection: 'row', alignItems: 'center' },
});

export default style;
