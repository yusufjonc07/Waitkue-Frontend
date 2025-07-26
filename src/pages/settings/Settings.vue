<template>
  <div class="flex flex-col space-y-6 md:space-y-4">
    <h1 class="page-title">{{ t("user.settings") }}</h1>
    <div class="flex flex-col space-y-4 rounded-lg bg-backgroundSecondary p-4">
      <h3 class="h3">{{ t("add.theme") }}</h3>
      <ThemeSwitcher />
    </div>
    <div class="flex flex-col space-y-4 rounded-lg bg-backgroundSecondary p-4">
      <h3 class="h3">{{ t("add.general_preferences") }}</h3>
      <LanguageSwitcher />
    </div>
  </div>
</template>
<script lang="ts" setup>
import LanguageSwitcher from './language-switcher/LanguageSwitcher.vue'
import ThemeSwitcher from './theme-switcher/ThemeSwitcher.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
