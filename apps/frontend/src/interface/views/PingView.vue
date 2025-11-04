<template>
  <section>
    <h2>Ping API</h2>
    <button :disabled="loading" @click="doPing">Ping</button>
    <p v-if="error" style="color:red">Erreur: {{ error }}</p>
    <pre v-if="data">{{ JSON.stringify(data, null, 2) }}</pre>
  </section>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import type { PingResult } from '../../domain/ping';
import { performPing } from '../../application/pingService';

const loading = ref(false);

const data = ref<PingResult | null>(null);
const error = ref<string | null>(null);

async function doPing() {
  loading.value = true;
  error.value = null;
  data.value = null;
  try {
    const result = await performPing();
    data.value = result;
  } catch (e: unknown) {
    if (e instanceof Error) {
      error.value = e.message;
    } else {
      error.value = 'Erreur inconnue';
    }
  } finally {
    loading.value = false;
  }
}
</script>
