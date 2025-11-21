import { StyleSheet } from 'react-native';
import { themes } from '../../global/themes';

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
  width: '100%',
  paddingTop: 24,
  paddingBottom: 12,
  paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: themes.colors.lightGray
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: themes.colors.primary,
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0
  ,
  top: 18,
  lineHeight: 24
  },
  backText: {
    color: themes.colors.primary
  },
  empty: { padding: 24, alignItems: 'center' },
  emptyText: { color: themes.colors.gray },
  list: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'stretch'
  },
  card: {
    flexDirection: 'row',
    backgroundColor: themes.colors.lightGray,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 680,
    paddingVertical: 8,
    alignSelf: 'center',
    marginHorizontal: 8
  },
  cardImage: { width: 72, height: 72, borderRadius: 6 },
  cardBody: { flex: 1, paddingVertical: 8, paddingHorizontal: 10, justifyContent: 'center' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  favoriteButton: { padding: 6 },
  favoriteStar: { fontSize: 20 },
  cardTitle: { fontWeight: 'bold', fontSize: 15 },
  cardShort: { color: themes.colors.gray, marginTop: 2, fontSize: 13 }
});
