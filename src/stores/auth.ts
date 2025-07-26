// stores/auth.ts
import { defineStore } from 'pinia'
import { loginUser, registerUser, registerClient, fetchCurrentUser } from '../data/pages/auth'
import { NewClient, User } from '../pages/users/types'

export const useAuthStore = defineStore('auth', {
  state: () => {
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token') || ''
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null') as User | null
  return {
    token,
    currentUser: user,
    isAuthenticated: !!token,
  }
},

  actions: {
    async login(credentials: { email: string; password: string, keepLoggedIn: boolean }) {
      const response = await loginUser(credentials) // should return { access_token, user }

      this.token = response.access_token
      this.currentUser = response.user
      this.isAuthenticated = true


     if (credentials.keepLoggedIn) {
  localStorage.setItem('access_token', response.access_token)
  localStorage.setItem('user', JSON.stringify(response.user))
} else {
  sessionStorage.setItem('access_token', response.access_token)
  sessionStorage.setItem('user', JSON.stringify(response.user))
}
     
    },

    async signup(data: { email: string; password: string }) {
      await registerUser(data)
    },

    async addClient(data: NewClient) {
      return await registerClient(data)
    },

    async logout() {
      this.token = ''
      this.currentUser = null
      this.isAuthenticated = false
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      console.log('Credentials were cleared')
    },

    async fetchCurrentUser() {
      const user = await fetchCurrentUser()
      this.currentUser = user
      this.isAuthenticated = true
    },
  },
})
