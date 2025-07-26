<template>
  <VaNavbar class="app-layout-navbar px-0 py-0">
    <template #left>
      <div class="left">
        <Transition v-if="isMobile && isAuthenticated" name="icon-fade" mode="out-in">
          <VaIcon
            color="primary"
            :name="isSidebarMinimized ? 'menu' : 'close'"
            size="24px"
            style="margin-top: 3px"
            @click="isSidebarMinimized = !isSidebarMinimized"
          />
        </Transition>
        <RouterLink to="/" aria-label="Visit home page">
            <h1 class="logo-text">Clinic<span>pro</span></h1>
        </RouterLink>
      </div>
    </template>
    <template #right>
      <AppNavbarActions class="app-navbar__actions" :is-mobile="isMobile" v-if="isAuthenticated" />
      <NavbarButtons v-if="!isAuthenticated && !isMobile" />
    </template>
  </VaNavbar>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useGlobalStore } from '../../stores/global-store'
  import { useAuthStore } from '../../stores/auth'
  import AppNavbarActions from './components/AppNavbarActions.vue'
import NavbarButtons from './components/NavbarButtons.vue'

  defineProps({
    isMobile: { type: Boolean, default: false },
  })

  const GlobalStore = useGlobalStore()
  const { isSidebarMinimized } = storeToRefs(GlobalStore)

  const AuthStore = useAuthStore()
  const { isAuthenticated } = storeToRefs(AuthStore)
  
</script>

<style lang="scss" scoped>

  

  .va-navbar {
    z-index: 2;
    box-shadow: 0 0 2px #aaa;

    @media screen and (max-width: 950px) {
      .left {
        width: 100%;
      }

      .app-navbar__actions {
        display: flex;
        justify-content: space-between;
      }
    }
  }

  .left {
    display: flex;
    align-items: center;
    margin-left: 1rem;

    & > * {
      margin-right: 1rem;
    }

    & > *:last-child {
      margin-right: 0;
    }
  }

  .icon-fade-enter-active,
  .icon-fade-leave-active {
    transition: transform 0.5s ease;
  }

  .icon-fade-enter,
  .icon-fade-leave-to {
    transform: scale(0.5);
  }

  .logo-text, .logo-text span{
    font-size: 2.5rem;
    font-weight: bold;
    font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif
  }
   .logo-text span{
    color: #154EC1;
   }
   
</style>
