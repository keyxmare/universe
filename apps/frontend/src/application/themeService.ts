// Service applicatif pour gestion du thème
export type Theme = 'light' | 'dark' | 'system';
import { loadTheme, saveTheme, RawTheme } from '@infra/themePersistence';

export function resolveEffective(theme: Theme, systemPrefersDark: boolean): 'light' | 'dark' {
  if (theme === 'system') return systemPrefersDark ? 'dark' : 'light';
  return theme;
}

export function getInitialTheme(systemPrefersDark: boolean): Theme {
  const stored = loadTheme();
  return stored || (systemPrefersDark ? 'system' : 'system'); // par défaut system
}

export function persistTheme(theme: Theme): void {
  saveTheme(theme as RawTheme);
}
