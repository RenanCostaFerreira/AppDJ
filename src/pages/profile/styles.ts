import { StyleSheet } from 'react-native';
import { themes } from '../../global/themes';

export const style = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  header: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  back: { padding: 8 },
  logout: { backgroundColor: themes.colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  avatarWrap: { marginBottom: 16 },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#eee' },
  avatarPlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: themes.colors.lightGray || '#ddd', justifyContent: 'center', alignItems: 'center' },
  avatarPlaceholderText: { fontSize: 40, color: '#fff', fontWeight: '700' },
  changePhotoBtn: { marginTop: 8, backgroundColor: 'transparent', padding: 10 },
  changePhotoText: { color: themes.colors.primary, fontWeight: '700' },
  removePhotoBtn: { marginTop: 4, backgroundColor: 'transparent', padding: 8 },
  removePhotoText: { color: '#999' },
  title: { fontSize: 20, fontWeight: '700', marginTop: 12 },
  email: { color: themes.colors.gray, marginBottom: 16 }
});
