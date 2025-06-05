<template>
  <div>
    <h1 class="mb-4 text-4xl font-semibold">Check the email</h1>
    <p class="mb-4 text-base leading-5">
      Password reset instructions have been sent to your email. Check your inbox, including the spam
      folder if needed. For assistance, <span class="va-link">contact support</span>.
    </p>

    <div class="mt-4 flex justify-center">
      <VaButton :to="{ name: 'login' }" class="w-full">Back to login</VaButton>
    </div>
  </div>
</template>

<script lang="ts" setup></script>
