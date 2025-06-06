const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
import mitt from 'mitt'

export const emitter = mitt()
export default {
  // Endpoints...
  login: () => `${apiBaseUrl}/token`,
  logout: () => `${apiBaseUrl}/token`,
  register: () => `${apiBaseUrl}/signup`,
  me: () => `${apiBaseUrl}/me`,
  allUsers: () => `${apiBaseUrl}/user`,
  allClients: () => `${apiBaseUrl}/user/clients`,
  client: () => `${apiBaseUrl}/client`,
  user: (id: string) => `${apiBaseUrl}/user/${id}`,
  users: ({ page, pageSize }: { page: number; pageSize: number }) =>
    `${apiBaseUrl}/users/?page=${page}&pageSize=${pageSize}`,
  allQueues: () => `${apiBaseUrl}/queue`,
  numbers: ({ date, service_id }: { date: string; service_id: number }) =>
    `${apiBaseUrl}/queue/reservables/list?date=${date}&service_id=${service_id}`,
  allServices: () => `${apiBaseUrl}/service`,
  service: (id: number) => `${apiBaseUrl}/service/${id}`,
  waitlist: () => `${apiBaseUrl}/waitlist`,
  call: (queue_id: number) => `${apiBaseUrl}/call/${queue_id}`,
  finish: (queue_id: number) => `${apiBaseUrl}/finish/${queue_id}`,
  queue: (id: number) => `${apiBaseUrl}/queue/${id}`,
  reportQueues: (year: number) => `${apiBaseUrl}/report/queues/${year}`,
  allProjects: () => `${apiBaseUrl}/projects`,
  project: (id: string) => `${apiBaseUrl}/projects/${id}`,
  projects: ({ page, pageSize }: { page: number; pageSize: number }) =>
    `${apiBaseUrl}/projects/?page=${page}&pageSize=${pageSize}`,
  avatars: () => `${apiBaseUrl}/avatars`,

  // Generic Request Handler
  request: async (url: string, options: RequestInit = {}) => {
    const { useAuthStore } = await import('../stores/auth') // <-- Lazy import fixes circular deps
    const authStore = useAuthStore()
    const token = authStore.token
    const logoutAuth = authStore.logout

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...(options.headers || {}),
        },
      })

      if (response.status === 401) {
        await logoutAuth()
        emitter.emit('unauthorized')
      }

      return await response.json()
    } catch (error) {
      console.error('Request failed:', error)
      throw error
    }
  },
}
