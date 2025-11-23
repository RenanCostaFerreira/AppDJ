import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeName = 'light' | 'dark' | 'colorblind';

export const defaultThemes = {
  light: {
    background: '#f5f5f5',
    text: '#222',
    panel: '#fff',
    primary: '#ff6810'
  },
  dark: {
    background: '#121212',
    text: '#eee',
    panel: '#1e1e1e',
    primary: '#ff6810'
  },
  colorblind: {
    background: '#f5f5f5',
    text: '#222',
    panel: '#fff',
    primary: '#0066cc'
  }
};

const ThemeContext = React.createContext({
  themeName: 'light' as ThemeName,
  theme: defaultThemes.light,
  setThemeName: (t: ThemeName) => {}
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }>= ({ children }) => {
  const [themeName, setThemeName] = React.useState<ThemeName>('light');
  const [theme, setTheme] = React.useState(defaultThemes.light);

  React.useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('appTheme');
        if (saved === 'dark' || saved === 'colorblind' || saved === 'light') {
          setThemeName(saved);
          setTheme(defaultThemes[saved]);
        }
      } catch (err) {
        // ignore
      }
    })();
  }, []);

  React.useEffect(() => {
    setTheme(defaultThemes[themeName]);
    AsyncStorage.setItem('appTheme', themeName).catch(() => {});
  }, [themeName]);

  return (
    <ThemeContext.Provider value={{ themeName, theme, setThemeName }}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => React.useContext(ThemeContext);

export default ThemeContext;
