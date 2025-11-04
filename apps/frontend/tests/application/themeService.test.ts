import { describe, it, expect } from 'vitest';
import { resolveEffective } from '../../src/application/themeService';

describe('themeService.resolveEffective', () => {
  it('retourne le thème explicite light', () => {
    expect(resolveEffective('light', true)).toBe('light');
  });
  it('retourne le thème explicite dark', () => {
    expect(resolveEffective('dark', false)).toBe('dark');
  });
  it('mappe system vers dark si préférence système dark', () => {
    expect(resolveEffective('system', true)).toBe('dark');
  });
  it('mappe system vers light si préférence système light', () => {
    expect(resolveEffective('system', false)).toBe('light');
  });
});
