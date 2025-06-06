<template>
  <div class="flex-column">
    <h1 class="mb-4 text-3xl font-semibold">Sign up</h1>
    <p class="mb-4 text-base leading-5">
      Have an account?
      <RouterLink :to="{ name: 'login' }" class="font-semibold text-primary">Login</RouterLink>
    </p>

    <VaStepper ref="actionStepper" v-model="step" :steps="steps">
      <!-- Step 1: Account Info -->
      <template #step-content-0>
        <VaForm ref="form" @submit.prevent="submit1">
          <VaInput v-model="formData.email" :rules="[
            v => !!v || 'Email is required',
            v => /.+@.+\..+/.test(v) || 'Invalid email format',
          ]" class="mb-4" label="Email" type="email" />

          <VaValue v-slot="isPasswordVisible" :default-value="false">
            <VaInput v-model="formData.password" :rules="passwordRules"
              :type="isPasswordVisible.value ? 'text' : 'password'" class="mb-4" label="Password"
              messages="Password should be 8+ characters with letters, numbers, and special characters."
              @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value">
              <template #appendInner>
                <VaIcon :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'" class="cursor-pointer"
                  color="secondary" />
              </template>
            </VaInput>

            <VaInput v-model="formData.repeatPassword" :rules="[
              v => !!v || 'Repeat Password is required',
              v => v === formData.password || 'Passwords do not match',
            ]" :type="isPasswordVisible.value ? 'text' : 'password'" class="mb-4" label="Repeat Password"
              @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value">
              <template #appendInner>
                <VaIcon :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'" class="cursor-pointer"
                  color="secondary" />
              </template>
            </VaInput>
          </VaValue>
        </VaForm>
      </template>

      <!-- Step 2: Profile Details -->
      <template #step-content-1>
        <VaForm ref="form2" @submit.prevent="submit2">
          <VaInput v-model="formData2.firstname" label="First Name" class="mb-4"
            :rules="[v => !!v || 'First name is required']" />
          <VaInput v-model="formData2.surename" label="Surname" class="mb-4"
            :rules="[v => !!v || 'Surname is required']" />
          <VaInput v-model="formData2.middlename" label="Middle Name" class="mb-4" />
          <VaSelect v-model="formData2.gender" label="Gender" class="mb-4" :options="['Male', 'Female', 'Other']"
            :rules="[v => !!v || 'Gender is required']" />
        </VaForm>
      </template>
    </VaStepper>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast, defineVaStepperSteps } from 'vuestic-ui'
import { useAuth } from './composables/useAuth'
import { useAuthStore } from '../../stores/auth'
import { format } from 'path'

const step = ref(0)
const { push } = useRouter()
const { init } = useToast()
const { login, signup, addClient, isLoading } = useAuth()

// Form validation
const { validate } = useForm('form')
const { validate: validate2 } = useForm('form2')

// Step 1: Email & Password
const formData = reactive({
  email: '',
  password: '',
  repeatPassword: '',
})

// Step 2: Profile Info
const formData2 = reactive({
  firstname: '',
  surename: '',
  middlename: '',
  user_id: 0,
  gender: 'male',
})

const authStore = useAuthStore()

// Password rules
const passwordRules = [
  (v: string) => !!v || 'Password field is required',
  (v: string) => v.length >= 8 || 'Password must be at least 8 characters long',
  (v: string) => /[A-Za-z]/.test(v) || 'Password must contain at least one letter',
  (v: string) => /\d/.test(v) || 'Password must contain at least one number',
  (v: string) =>
    /[!@#$%^&*(),.?":{}|<>]/.test(v) || 'Password must contain at least one special character',
]

// Submit step 1
const submit1 = async () => {
  const isValid = await validate()
  if (isValid) {
    try {
      await signup(formData.email, formData.password)
      await login(formData.email.split('@')[0], formData.password)
      init({ message: 'Account created successfully!', color: 'success' })
    } catch (error: any) {
      init({ message: error.message || 'Sign-up failed. Try again.', color: 'danger' })
      throw error
    }
  } else {
    throw new Error('Form validation failed.')
  }
}

// Submit step 2
const submit2 = async () => {
  const isValid = await validate2()
  if (isValid) {
    try {
      formData2.user_id = authStore.currentUser?.id || 0
      await addClient(formData2)
      init({ message: "You've successfully signed up!", color: 'success' })
      push({ name: 'dashboard' })
    } catch (error: any) {
      init({ message: error.message || 'Profile creation failed.', color: 'danger' })
    }
  }
}

// Stepper logic
const steps = ref(
  defineVaStepperSteps([
    {
      label: 'User Account',
      beforeLeave: async (fromStep, toStep) => {
        if (fromStep !== toStep) {
          try {
            await submit1()
            return true
          } catch {
            return false
          }
        }
        return true
      },
    },
    {
      label: 'Profile Details',
      beforeLeave: async () => {
        try {
          await submit2()
          return true
        } catch {
          return false
        }
      },
    },
  ]),
)
</script>
