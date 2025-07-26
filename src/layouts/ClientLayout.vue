<template>
  <VaLayout
    :top="{ fixed: true, order: 2 }"
    :left="{
      fixed: true,
      absolute: breakpoints.mdDown,
      order: 1,
      overlay: breakpoints.mdDown && !isSidebarMinimized,
    }"
    @leftOverlayClick="isSidebarMinimized = true"
  >
    <template #top>
      <AppNavbar :is-mobile="isMobile" />
    </template>

    <template #content>
      <main>
        <article>
          <RouterView />
        </article>
      </main>
    </template>
  </VaLayout>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref, computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { onBeforeRouteUpdate } from 'vue-router'
  import { useBreakpoint } from 'vuestic-ui'

  import { useGlobalStore } from '../stores/global-store'

  import AppNavbar from '../components/navbar/AppNavbar.vue'

  const GlobalStore = useGlobalStore()
  const breakpoints = useBreakpoint()
  const sidebarWidth = ref('16rem')
  const sidebarMinimizedWidth = ref(undefined)

  const isMobile = ref(false)
  const isTablet = ref(false)
  const { isSidebarMinimized } = storeToRefs(GlobalStore)

  const onResize = () => {
    isSidebarMinimized.value = breakpoints.mdDown
    isMobile.value = breakpoints.smDown
    isTablet.value = breakpoints.mdDown
    sidebarMinimizedWidth.value = isMobile.value ? '0' : '4.5rem'
    sidebarWidth.value = isTablet.value ? '100%' : '16rem'
  }

  onMounted(() => {
    window.addEventListener('resize', onResize)
    onResize()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize)
  })
  
  onBeforeRouteUpdate(() => {
    if (breakpoints.mdDown) {
      isSidebarMinimized.value = true
    }
  })

</script>

<style lang="scss" scoped>
  // Prevent icon jump on animation
  .va-sidebar {
    width: unset !important;
    min-width: unset !important;
  }
</style>
