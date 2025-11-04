// Service applicatif pour gestion du thème
export type Theme = 'light' | 'dark' | 'system';
import { readThemeFromStorage, writeThemeToStorage, RawTheme } from '@infra/themePersistence';

export function resolveEffectiveTheme(selectedTheme: Theme, systemPrefersDark: boolean): 'light' | 'dark' {
  if (selectedTheme === 'system') {
    return systemPrefersDark ? 'dark' : 'light';
  }
  return selectedTheme;
}

export function loadStoredThemeRaw(): RawTheme | null {
  return readThemeFromStorage();
}

export function deriveInitialTheme(): Theme {
  const storedTheme = loadStoredThemeRaw();
  if (storedTheme) return storedTheme;
  return 'system';
}

export function persistSelectedTheme(theme: Theme): void {
  writeThemeToStorage(theme as RawTheme);
}
