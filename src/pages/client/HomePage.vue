<template>
  <div>
    <HeaderSection />
    <!-- <VaCarousel v-model="value" :items="items" height="600px" /> -->
    <ServicesSection />
    <MyTicketsSection v-if="auth.isAuthenticated" />
       <h1  v-else><span>#2</span> Oops, login to see your tickets</h1>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ServicesSection from './widgets/ServicesSection.vue'
import MyTicketsSection from './widgets/MyTicketsSection.vue'
import { useAuthStore } from '../../stores/auth'
import HeaderSection from './widgets/HeaderSection.vue'
import CarouselServices from './widgets/CarouselServices.vue'

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