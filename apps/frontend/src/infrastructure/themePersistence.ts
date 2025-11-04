// Persistence adaptateur pour le thème utilisateur
export type RawTheme = 'light' | 'dark' | 'system';
const KEY = 'theme';

export function loadTheme(): RawTheme | null {
  try {
    const v = localStorage.getItem(KEY) as RawTheme | null;
    return v || null;
  } catch {
    return null;
  }
}

export function saveTheme(theme: RawTheme): void {
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // noop
  }
}
