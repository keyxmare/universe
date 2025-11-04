import { describe, it, expect } from 'vitest';
import { resolveEffectiveTheme } from '../../src/application/themeService';

describe('themeService.resolveEffective', () => {
  it('retourne le thème explicite light', () => {
    expect(resolveEffectiveTheme('light', true)).toBe('light');
  });
  it('retourne le thème explicite dark', () => {
    expect(resolveEffectiveTheme('dark', false)).toBe('dark');
  });
  it('mappe system vers dark si préférence système dark', () => {
    expect(resolveEffectiveTheme('system', true)).toBe('dark');
  });
  it('mappe system vers light si préférence système light', () => {
    expect(resolveEffectiveTheme('system', false)).toBe('light');
  });
});
