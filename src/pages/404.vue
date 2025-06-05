<script lang="ts" setup>
  import VuesticLogo from '../components/VuesticLogo.vue'
  import NotFoundImage from '../components/NotFoundImage.vue'
</script>

<template>
  <div
    class="flex h-screen flex-col items-center justify-between bg-[var(--va-background-secondary)]"
  >
    <RouterLink to="/">
      <VuesticLogo :gradient="false" class="my-8 h-5" />
    </RouterLink>

    <div class="my-8 flex flex-col items-center gap-6 px-4">
      <NotFoundImage />
      <h1 class="va-h1 text-center text-4xl sm:text-5xl">Page not found</h1>

      <p class="text-center">
        The page you are looking for might have been removed had its name changed or is temporarily
        unavailable.
      </p>

      <div class="flex flex-col gap-4 sm:flex-row">
        <VaButton to="/">Go to homepage</VaButton>
        <VaButton
          href="https://github.com/epicmaxco/vuestic-admin/issues/new"
          preset="secondary"
          target="_blank"
          >Create a GitHub issue
        </VaButton>
      </div>
    </div>

    <div />
  </div>
</template>
