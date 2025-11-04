import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ThemeSwitch from '../../src/interface/components/ThemeSwitch.vue';

function getTheme() {
  return document.documentElement.dataset.theme;
}

describe('ThemeSwitch', () => {
  it('initializes with system and applies system preference', () => {
    const wrapper = mount(ThemeSwitch);
    // system resolves to light/dark depending on media; we just assert it set something valid
    expect(['light','dark']).toContain(getTheme());
    expect(localStorage.getItem('theme')).toBe('system');
    expect(wrapper.find('input[value="system"]').element).toBeTruthy();
  });

  it('switches to dark and updates dataset/localStorage', async () => {
    const wrapper = mount(ThemeSwitch);
    const dark = wrapper.find('input[value="dark"]');
    await dark.setValue();
    expect(getTheme()).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('switches to light and updates dataset/localStorage', async () => {
    const wrapper = mount(ThemeSwitch);
    const light = wrapper.find('input[value="light"]');
    await light.setValue();
    expect(getTheme()).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
