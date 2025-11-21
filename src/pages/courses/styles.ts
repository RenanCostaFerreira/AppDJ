import { StyleSheet } from 'react-native';
import { themes } from '../../global/themes';

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    padding: 16,
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
    flex: 1
  },
  backText: {
    color: themes.colors.primary
  },
  list: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center'
  },
  card: {
    flexDirection: 'row',
    backgroundColor: themes.colors.lightGray,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    width: '92%',
    maxWidth: 680,
    paddingVertical: 8
  },
  cardImage: {
    width: 72,
    height: 72,
    borderRadius: 6
  },
  cardBody: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    justifyContent: 'center'
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 15
  },
  cardShort: {
    color: themes.colors.gray,
    marginTop: 2,
    fontSize: 13
  }
  ,
  menuButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  menuBar: {
    width: 20,
    height: 2,
    backgroundColor: themes.colors.primary
  },
  menuPanel: {
    position: 'absolute',
    top: 64,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6
  },
  menuItem: {
    paddingVertical: 8,
  },
  menuItemText: {
    color: '#333',
    fontSize: 16
  }
  ,
  favoritesPanel: {
    width: '90%',
    maxWidth: 720,
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4
  },
  favoritesTitle: {
    fontWeight: 'bold',
    marginBottom: 8
  },
  favoriteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: themes.colors.lightGray
  },
  favoriteText: {
    flex: 1
  }
  ,
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end'
  }
});
