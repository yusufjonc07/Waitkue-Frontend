// stores/auth.ts
import { defineStore } from 'pinia'
import { loginUser, registerUser, registerClient, fetchCurrentUser } from '../data/pages/auth'
import { NewClient, User } from '../pages/users/types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: JSON.parse(localStorage.getItem('user') || 'null') as User | null,
    token: localStorage.getItem('access_token') || '',
    isAuthenticated: !!localStorage.getItem('access_token'),
  }),

  actions: {
    async login(credentials: { email: string; password: string }) {
      const response = await loginUser(credentials) // should return { access_token, user }

      this.token = response.access_token
      this.currentUser = response.user
      this.isAuthenticated = true

      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('user', JSON.stringify(response.user))
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
