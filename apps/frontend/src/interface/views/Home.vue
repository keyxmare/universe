<template>
  <section>
    <h2>{{ $t('app.applications') }}</h2>
    <AppGrid :apps="applications" @select="goTo" />
  </section>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { applications } from '@domain/app';
import AppGrid from '../components/AppGrid.vue';

const router = useRouter();
function goTo(app: typeof applications[number]) {
  router.push(app.route);
}
</script>
