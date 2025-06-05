import { Ref, ref, unref, watch, computed } from 'vue'
import type { Filters, Pagination, Sorting } from '../../../data/pages/queues'
import { NewQueue, Queue } from '../types'
import { useQueuesStore } from '../../../stores/queues'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'number', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ isActive: true, search: '' })

export const useQueues = (options?: {
  pagination?: Ref<Pagination>
  sorting?: Ref<Sorting>
  filters?: Ref<Partial<Filters>>
  lazy?: boolean
}) => {
  const isLoading = ref(false)
  const error = ref()
  const queuesStore = useQueuesStore()

  const {
    filters = makeFiltersRef(),
    sorting = makeSortingRef(),
    pagination = makePaginationRef(),
    lazy = false,
  } = options || {}

  const fetch = async () => {
    isLoading.value = true
    try {
      await queuesStore.getAll({
        filters: unref(filters),
        sorting: unref(sorting),
        pagination: unref(pagination),
      })
      pagination.value = queuesStore.pagination
    } finally {
      isLoading.value = false
    }
  }

  watch(
    filters,
    () => {
      pagination.value.page = 1
      fetch()
    },
    { deep: true },
  )

  if (!lazy) {
    fetch()
  }
  const queues = computed(() => {
    const getSortItem = (obj: any, sortBy: string) => {
      return obj[sortBy]
    }

    const paginated = queuesStore.items.slice(
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

    queues,

    fetch,

    async add(queue: NewQueue) {
      isLoading.value = true
      try {
        return await queuesStore.add(queue)
      } catch (e) {
        error.value = e
      } finally {
        isLoading.value = false
      }
    },

    async update(queue: NewQueue) {
      isLoading.value = true
      try {
        return await queuesStore.update(queue)
      } catch (e) {
        error.value = e
      } finally {
        isLoading.value = false
      }
    },

    async remove(queue: Queue) {
      isLoading.value = true
      try {
        return await queuesStore.remove(queue)
      } catch (e) {
        error.value = e
      } finally {
        isLoading.value = false
      }
    },
  }
}
