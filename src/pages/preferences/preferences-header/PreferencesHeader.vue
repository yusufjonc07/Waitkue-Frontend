<template>
  <VaAvatar size="large" color="warning"><span class="text-4xl"> 👨‍💻 </span></VaAvatar>
  <div class="flex flex-col justify-center">
    <h2 class="text-[28px] font-bold leading-10 md:text-[32px]">{{ store.userName }}</h2>
    <div class="flex space-x-1 text-[13px] leading-4">
      <p>Member since</p>
      <p>{{ store.memberSince }}</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { useUserStore } from '../../../stores/user-store'

  const store = useUserStore()
</script>
