import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ReactNode } from 'react';

export type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  colorblind: boolean;
  toggleTheme: () => void;
  toggleColorblind: () => void;
};

// Defaults throw if consumed without ThemeProvider — this surfaces a real bug
// rather than silently no-op'ing a toggle.
function noProvider() {
  throw new Error('useTheme must be used within ThemeProvider');
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  colorblind: false,
  toggleTheme: noProvider,
  toggleColorblind: noProvider,
});

const THEME_COOKIE = 'mindmaster-theme';
const COLORBLIND_COOKIE = 'mindmaster-colorblind';
// One year — preferences should outlive a typical browser cleanup.
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function ThemeProvider({
  children,
  initialTheme,
  initialColorblind,
}: {
  children: ReactNode;
  initialTheme: Theme;
  initialColorblind: boolean;
}) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [colorblind, setColorblind] = useState(initialColorblind);

  // Keep the documentElement class in sync. Initial render already has the
  // correct class from the server (root sets it from the loader), so this
  // only matters for client-side toggles.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      writeCookie(THEME_COOKIE, next);
      return next;
    });
  }, []);

  const toggleColorblind = useCallback(() => {
    setColorblind((prev) => {
      const next = !prev;
      writeCookie(COLORBLIND_COOKIE, String(next));
      return next;
    });
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

/**
 * Parse theme + colorblind preferences from a Cookie header. Used by the
 * root loader to set the initial theme on the server so SSR matches the
 * user's saved preference (no flash on hydration).
 */
export function parseThemePrefsFromCookie(cookieHeader: string | null): {
  theme: Theme;
  colorblind: boolean;
} {
  const cookies = parseCookies(cookieHeader ?? '');
  const themeRaw = cookies[THEME_COOKIE];
  const theme: Theme = themeRaw === 'light' ? 'light' : 'dark';
  const colorblind = cookies[COLORBLIND_COOKIE] === 'true';
  return { theme, colorblind };
}

function parseCookies(header: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k) out[k] = rest.join('=');
  }
  return out;
}
