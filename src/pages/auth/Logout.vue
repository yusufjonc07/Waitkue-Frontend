<template>
  <div>
    <h1>You are being logged out...</h1>
    <h1>Redirecting to login...</h1>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { useAuth } from './composables/useAuth'
  const { logout } = useAuth()
  onMounted(async () => {
    setTimeout(async () => {
      await logout()
       window.location.href = '/'
    }, 1000)
  })
</script>
