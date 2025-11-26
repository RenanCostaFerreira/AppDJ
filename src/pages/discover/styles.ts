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
  socialRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, backgroundColor: '#444', marginBottom: 12 },
  socialIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: themes.colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  socialText: { color: '#fff', fontWeight: '700', fontSize: 16 }
,
  desktopRow: { flexDirection: 'row', alignItems: 'flex-start' },
  desktopMain: { flex: 2 },
  desktopSidebar: { flex: 1, paddingLeft: 16, borderLeftWidth: 1, borderColor: '#eee' },
  contactCardDesktop: { padding: 12, borderRadius: 8, backgroundColor: '#fff', marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  contactTextDesktop: { color: '#333', fontWeight: '700' }
});
export default style;
