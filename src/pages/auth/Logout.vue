<template>
  <div>
    <h1>You are being logged out...</h1>
    <h1>Redirecting to login...</h1>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { useAuth } from './composables/useAuth'
  import { useRouter } from 'vue-router'
  const { logout } = useAuth()
  const router = useRouter()
  onMounted(async () => {
    setTimeout(async () => {
      await logout()
      router.go(0)
    }, 1000)
  })
</script>
