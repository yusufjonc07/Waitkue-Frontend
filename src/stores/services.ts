import { defineStore } from 'pinia'
import {
  addService,
  type Filters,
  getServices,
  Pagination,
  removeService,
  Sorting,
  updateService,
} from '../data/pages/services'
import { Service } from '../pages/services/types'

export const useServiceStore = defineStore('services', {
  state: () => {
    return {
      items: [] as Service[],
      pagination: { page: 1, perPage: 10, total: 0 },
    }
  },

  actions: {
    async getAll(options: {
      pagination?: Pagination
      sorting?: Sorting
      filters?: Partial<Filters>
    }) {
      const { data, pagination } = await getServices({
        ...options.filters,
        ...options.sorting,
        ...options.pagination,
      })
      this.items = data
      this.pagination = pagination
    },

    async add(service: Service) {
      const [newService] = await addService(service)
      this.items.unshift(newService)
      return newService
    },

    async update(service: Service) {
      const updatedService = await updateService(service)
      const index = this.items.findIndex(({ id }) => id === service.id)
      this.items.splice(index, 1, updatedService)
      return updatedService
    },

    async remove(service: Service) {
      const isRemoved = await removeService(service)

      if (isRemoved) {
        const index = this.items.findIndex(({ id }) => id === service.id)
        this.items.splice(index, 1)
      }
    },
  },
})
