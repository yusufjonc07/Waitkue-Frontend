<template>
  <div class="flex flex-col space-y-6 md:space-y-4">
    <h1 class="page-title">Settings</h1>
    <div class="flex flex-col space-y-4 rounded-lg bg-backgroundSecondary p-4">
      <h3 class="h3">Theme</h3>
      <ThemeSwitcher />
    </div>
    <div class="flex flex-col space-y-4 rounded-lg bg-backgroundSecondary p-4">
      <h3 class="h3">General preferences</h3>
      <LanguageSwitcher />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import LanguageSwitcher from './language-switcher/LanguageSwitcher.vue'
  import ThemeSwitcher from './theme-switcher/ThemeSwitcher.vue'
</script>
