<template>
  <main>
    <h1>Frontend Vue</h1>
    <nav>
      <RouterLink to="/">Home</RouterLink> |
      <RouterLink to="/ping">Ping</RouterLink>
    </nav>
    <RouterView />
  </main>
</template>
<script setup lang="ts"></script>
<style scoped>
main { padding: 1rem; font-family: system-ui, sans-serif; }
nav { margin-bottom: 1rem; }
</style>
