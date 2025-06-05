import { Ref, ref, unref, watch, computed } from 'vue'
import { v4 as uuid } from 'uuid'
import type { Filters, Pagination, Sorting } from '../../../data/pages/services'
import { Service } from '../types'
import { useServiceStore } from '../../../stores/services'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'fullname', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ isActive: true, search: '' })

export const useServices = (options?: {
  pagination?: Ref<Pagination>
  sorting?: Ref<Sorting>
  filters?: Ref<Partial<Filters>>
}) => {
  const isLoading = ref(false)
  const error = ref()
  const servicesStore = useServiceStore()

  const {
    filters = makeFiltersRef(),
    sorting = makeSortingRef(),
    pagination = makePaginationRef(),
  } = options || {}

  const fetch = async () => {
    isLoading.value = true
    try {
      await servicesStore.getAll({
        filters: unref(filters),
        sorting: unref(sorting),
        pagination: unref(pagination),
      })
      pagination.value = servicesStore.pagination
    } finally {
      isLoading.value = false
    }
  }

  watch(
    filters,
    () => {
      // Reset pagination to first page when filters changed
      pagination.value.page = 1
      fetch()
    },
    { deep: true },
  )

  fetch()

  const services = computed(() => {
    const getSortItem = (obj: any, sortBy: string) => {
      return obj[sortBy]
    }

    const paginated = servicesStore.items.slice(
      (pagination.value.page - 1) * pagination.value.perPage,
      pagination.value.page * pagination.value.perPage,
    )

    if (sorting.value.sortBy && sorting.value.sortingOrder) {
      paginated.sort((a, b) => {
        const first = getSortItem(a, sorting.value.sortBy!)
        const second = getSortItem(b, sorting.value.sortBy!)
        if (first > second) {
          return sorting.value.sortingOrder === 'asc' ? 1 : -1
        }
        if (first < second) {
          return sorting.value.sortingOrder === 'asc' ? -1 : 1
        }
        return 0
      })
    }
    return paginated
  })

  return {
    error,
    isLoading,
    filters,
    sorting,
    pagination,

    services,

    fetch,

    async add(service: Service) {
      isLoading.value = true
      try {
        return await servicesStore.add(service)
      } catch (e) {
        error.value = e
      } finally {
        isLoading.value = false
      }
    },

    async update(service: Service) {
      isLoading.value = true
      try {
        return await servicesStore.update(service)
      } catch (e) {
        error.value = e
      } finally {
        isLoading.value = false
      }
    },

    async remove(service: Service) {
      isLoading.value = true
      try {
        return await servicesStore.remove(service)
      } catch (e) {
        error.value = e
      } finally {
        isLoading.value = false
      }
    },

    async uploadAvatar(avatar: Blob) {
      const formData = new FormData()
      formData.append('avatar', avatar)
      formData.append('id', uuid())

      return servicesStore.uploadAvatar(formData)
    },
  }
}
