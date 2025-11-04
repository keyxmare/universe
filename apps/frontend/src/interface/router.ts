import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from './views/Home.vue';
import ProjetsView from './views/ProjetsView.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: Home },
  { path: '/projets', name: 'projets', component: ProjetsView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
