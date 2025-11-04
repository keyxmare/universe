<template>
  <main>
    <h1>{{ $t('app.title') }}</h1>
    <nav>
      <RouterLink to="/">{{ $t('nav.home') }}</RouterLink> |
      <RouterLink to="/ping">{{ $t('nav.ping') }}</RouterLink>
    </nav>
    <ThemeSwitch />
    <RouterView />
  </main>
</template>
<script setup lang="ts">
import ThemeSwitch from './components/ThemeSwitch.vue';
</script>
<style scoped>
main { padding: 1rem; font-family: system-ui, sans-serif; }
nav { margin-bottom: 1rem; }
</style>
