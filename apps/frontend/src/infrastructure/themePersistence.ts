// Persistence adaptateur pour le thème utilisateur
export type RawTheme = 'light' | 'dark' | 'system';
const THEME_STORAGE_KEY = 'theme';

export function readThemeFromStorage(): RawTheme | null {
  try {
    const storedValue = localStorage.getItem(THEME_STORAGE_KEY) as RawTheme | null;
    return storedValue || null;
  } catch {
    return null;
  }
}

export function writeThemeToStorage(theme: RawTheme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // intentionally ignore persistence errors
  }
}
