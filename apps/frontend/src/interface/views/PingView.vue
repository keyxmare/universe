<template>
  <section>
    <h2>{{ $t('app.pingApi') }}</h2>
    <button :disabled="loading" @click="doPing">{{ $t('app.pingButton') }}</button>
    <p v-if="error" style="color:red">{{ $t('app.errorPrefix') }}: {{ error }}</p>
    <pre v-if="data">{{ JSON.stringify(data, null, 2) }}</pre>
  </section>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { PingResult } from '@domain/ping';
import { performPing } from '@app/pingService';

const { t } = useI18n();
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
      error.value = t('app.unknownError');
    }
  } finally {
    loading.value = false;
  }
}
</script>
