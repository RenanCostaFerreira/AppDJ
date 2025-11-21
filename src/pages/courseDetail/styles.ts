import { StyleSheet } from 'react-native';
import { themes } from '../../global/themes';

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: themes.colors.lightGray,
  },
  backText: {
    color: themes.colors.primary
  },
  image: {
    width: '100%',
    height: 200
  },
  body: {
    padding: 16
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8
  },
  description: {
    color: themes.colors.gray,
    marginBottom: 20
  },
  enrollButton: {
    backgroundColor: themes.colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  enrollText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
