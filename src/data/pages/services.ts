import { Service } from '../../pages/services/types'
import api from '../../services/api'

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof Service | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
  search: string
}

export const getServices = async (filters: Partial<Filters & Pagination & Sorting>) => {
  const { search } = filters
  let filteredServices: Service[] = await api.request(api.allServices())

  if (search) {
    filteredServices = filteredServices.filter(
      service =>
        service.name.toLowerCase().includes(search.toLowerCase()) ||
        service.description.toLowerCase().includes(search.toLowerCase()),
    )
  }

  const { page = 1, perPage = 10 } = filters || {}
  return {
    data: filteredServices,
    pagination: {
      page,
      perPage,
      total: filteredServices.length,
    },
  }
}

export const addService = async (service: Service) => {
  const result = await api.request(api.allServices(), {
    method: 'POST',
    body: JSON.stringify(service),
  })

  if (!result.error) {
    return result
  }

  throw new Error(result.error)
}

export const updateService = async (service: Service) => {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  const result = await api.request(api.service(service.id), {
    method: 'PUT',
    body: JSON.stringify(service),
  })

  if (!result.error) {
    return result
  }

  throw new Error(result.error)
}

export const removeService = async (service: Service) => {
  return fetch(api.service(service.id), { method: 'DELETE' })
}
