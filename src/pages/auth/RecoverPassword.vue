<template>
  <VaForm ref="passwordForm" @submit.prevent="submit">
    <h1 class="mb-4 text-4xl font-semibold">Forgot your password?</h1>
    <p class="mb-4 text-base leading-5">
      If you've forgotten your password, don't worry. Simply enter your email address below, and
      we'll send you an email with a temporary password. Restoring access to your account has never
      been easier.
    </p>
    <VaInput
      v-model="email"
      :rules="[v => !!v || 'Email field is required']"
      class="mb-4"
      label="Enter your email"
      type="email"
    />
    <VaButton class="mb-2 w-full" @click="submit">Send password</VaButton>
    <VaButton :to="{ name: 'login' }" class="w-full" preset="secondary" @click="submit"
      >Go back</VaButton
    >
  </VaForm>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useForm } from 'vuestic-ui'
  import { useRouter } from 'vue-router'

  const email = ref('')
  const form = useForm('passwordForm')
  const router = useRouter()

  const submit = () => {
    if (form.validate()) {
      router.push({ name: 'recover-password-email' })
    }
  }
</script>
