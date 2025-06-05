<script setup lang="ts">
  import { useModal } from 'vuestic-ui'
  import { Service } from '../../services/types'
  import { PropType, toRef, computed } from 'vue'
  import { Pagination, Sorting } from '../../../data/pages/services'
  import { buildImageUrl } from '../../../services/utils'

  const BASE_URL = import.meta.env.VITE_API_BASE_URL

  const props = defineProps({
    services: {
      type: Array as PropType<Service[]>,
      required: true,
    },
    loading: { type: Boolean, default: false },
    pagination: { type: Object as PropType<Pagination>, required: true },
    sortBy: { type: String as PropType<Sorting['sortBy']>, required: true },
    sortingOrder: { type: String as PropType<Sorting['sortingOrder']>, default: null },
  })

  const emit = defineEmits<{
    (event: 'reserveTicket', service: Service): void
  }>()

  const services = toRef(props, 'services')
  const { confirm } = useModal()

  const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))

  const onServiceDelete = async (service: Service) => {
    const agreed = await confirm({
      title: 'Delete service',
      message: `Are you sure you want to delete ${service.name}?`,
      okText: 'Delete',
      cancelText: 'Cancel',
      size: 'small',
      maxWidth: '380px',
    })

    // if (agreed) {
    //     emit('delete-service', service)
    // }
  }
</script>

<template>
  <div v-if="loading" class="flex justify-center py-10">
    <VaProgressCircle indeterminate size="large" />
  </div>

  <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
    <VaCard v-for="service in services" :key="service.id" :bordered="false">
      <VaCardTitle>{{ service.name }}</VaCardTitle>
      <VaCardContent>
        <div class="flex flex-col gap-2">
          <p class="truncate text-sm text-gray-600">
            <strong>Description:</strong> {{ service.description }}
          </p>
          <p class="text-sm"><strong>Available Days:</strong> {{ service.available_days }}</p>
          <p class="text-sm"><strong>Room:</strong> {{ service.room }}</p>
          <p class="text-sm">
            <strong>From:</strong> {{ service.from_time }} → <strong>To:</strong>
            {{ service.to_time }}
          </p>
          <p class="text-sm"><strong>Avg Minutes:</strong> {{ service.avg_minute }}</p>

          <div v-if="service.image_url" class="pt-2">
            <img
              :src="BASE_URL + service.image_url"
              alt="Service Image"
              class="h-32 w-full rounded object-cover"
            />
          </div>
          <VaButton @click="$emit('reserveTicket', service as Service)">Reserve now</VaButton>
        </div>
      </VaCardContent>
    </VaCard>
  </div>

  <!-- Pagination info (optional display) -->
  <div v-if="totalPages > 1" class="mt-6 text-center text-sm text-gray-500">
    Showing page {{ props.pagination.page }} of {{ totalPages }}
  </div>
</template>

<style scoped>
  /* Add any custom card styling here */
</style>
