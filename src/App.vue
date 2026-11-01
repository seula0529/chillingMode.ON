<script setup>
import { ref } from 'vue'
import MobileFlow from './components/MobileFlow.vue'
import DesktopSheet from './components/DesktopSheet.vue'
import DoneScreen from './components/DoneScreen.vue'
import { useMediaQuery } from './composables/useMediaQuery'
import { useSignupForm } from './composables/useSignupForm'
import { submitApplication } from './services/submitApplication'

const isMobile = useMediaQuery('(max-width: 767px)')
const { buildPayload } = useSignupForm()

// idle | sending | error | done
const status = ref('idle')

async function submit() {
  if (status.value === 'sending') return
  const payload = buildPayload()

  // 숨김 필드가 채워졌다면 봇으로 보고 조용히 완료 처리
  if (payload.website) {
    status.value = 'done'
    return
  }
  delete payload.website

  status.value = 'sending'
  try {
    await submitApplication(payload)
    status.value = 'done'
    window.scrollTo({ top: 0 })
  } catch (err) {
    console.error(err)
    status.value = 'error'
  }
}
</script>

<template>
  <DoneScreen v-if="status === 'done'" />
  <MobileFlow v-else-if="isMobile" :status="status" @submit="submit" />
  <DesktopSheet v-else :status="status" @submit="submit" />
</template>
