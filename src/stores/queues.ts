import { defineStore } from 'pinia'
import {
  addQueue,
  type Filters,
  getQueues,
  getNumbers,
  Pagination,
  removeQueue,
  Sorting,
  updateQueue,
  getWaitlist,
  makeCall,
} from '../data/pages/queues'
import { Queue, AvailableNumber, Waitlist, NewQueue } from '../pages/queues/types'

export const useQueuesStore = defineStore('queues', {
  state: () => {
    return {
      items: [] as Queue[],
      waitlist: {} as Waitlist,
      numbers: [] as AvailableNumber[],
      pagination: { page: 1, perPage: 10, total: 0 },
    }
  },

  actions: {
    async getAll(options: {
      pagination?: Pagination
      sorting?: Sorting
      filters?: Partial<Filters>
    }) {
      const { data, pagination } = await getQueues({
        ...options.filters,
        ...options.sorting,
        ...options.pagination,
      })
      this.items = data
      this.pagination = pagination
    },
    async getAvailableNumbers(date: string, service_id: number) {
      this.numbers = await getNumbers(date, service_id)
    },
    async getWaitlistData() {
      this.waitlist = await getWaitlist()
    },
    async callTicket(id: number) {
      await makeCall(id)
    },

    async add(queue: NewQueue) {
      const newQueue = await addQueue(queue)
      this.items.unshift(newQueue)
      return newQueue
    },

    async update(queue: Queue) {
      const updatedQueue = await updateQueue(queue)
      const index = this.items.findIndex(({ id }) => id === queue.id)
      this.items.splice(index, 1, updatedQueue)
      return updatedQueue
    },

    async remove(queue: Queue) {
      const isRemoved = await removeQueue(queue)

      if (isRemoved) {
        const index = this.items.findIndex(({ id }) => id === queue.id)
        this.items.splice(index, 1)
      }
    },
  },
})
