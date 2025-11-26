import React from 'react';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type LayoutMode = 'mobile' | 'desktop';

type LayoutCtx = {
  mode: LayoutMode;
  setMode: (m: LayoutMode) => void;
  toggleMode: () => void;
  resetToAuto: () => void;
  isAuto: boolean; // true when we are on auto mode (user hasn't persisted a choice)
};

const LayoutContext = React.createContext<LayoutCtx | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = React.useState<LayoutMode>('mobile');
  const [isAuto, setIsAuto] = React.useState(true); // are we auto-detecting the layout?

  React.useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('layoutMode');
        if (raw === 'desktop' || raw === 'mobile') {
          setModeState(raw);
          setIsAuto(false);
        } else {
          // no saved preference; auto-detect
          const { width } = Dimensions.get('window');
          setModeState(width >= 900 ? 'desktop' : 'mobile');
          setIsAuto(true);
        }
      } catch (e) {
        // ignore
        const { width } = Dimensions.get('window');
        setModeState(width >= 900 ? 'desktop' : 'mobile');
      }
    })();

    const onChange = ({ window }: { window: { width: number } }) => {
      // if auto mode, react to width changes
      if (isAuto) {
        setModeState(window.width >= 900 ? 'desktop' : 'mobile');
      }
    };
    const sub = Dimensions.addEventListener ? Dimensions.addEventListener('change', onChange) : Dimensions.addEventListener('change', onChange as any);
    return () => {
      try {
        // remove listener
        if (sub && typeof sub.remove === 'function') sub.remove();
        else Dimensions.removeEventListener && Dimensions.removeEventListener('change', onChange as any);
      } catch (e) { }
    };
  }, [isAuto]);

  const setMode = async (m: LayoutMode) => {
    setModeState(m);
    setIsAuto(false);
    try { await AsyncStorage.setItem('layoutMode', m); } catch (e) { /* ignore */ }
  };

  const toggleMode = () => {
    const next = mode === 'mobile' ? 'desktop' : 'mobile';
    setModeState(next);
    setIsAuto(false);
    AsyncStorage.setItem('layoutMode', next).catch(() => { });
  };

  const resetToAuto = async () => {
    try {
      await AsyncStorage.removeItem('layoutMode');
    } catch (e) { }
    setIsAuto(true);
    const { width } = Dimensions.get('window');
    setModeState(width >= 900 ? 'desktop' : 'mobile');
  };

  return (
    <LayoutContext.Provider value={{ mode, setMode, toggleMode, resetToAuto, isAuto }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const ctx = React.useContext(LayoutContext);
  if (!ctx) throw new Error('useLayout must be used within LayoutProvider');
  return ctx;
}

export default LayoutContext;
