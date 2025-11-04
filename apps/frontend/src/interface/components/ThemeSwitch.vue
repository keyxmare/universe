<template>
  <fieldset class="theme-switch">
    <legend class="sr-only">{{ $t('app.theme') }}</legend>
    <label v-for="opt in options" :key="opt" :class="{ active: current === opt }">
      <input v-model="current" type="radio" name="theme" :value="opt" />
      <span>{{ $t(`app.theme${capitalize(opt)}`) }}</span>
    </label>
  </fieldset>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { Theme, resolveEffectiveTheme, deriveInitialTheme, persistSelectedTheme } from '@app/themeService';

const options: Theme[] = ['light', 'dark', 'system'];
function capitalize(t: string) { return t.charAt(0).toUpperCase() + t.slice(1); }
const current = ref<Theme>('system');

function getMatchMedia() {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { matchMedia?: (q: string) => MediaQueryList };
  return typeof w.matchMedia === 'function' ? w.matchMedia('(prefers-color-scheme: dark)') : null;
}

function apply(theme: Theme) {
  const mm = getMatchMedia();
  const final = resolveEffectiveTheme(theme, !!mm?.matches);
  document.documentElement.dataset.theme = final;
  persistSelectedTheme(theme);
}

onMounted(() => {
  const mm = getMatchMedia();
  current.value = deriveInitialTheme();
  apply(current.value);
  if (mm) {
    mm.addEventListener('change', () => {
      if (current.value === 'system') apply('system');
    });
  }
});

watch(current, t => apply(t));
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
