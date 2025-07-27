<template>
  <div>
    <HeaderSection />
    <StepsSection/>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import HeaderSection from './widgets/HeaderSection.vue'
import StepsSection from './widgets/StepsSection.vue'

const auth = useAuthStore()

const value = ref(0)
const items = ['/logo-banner.png', '/waiting-people.png', '/WAITKUE.jpg', 'people-checking.webp']
</script>

<style lang="scss">
  h1 {
    font-size: 3rem;
    margin: 40px auto;
    text-align: center;

    span {
      color: #154EC1;
    }
  }
</style>