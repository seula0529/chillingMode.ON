<script setup>
defineProps({
  line: { type: String, required: true },
  // 'side': PC 왼쪽 패널(초록 배경), 'top': 모바일 상단, 'cover': 모바일 첫 화면
  variant: { type: String, default: 'top' },
  mood: { type: String, default: 'calm' }, // calm | oops | happy
})
</script>

<template>
  <div class="mascot" :class="[`mascot--${variant}`, `mascot--${mood}`]">
    <img class="mascot__art" src="../assets/img_mascot.png" width="960" height="1280" alt="" aria-hidden="true" />

    <Transition name="bubble" mode="out-in">
      <p :key="line" class="mascot__bubble t-voice" aria-live="polite">{{ line }}</p>
    </Transition>
  </div>
</template>

<style scoped>
.mascot {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 원본 이미지 비율 3:4 (960×1280) — 너비만 정하고 높이는 비율로 맞춥니다. */
.mascot__art {
  flex: none;
  display: block;
  width: 60px;
  height: auto;
  aspect-ratio: 3 / 4;
  object-fit: contain;
}

.mascot--oops .mascot__art {
  animation: wobble 0.4s ease-in-out 2;
}

.mascot--happy .mascot__art {
  animation: hop 0.6s ease-out 2;
}

.mascot__bubble {
  position: relative;
  padding: 10px 15px;
  border: var(--line) solid var(--ink);
  border-radius: 18px 18px 18px 4px;
  background: var(--ivory);
  color: var(--ink);
  margin-bottom: 20px;
}

.mascot--side {
  gap: 15px;
}

.mascot--side .mascot__art {
  width: 120px;
}

.mascot--side .mascot__bubble {
  margin: 0;
  border-radius: 4px 22px 22px 22px;
  border-color: var(--ivory);
  padding: 15px 20px;
}

.mascot--cover {
  flex-direction: column-reverse;
  align-items: center;
  gap: 5px;
}

.mascot--cover .mascot__art {
  width: 150px;
}

.mascot--cover .mascot__bubble {
  margin: 0;
  border-radius: 22px 22px 22px 22px;
}

@keyframes wobble {
  25% {
    transform: rotate(-8deg);
  }
  75% {
    transform: rotate(8deg);
  }
}

@keyframes hop {
  40% {
    transform: translateY(-8px);
  }
}

.bubble-enter-active,
.bubble-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.bubble-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.bubble-leave-to {
  opacity: 0;
}
</style>
