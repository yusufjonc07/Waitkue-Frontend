<template>
    <div class="navbar-buttons">
        <VaButton size="large" color="onTransparent" icon="phone" href="tel:119" text-color="dark">
            {{ t("navbar.contact") }}
        </VaButton>
        <VaButton size="large" href="/auth">
            {{ t("navbar.signup_login") }}
        </VaButton>
    </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

</script>

<style scoped>
.navbar-buttons {
    display: flex;
    gap: 10px;
    margin-right: 1rem;
}
</style>