import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ThemeSwitch from '../../src/interface/components/ThemeSwitch.vue';

function getTheme() {
  return document.documentElement.dataset.theme;
}

function mountWithI18n() {
  return mount(ThemeSwitch, {
    global: {
      config: {
        globalProperties: {
          $t: (k: string) => k // simple stub
        }
      }
    }
  });
}

describe('ThemeSwitch', () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it('initializes with system and applies system preference', () => {
    const wrapper = mountWithI18n();
    expect(['light','dark']).toContain(getTheme());
    expect(localStorage.getItem('theme')).toBe('system');
    expect(wrapper.find('input[value="system"]').exists()).toBe(true);
  });

  it('switches to dark and updates dataset/localStorage', async () => {
    const wrapper = mountWithI18n();
    const dark = wrapper.find('input[value="dark"]');
    await dark.setValue();
    expect(getTheme()).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('switches to light and updates dataset/localStorage', async () => {
    const wrapper = mountWithI18n();
    const light = wrapper.find('input[value="light"]');
    await light.setValue();
    expect(getTheme()).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('reapplies system preference on media query change', async () => {
    // Mock matchMedia with toggle capability
    const listeners: Array<(e: MediaQueryListEvent) => void> = [];
    const mql: MediaQueryList = {
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => { listeners.push(cb); },
      removeEventListener: () => {},
      dispatchEvent: () => true,
      addListener: () => {}, // deprecated API stubs
      removeListener: () => {},
    } as MediaQueryList;
    (window as any).matchMedia = () => mql;

    const wrapper = mountWithI18n();
    expect(localStorage.getItem('theme')).toBe('system');
    const initial = getTheme();

    // Toggle system preference to dark then back
    mql.matches = !mql.matches;
    const evt = { matches: mql.matches, media: mql.media } as MediaQueryListEvent;
    listeners.forEach(l => l(evt));
    const afterFirst = getTheme();
    expect(afterFirst).not.toBe(initial);

    mql.matches = !mql.matches;
    const evt2 = { matches: mql.matches, media: mql.media } as MediaQueryListEvent;
    listeners.forEach(l => l(evt2));
    const afterSecond = getTheme();
    expect(['light','dark']).toContain(afterSecond);

    // Still system selected in UI
    expect(wrapper.find('input[value="system"]').exists()).toBe(true);
  });
});
