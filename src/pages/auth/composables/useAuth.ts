import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth' // Adjust to your actual auth store path
import { Client, NewClient, UserRole } from '../../users/types'

export const useAuth = () => {
  const isLoading = ref(false)
  const error = ref<unknown | null>(null)
  const router = useRouter()
  const authStore = useAuthStore()

  const login = async (email: string, password: string, keepLoggedIn: boolean) => {
    isLoading.value = true
    error.value = null
    try {
      
      await authStore.login({ email, password, keepLoggedIn })
    } catch (err) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  const signup = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null
    try {
      await authStore.signup({ email, password })
    } catch (err) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }
  const addClient = async (formData: NewClient) => {
    isLoading.value = true
    error.value = null
    try {
      await authStore.addClient(formData)
    } catch (err) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    try {
      await authStore.logout()
    } catch (err) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  const fetchCurrentUser = async () => {
    isLoading.value = true
    try {
      await authStore.fetchCurrentUser()
    } catch (err) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    login,
    signup,
    addClient,
    logout,
    fetchCurrentUser,
    currentUser: authStore.currentUser,
    isAuthenticated: authStore.isAuthenticated,
  }
}
