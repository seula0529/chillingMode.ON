<script setup>
import { onMounted, ref } from 'vue'
import ChillMascot from './ChillMascot.vue'
import { LINES } from '../questions'

const title = ref(null)
onMounted(() => title.value?.focus())
</script>

<template>
  <main class="done">
    <ChillMascot class="done__mascot" variant="side" mood="happy" :line="LINES.done" />
    <h1 ref="title" class="t-title" tabindex="-1">신청이 접수됐어요</h1>
    <p>모임장이 확인 후 남겨주신 연락처로 일정을 안내해 드릴게요.<br />그때까지 잠깐, 칠링모드 ON.</p>
  </main>
</template>

<style scoped>
.done {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 15px;
  padding: 40px 20px;
  max-width: 560px;
  margin: 0 auto;
}

.done h1:focus {
  outline: none;
}

.done__mascot {
  margin-bottom: 15px;
}

.done__mascot :deep(.mascot__bubble) {
  border-color: var(--ink);
}
</style>
