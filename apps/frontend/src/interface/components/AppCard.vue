<template>
  <div class="app-card" role="button" :aria-label="$t(`apps.${app.id}.name`)" @click="onSelect">
    <h3>{{ $t(`apps.${app.id}.name`) }}</h3>
    <p>{{ $t(`apps.${app.id}.description`) }}</p>
  </div>
</template>
<script setup lang="ts">
import type { AppMeta } from '../../domain/app';


const props = defineProps<{ app: AppMeta }>();
const emit = defineEmits<{ (e: 'select', app: AppMeta): void }>();

function onSelect() {
  emit('select', props.app);
}
</script>
<style scoped>
.app-card {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background .15s, border-color .15s;
  background: #fff;
}
.app-card:hover {
  background: #f8f9fa;
  border-color: #999;
}
.app-card h3 { margin: 0 0 .5rem; font-size: 1.1rem; }
.app-card p { margin: 0; font-size: .9rem; color: #555; }
</style>
