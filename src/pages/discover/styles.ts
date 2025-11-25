import { StyleSheet } from 'react-native';
import { themes } from '../../global/themes';

export const style = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8, color: themes.colors.primary },
  description: { fontSize: 14, color: '#666', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 10, marginBottom: 8 },
  button: { backgroundColor: themes.colors.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' }
  ,
  socialRow: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 8, backgroundColor: '#444', marginBottom: 8 },
  socialIconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: themes.colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  socialText: { color: '#fff', fontWeight: '700' }
});
export default style;
