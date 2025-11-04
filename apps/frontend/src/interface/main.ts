import { createApp } from 'vue';
import store from '@infra/store';
import App from './App.vue';
import router from './router';
import { createI18n } from 'vue-i18n';
import { messages } from './i18n/messages';

const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'en',
  messages
});

const app = createApp(App);
app.use(store);
app.use(router);
app.use(i18n);
app.mount('#app');
