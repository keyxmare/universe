import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import App from '../../src/interface/App.vue';
import Home from '../../src/interface/views/Home.vue';
import PingView from '../../src/interface/views/PingView.vue';
import ProjetsView from '../../src/interface/views/ProjetsView.vue';
import router from '../../src/interface/router';
import { messages } from '../../src/interface/i18n/messages';
import { applications } from '../../src/domain/app';

const locales = Object.keys(messages);

function makeI18n(locale: string) {
  return createI18n({ legacy: false, locale, messages });
}

describe('i18n structure', () => {
  it('defines expected structural keys', () => {
    for (const locale of locales) {
      const m = (messages as any)[locale];
      expect(m.app).toBeTruthy();
      expect(m.nav).toBeTruthy();
      expect(m.apps).toBeTruthy();
      // Check required app keys
      ['title','applications','projets','projetsDescription','pingApi','pingButton','errorPrefix','unknownError']
        .forEach(k => expect(m.app[k]).toBeTypeOf('string'));
      // Check nav keys
      ['home','ping'].forEach(k => expect(m.nav[k]).toBeTypeOf('string'));
      // Each application id has name + description
      applications.forEach(a => {
        expect(m.apps[a.id]).toBeTruthy();
        expect(m.apps[a.id].name).toBeTypeOf('string');
        expect(m.apps[a.id].description).toBeTypeOf('string');
      });
    }
  });
});

describe('Rendered wordings use i18n keys', () => {
  locales.forEach(locale => {
    describe(`locale ${locale}`, () => {
      it('renders App title and nav via translations', async () => {
        const i18n = makeI18n(locale);
        router.push('/');
        await router.isReady();
        const wrapper = mount(App, { global: { plugins: [i18n, router] } });
        const text = wrapper.text();
        expect(text).toContain(messages[locale].app.title);
        expect(text).toContain(messages[locale].nav.home);
        expect(text).toContain(messages[locale].nav.ping);
      });

      it('renders applications heading', async () => {
        const i18n = makeI18n(locale);
        router.push('/');
        await router.isReady();
        const wrapper = mount(Home, { global: { plugins: [i18n, router] } });
        expect(wrapper.text()).toContain(messages[locale].app.applications);
        // AppCard names/descriptions
        applications.forEach(a => {
          expect(wrapper.text()).toContain(messages[locale].apps[a.id].name);
          expect(wrapper.text()).toContain(messages[locale].apps[a.id].description);
        });
      });

      it('renders projets view localized heading + description', async () => {
        const i18n = makeI18n(locale);
        router.push('/projets');
        await router.isReady();
        const wrapper = mount(ProjetsView, { global: { plugins: [i18n, router] } });
        const content = wrapper.text();
        expect(content).toContain(messages[locale].app.projets);
        expect(content).toContain(messages[locale].app.projetsDescription);
      });

      it('renders ping view static wording', async () => {
        const i18n = makeI18n(locale);
        router.push('/ping');
        await router.isReady();
        const wrapper = mount(PingView, { global: { plugins: [i18n, router] } });
        const content = wrapper.text();
        expect(content).toContain(messages[locale].app.pingApi);
        expect(content).toContain(messages[locale].app.pingButton);
      });
    });
  });
});

describe('Ping view non-Error path translation', () => {
  locales.forEach(locale => {
    it(`uses unknownError (${locale}) translation on primitive rejection`, async () => {
      const i18n = makeI18n(locale);
      router.push('/ping');
      await router.isReady();
      const wrapper = mount(PingView, { global: { plugins: [i18n, router] } });
      (globalThis.fetch as any) = () => Promise.reject('primitive');
      const button = wrapper.get('button');
      await button.trigger('click');
      await new Promise(r => setTimeout(r, 0));
      await wrapper.vm.$nextTick();
      expect(wrapper.text()).toContain(`${messages[locale].app.errorPrefix}: ${messages[locale].app.unknownError}`);
    });
  });
});
