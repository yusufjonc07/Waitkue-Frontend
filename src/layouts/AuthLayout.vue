<template>
  <VaLayout v-if="breakpoint.lgUp" class="h-screen bg-[var(--va-background-secondary)]">
    <template #left>
      <RouterLink
        class="flex h-full items-center justify-center"
        style="width: 35vw"
        to="/"
        aria-label="Visit homepage"
      >
        <VaImage src="/waitkue-logo.png" style="height: 60px; width: 220px" />
      </RouterLink>
    </template>
    <template #content>
      <main class="mx-auto flex h-full max-w-[420px] items-center justify-center">
        <RouterView />
      </main>
    </template>
  </VaLayout>

  <VaLayout v-else class="h-screen bg-[var(--va-background-secondary)]">
    <template #content>
      <div class="p-4">
        <main class="mx-auto flex h-full max-w-[420px] flex-row items-center justify-start">
          <div class="flex flex-col items-start">
            <RouterLink class="py-4" to="/" aria-label="Visit homepage">
              <VuesticLogo class="mb-2" start="#0E41C9" />
            </RouterLink>
            <RouterView />
          </div>
        </main>
      </div>
    </template>
  </VaLayout>
</template>

<script lang="ts" setup>
  import { useBreakpoint } from 'vuestic-ui'
  import VuesticLogo from '../components/VuesticLogo.vue'

  const breakpoint = useBreakpoint()
</script>
