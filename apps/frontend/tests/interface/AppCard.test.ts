import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AppCard from '../../src/interface/components/AppCard.vue';
import type { AppMeta } from '../../src/domain/app';

const sample: AppMeta = {
  id: 'projets',
  name: 'Projets',
  route: '/projets',
  description: 'Gérer et explorer les projets.'
};

describe('AppCard', () => {
  it('renders name and description', () => {
    const wrapper = mount(AppCard, { props: { app: sample } });
    expect(wrapper.text()).toContain('Projets');
    expect(wrapper.text()).toContain('Gérer et explorer les projets.');
  });

  it('emits select on click', async () => {
    const wrapper = mount(AppCard, { props: { app: sample } });
    await wrapper.trigger('click');
    const events = wrapper.emitted('select');
    expect(events).toBeTruthy();
    expect(events![0][0]).toEqual(sample);
  });
});
