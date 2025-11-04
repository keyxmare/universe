import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from './views/Home.vue';
import PingView from './views/PingView.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: Home },
  { path: '/ping', name: 'ping', component: PingView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
