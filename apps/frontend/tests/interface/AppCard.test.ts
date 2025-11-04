import { describe, it, expect } from 'vitest';
import { createI18n } from 'vue-i18n';
import { messages } from '../../src/interface/i18n/messages';
import { mount } from '@vue/test-utils';
import AppCard from '../../src/interface/components/AppCard.vue';
import type { AppMeta } from '../../src/domain/app';

const sample: AppMeta = {
  id: 'projets',
  route: '/projets'
};

describe('AppCard', () => {
  it('renders name and description via i18n', () => {
    const i18n = createI18n({ legacy: false, locale: 'fr', messages });
    const wrapper = mount(AppCard, { props: { app: sample }, global: { plugins: [i18n] } });
    expect(wrapper.text()).toContain(messages.fr.apps.projets.name);
    expect(wrapper.text()).toContain(messages.fr.apps.projets.description);
  });

  it('emits select on click', async () => {
    const i18n = createI18n({ legacy: false, locale: 'fr', messages });
    const wrapper = mount(AppCard, { props: { app: sample }, global: { plugins: [i18n] } });
    await wrapper.trigger('click');
    const events = wrapper.emitted('select');
    expect(events).toBeTruthy();
    expect(events![0][0]).toEqual(sample);
  });
});
