import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ReactNode } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  colorblind: boolean;
  toggleTheme: () => void;
  toggleColorblind: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  colorblind: false,
  toggleTheme: () => {},
  toggleColorblind: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [colorblind, setColorblind] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('mindmaster-theme');
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
    }
    const cb = localStorage.getItem('mindmaster-colorblind');
    if (cb === 'true') {
      setColorblind(true);
    }
  }, []);

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('mindmaster-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('mindmaster-colorblind', String(colorblind));
  }, [colorblind]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const toggleColorblind = useCallback(() => {
    setColorblind((prev) => !prev);
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme, colorblind, toggleTheme, toggleColorblind }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
