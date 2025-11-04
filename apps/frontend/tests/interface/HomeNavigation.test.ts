import { describe, it, expect } from 'vitest';
async function flushPromises() { await new Promise(r => setTimeout(r, 0)); }
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import Home from '../../src/interface/views/Home.vue';
import AppGrid from '../../src/interface/components/AppGrid.vue';
import router from '../../src/interface/router';
import { createI18n } from 'vue-i18n';
import { messages } from '../../src/interface/i18n/messages';

// Basic navigation test through AppGrid selection

describe('Home Navigation', () => {
  it('navigates to projets on card click', async () => {
    router.push('/');
    await router.isReady();
    const i18n = createI18n({ legacy: false, locale: 'fr', messages });
    const wrapper = mount(Home, { global: { plugins: [router, i18n] } });
    const grid = wrapper.getComponent(AppGrid);
    const first = (grid.props('apps') as any[])[0];
    grid.vm.$emit('select', first);
    await nextTick();
    await flushPromises();
    await router.isReady();
    expect(router.currentRoute.value.path).toBe('/projets');
  });
});
