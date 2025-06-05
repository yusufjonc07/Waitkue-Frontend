import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useUserStore = defineStore('user', {
  state: () => {
    const authStore = useAuthStore()
    return {
      userName: authStore.currentUser?.profile?.fullname || authStore.currentUser?.username,
      email: authStore.currentUser?.email,
      memberSince: authStore.currentUser?.profile?.created_at,
      pfp: 'https://picsum.photos/id/23/200/300',
    }
  },

  actions: {
    changeUserName(userName: string) {
      this.userName = userName
    },
  },
})
