<template>
  <fieldset class="theme-switch">
    <legend class="sr-only">{{ $t('app.theme') }}</legend>
    <label :class="{ active: current === 'light' }">
      <input v-model="current" type="radio" name="theme" value="light" />
      <span>{{ $t('app.themeLight') }}</span>
    </label>
    <label :class="{ active: current === 'dark' }">
      <input v-model="current" type="radio" name="theme" value="dark" />
      <span>{{ $t('app.themeDark') }}</span>
    </label>
    <label :class="{ active: current === 'system' }">
      <input v-model="current" type="radio" name="theme" value="system" />
      <span>{{ $t('app.themeSystem') }}</span>
    </label>
  </fieldset>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

type Theme = 'light' | 'dark' | 'system';
const current = ref<Theme>('system');

function getMatchMedia() {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { matchMedia?: (q: string) => MediaQueryList };
  return typeof w.matchMedia === 'function' ? w.matchMedia('(prefers-color-scheme: dark)') : null;
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  let final: 'light' | 'dark';
  if (theme === 'system') {
    const mm = getMatchMedia();
    final = mm && mm.matches ? 'dark' : 'light';
  } else {
    final = theme;
  }
  root.dataset.theme = final;
  try { localStorage.setItem('theme', theme); } catch (err) { /* ignore persistence errors */ }
}

onMounted(() => {
  let saved: Theme | null = null;
  try { saved = localStorage.getItem('theme') as Theme | null; } catch (err) { /* ignore retrieval errors */ }
  if (saved) {
    current.value = saved;
  }
  applyTheme(current.value);
  // Update on system change if system selected
  const mq = getMatchMedia();
  if (mq) {
    mq.addEventListener('change', () => {
      if (current.value === 'system') applyTheme('system');
    });
  }
});

watch(current, t => applyTheme(t));
</script>
<style scoped>
.theme-switch {
  display: inline-flex;
  gap: .25rem;
  padding: .25rem;
  border: 1px solid var(--border-color, #ccc);
  border-radius: 999px;
  background: var(--switch-bg, #f5f5f5);
}
.theme-switch label {
  cursor: pointer;
  user-select: none;
  padding: .25rem .5rem;
  border-radius: 999px;
  font-size: .7rem;
  line-height: 1;
  display: flex;
  align-items: center;
  font-weight: 600;
  color: var(--switch-fg, #333);
  transition: background .15s, color .15s;
}
.theme-switch input { display: none; }
.theme-switch label.active {
  background: var(--accent, #6200ee);
  color: #fff;
}
</style>
