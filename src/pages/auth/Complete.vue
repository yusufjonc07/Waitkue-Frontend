<template>
  <template>
    <VaStepper v-model="step" :steps="steps">
      <template #step-content-0>
        <ul>
          <li>Select a category</li>
          <li>Browse products</li>
          <li>Add to cart</li>
        </ul>
      </template>
      <template #step-content-1>
        <ul>
          <li>Fill out shipping information</li>
          <li>Choose payment method</li>
        </ul>
      </template>
      <template #step-content-2>
        <ul>
          <li>View order summary</li>
          <li>Edit shipping information</li>
        </ul>
      </template>
      <template #step-content-3>
        <ul>
          <li>Review order details</li>
          <li>Complete payment</li>
        </ul>
      </template>
    </VaStepper>
  </template>
  <VaForm ref="form" @submit.prevent="submit">
    <h1 class="mb-4 text-3xl font-semibold">
      Sign up as {{ roleOptions.find(r => r.value === formData.role)?.label }}
    </h1>
    <p class="mb-4 text-base leading-5">
      Have an account?
      <RouterLink :to="{ name: 'login' }" class="font-semibold text-primary">Login</RouterLink>
    </p>
    <VaButtonToggle
      v-model="formData.role"
      toggle-color="textPrimary"
      class="mb-3"
      :options="roleOptions"
    />
    <VaInput
      v-model="formData.email"
      :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Invalid email format']"
      class="mb-4"
      label="Email"
      type="email"
    />

    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        ref="password1"
        v-model="formData.password"
        :rules="passwordRules"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Password"
        messages="Password should be 8+ characters with letters, numbers, and special characters."
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

      <VaInput
        ref="password2"
        v-model="formData.repeatPassword"
        :rules="[
          v => !!v || 'Repeat Password is required',
          v => v === formData.password || 'Passwords do not match',
        ]"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Repeat Password"
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

    <div class="mt-4 flex justify-center">
      <VaButton class="w-full" :loading="isLoading" @click="submit">Create account</VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { useForm, useToast } from 'vuestic-ui'
  import { useAuth } from './composables/useAuth'
  import { UserRole } from '../users/types'

  const { validate } = useForm('form')
  const { push } = useRouter()
  const { init } = useToast()

  import { ref } from 'vue'

  const step = ref(0)

  const steps = [
    { label: 'Choose your product' },
    { label: 'Checkout' },
    { label: 'Review order' },
    { label: 'Confirm and pay' },
  ]

  const formData = reactive<{
    username: string
    phone: string
    email: string
    role: UserRole
    password: string
    repeatPassword: string
  }>({
    username: '',
    phone: '',
    email: '',
    role: 'client',
    password: '',
    repeatPassword: '',
  })

  const roleOptions = [
    { label: 'Client', value: 'client' },
    { label: 'Service Admin', value: 'service_admin' },
  ]

  const { signup, isLoading } = useAuth()
  const submit = () => {
    if (validate()) {
      signup(formData.email, formData.password, formData.role)
      init({
        message: "You've successfully signed up",
        color: 'success',
      })
      push({ name: 'dashboard' })
    }
  }

  const passwordRules: ((v: string) => boolean | string)[] = [
    v => !!v || 'Password field is required',
    v => (v && v.length >= 8) || 'Password must be at least 8 characters long',
    v => (v && /[A-Za-z]/.test(v)) || 'Password must contain at least one letter',
    v => (v && /\d/.test(v)) || 'Password must contain at least one number',
    v =>
      (v && /[!@#$%^&*(),.?":{}|<>]/.test(v)) ||
      'Password must contain at least one special character',
  ]
</script>
