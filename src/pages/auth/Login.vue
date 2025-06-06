<template>
  <VaForm ref="form" @submit.prevent="submit">
    <h1 class="mb-4 text-4xl font-semibold">Log in</h1>
    <p class="mb-4 text-base leading-5">
      New to Vuestic?
      <RouterLink :to="{ name: 'signup' }" class="font-semibold text-primary">Sign up</RouterLink>
    </p>
    <VaInput
      v-model="formData.email"
      :rules="[validators.required]"
      class="mb-4"
      label="Username or Email"
      type="text"
    />
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        v-model="formData.password"
        :rules="[validators.required]"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Password"
        @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
      >
        <template #appendInner>
          <VaIcon
            :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
            class="cursor-pointer"
            color="secondary"
          />
        </template>
      </VaInput>
    </VaValue>

    <div
      class="auth-layout__options flex flex-col items-start justify-between sm:flex-row sm:items-center"
    >
      <VaCheckbox
        v-model="formData.keepLoggedIn"
        class="mb-2 sm:mb-0"
        label="Keep me signed in on this device"
      />
      <RouterLink
        :to="{ name: 'recover-password' }"
        class="mt-2 font-semibold text-primary sm:ml-1 sm:mt-0"
      >
        Forgot password?
      </RouterLink>
    </div>

    <div class="mt-4 flex justify-center">
      <VaButton class="w-full" :loading="isLoading" type="submit"> Login</VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'
  import { useForm } from 'vuestic-ui'
  import { validators } from '../../services/utils'
  import { useAuth } from './composables/useAuth'
  import { useAuthStore } from '../../stores/auth'
  const { validate } = useForm('form')
  import { useRouter } from 'vue-router'
const router = useRouter()

  const formData = reactive({
    email: '',
    password: '',
    keepLoggedIn: false,
  })

  const { login, isLoading } = useAuth()
  async function submit() {
    if (!validate()) return

    try {
      await login(formData.email, formData.password)
      const auth = useAuthStore()
      if (auth.isAuthenticated) {
        router.go(0)
      }
    } catch (error) {
      console.error('Login failed:', error)
    }
  }
</script>
