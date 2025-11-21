import { StyleSheet } from 'react-native';
import { themes } from '../../global/themes';

export const style = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f5f7' },

  /* Header */
  header: {
    width: '100%',
    paddingTop: 36,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: themes.colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  headerTitleSmall: { color: '#fff', fontWeight: '700', fontSize: 14 },
  menuButton: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  menuBar: { width: 20, height: 2, backgroundColor: '#fff' },

  /* search */
  searchWrapper: { marginTop: 12, backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 10, padding: 10 },
  searchText: { color: themes.colors.gray },

  /* services */
  servicesRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 12 },
  serviceItem: { alignItems: 'center', width: 68 },
  serviceLabel: { marginTop: 6, fontSize: 12, textAlign: 'center', color: themes.colors.gray },

  sectionTitle: { marginTop: 18, marginLeft: 16, fontSize: 16, fontWeight: '700', color: '#222' },

  /* list cards */
  list: { paddingVertical: 12, paddingHorizontal: 8, paddingBottom: 140 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 760,
    paddingVertical: 12,
    alignSelf: 'center',
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center'
  },
  cardImage: { width: 64, height: 64, borderRadius: 8, marginLeft: 12 },
  cardBody: { flex: 1, paddingVertical: 8, paddingHorizontal: 12, justifyContent: 'center' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontWeight: '700', fontSize: 16, color: '#111' },
  cardShort: { color: themes.colors.gray, marginTop: 4, fontSize: 13 },
  favoriteButton: { padding: 6 },
  favoriteStar: { fontSize: 20 },

  /* menu */
  overlayBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  menuPanel: { position: 'absolute', top: 80, right: 16, backgroundColor: '#fff', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12, elevation: 6 },
  menuItem: { paddingVertical: 8 },
  menuItemText: { color: '#333', fontSize: 16 },

  /* favorites panel */
  favoritesPanel: { width: '90%', maxWidth: 720, alignSelf: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 8, marginTop: 12, elevation: 4 },
  favoritesTitle: { fontWeight: 'bold', marginBottom: 8 },
  favoriteRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderColor: themes.colors.lightGray },
  favoriteText: { flex: 1 },
  /* bottom navigation */
  bottomNav: { position: 'absolute', left: 16, right: 16, bottom: 36, height: 64, backgroundColor: '#fff', borderRadius: 32, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', elevation: 6 },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 12, marginTop: 4, color: themes.colors.gray },
});
