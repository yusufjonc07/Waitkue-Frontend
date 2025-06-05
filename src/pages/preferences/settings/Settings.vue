<template>
  <div
    class="flex min-h-[36px] flex-col space-y-2 leading-5 md:flex-row md:items-center md:space-x-6 md:space-y-0"
  >
    <p class="w-[200px] font-bold">Name</p>
    <div class="flex-1">
      <div class="max-w-[748px]">
        {{ store.userName }}
      </div>
    </div>
    <VaButton
      :style="buttonStyles"
      class="h-fit w-fit"
      preset="primary"
      @click="emits('openNameModal')"
    >
      Edit
    </VaButton>
  </div>
  <VaDivider />
  <div class="flex min-h-[36px] flex-col space-y-2 leading-5 md:flex-row md:space-x-6 md:space-y-0">
    <p class="w-[200px] font-bold">Email</p>
    <div class="flex-1">
      <div class="max-w-[748px]">
        {{ store.email }}
      </div>
    </div>
  </div>
  <div class="flex min-h-[36px] flex-col space-y-2 leading-5 md:flex-row md:space-x-6 md:space-y-0">
    <p class="w-[200px] font-bold">Password</p>
    <div class="flex-1">
      <div class="max-w-[748px]">•••••••••••••</div>
    </div>
    <VaButton
      :style="buttonStyles"
      class="h-fit w-fit"
      preset="primary"
      @click="emits('openResetPasswordModal')"
    >
      Reset Password
    </VaButton>
  </div>
  <VaDivider />
  <div class="flex min-h-[36px] flex-col space-y-2 leading-5 md:flex-row md:space-x-6 md:space-y-0">
    <p class="w-[200px] font-bold">Email subscriptions</p>
    <div class="flex-1">
      <div class="max-w-[748px]">
        <p>To manage what emails you get, visit the</p>
        <div class="flex w-fit space-x-1">
          <RouterLink :to="{ name: 'settings' }" class="font-semibold text-primary"
            >Notification settings</RouterLink
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { useUserStore } from '../../../stores/user-store'
  import { buttonStyles } from '../styles'

  const store = useUserStore()

  const emits = defineEmits(['openNameModal', 'openResetPasswordModal'])
</script>
