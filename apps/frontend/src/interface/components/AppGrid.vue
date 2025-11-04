<template>
  <div class="app-grid">
    <AppCard
      v-for="a in apps"
      :key="a.id"
      :app="a"
      @select="onSelect"
    />
  </div>
</template>
<script setup lang="ts">
import type { AppMeta } from '../../domain/app';
import AppCard from './AppCard.vue';


defineProps<{ apps: AppMeta[] }>();
const emit = defineEmits<{ (e: 'select', app: AppMeta): void }>();

function onSelect(app: AppMeta) {
  emit('select', app);
}
</script>
<style scoped>
.app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}
</style>
