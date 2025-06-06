<template>
  <div>
    <VaCarousel v-model="value" :items="items" height="600px" />
    <ServicesSection />
    <MyTicketsSection v-if="auth.isAuthenticated" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ServicesSection from './widgets/ServicesSection.vue'
import MyTicketsSection from './widgets/MyTicketsSection.vue'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()

const value = ref(0)
const items = ['/logo-banner.png', '/waiting-people.png', '/WAITKUE.jpg', 'people-checking.webp']
</script>
