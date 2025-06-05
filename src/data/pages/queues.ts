import { NewQueue, Queue } from '../../pages/queues/types'
import api from '../../services/api'

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof Queue | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
  isActive: boolean
  search: string
}

export const getQueues = async (filters: Partial<Filters & Pagination & Sorting>) => {
  const { isActive, search } = filters
  let filteredQueues: Queue[] = await api.request(api.allQueues())

  if (isActive) {
    filteredQueues = filteredQueues.filter(queue => queue.step !== 3)
  } else {
    filteredQueues = filteredQueues.filter(queue => queue.step == 3)
  }

  if (search) {
    filteredQueues = filteredQueues.filter(
      queue =>
        queue.profile?.fullname.toLowerCase().includes(search.toLowerCase()) ||
        queue.queuename.toLowerCase().includes(search.toLowerCase()) ||
        queue.email.toLowerCase().includes(search.toLowerCase()),
    )
  }

  const { page = 1, perPage = 10 } = filters || {}
  return {
    data: filteredQueues,
    pagination: {
      page,
      perPage,
      total: filteredQueues.length,
    },
  }
}

export const getNumbers = async (date: string, service_id: number) => {
  return await api.request(api.numbers({ date, service_id }))
}

export const makeCall = async (id: number) => {
  return await api.request(api.call(id))
}

export const getWaitlist = async () => {
  return await api.request(api.waitlist())
}

export const addQueue = async (queue: NewQueue) => {
  const result = await api.request(api.allQueues(), { method: 'POST', body: JSON.stringify(queue) })

  if (!result.error) {
    return result
  }

  throw new Error(result.error)
}

export const updateQueue = async (queue: NewQueue) => {
  const cleanedQueue: any = { ...queue }

  // Replace nested objects with just their IDs
  if (typeof cleanedQueue.client === 'object' && cleanedQueue.client !== null) {
    cleanedQueue.client_id = cleanedQueue.client.id
    delete cleanedQueue.client
  }

  if (typeof cleanedQueue.service === 'object' && cleanedQueue.service !== null) {
    cleanedQueue.service_id = cleanedQueue.service.id
    delete cleanedQueue.service
  }

  const result = await api.request(api.queue(queue.id), {
    method: 'PUT',
    body: JSON.stringify(cleanedQueue),
  })

  if (!result.error) {
    return result
  }

  throw new Error(result.error)
}

export const removeQueue = async (queue: Queue) => {
  return api.request(api.queue(queue.id), { method: 'DELETE' })
}

export const uploadAvatar = async (body: FormData) => {
  return fetch(api.avatars(), { method: 'POST', body, redirect: 'follow' }).then(r => r.json())
}
