<script setup lang="ts">
  import { defineVaDataTableColumns, useModal } from 'vuestic-ui'
  import { Service } from '../types'
  import { PropType, computed, toRef } from 'vue'
  import { Pagination, Sorting } from '../../../data/pages/services'
  import { useVModel } from '@vueuse/core'

  const BASE_URL = import.meta.env.VITE_API_BASE_URL

  const columns = defineVaDataTableColumns([
    { label: 'Name', key: 'name', sortable: true },
    { label: 'Description', key: 'description', sortable: true },
    { label: 'Available Days', key: 'available_days', sortable: true },
    { label: 'Room', key: 'room', sortable: true },
    { label: 'From Time', key: 'from_time', sortable: true },
    { label: 'To Time', key: 'to_time', sortable: true },
    { label: 'Average Minutes', key: 'avg_minute', sortable: true },
    { label: 'Image', key: 'image_url', sortable: false },
    { label: ' ', key: 'actions', align: 'right' },
  ])

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
    (event: 'edit-service', service: Service): void
    (event: 'delete-service', service: Service): void
    (event: 'update:sortBy', sortBy: Sorting['sortBy']): void
    (event: 'update:sortingOrder', sortingOrder: Sorting['sortingOrder']): void
  }>()

  const services = toRef(props, 'services')
  const sortByVModel = useVModel(props, 'sortBy', emit)
  const sortingOrderVModel = useVModel(props, 'sortingOrder', emit)

  const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))

  const { confirm } = useModal()

  const onServiceDelete = async (service: Service) => {
    const agreed = await confirm({
      title: 'Delete service',
      message: `Are you sure you want to delete ${service.name}?`,
      okText: 'Delete',
      cancelText: 'Cancel',
      size: 'small',
      maxWidth: '380px',
    })

    if (agreed) {
      emit('delete-service', service)
    }
  }
</script>

<template>
  <div>
    <VaDataTable
    v-model:sort-by="sortByVModel"
    v-model:sorting-order="sortingOrderVModel"
    :columns="columns"
    :items="services"
    :loading="$props.loading"
  >
    <!-- Name -->
    <template #cell(name)="{ rowData }">
      <div class="ellipsis max-w-[120px]">
        {{ rowData.name || '' }}
      </div>
    </template>

    <!-- Description -->
    <template #cell(description)="{ rowData }">
      <div class="ellipsis max-w-[230px]">
        {{ rowData.description || '' }}
      </div>
    </template>

    <!-- Available Days -->
    <template #cell(available_days)="{ rowData }">
      <div class="ellipsis max-w-[120px]">
        {{ rowData.available_days || '' }}
      </div>
    </template>

    <!-- Room -->
    <template #cell(room)="{ rowData }">
      <div>
        {{ rowData.room || '' }}
      </div>
    </template>

    <!-- From Time -->
    <template #cell(from_time)="{ rowData }">
      <div>
        {{ rowData.from_time || '' }}
      </div>
    </template>

    <!-- To Time -->
    <template #cell(to_time)="{ rowData }">
      <div>
        {{ rowData.to_time || '' }}
      </div>
    </template>

    <!-- Avg Minute -->
    <template #cell(avg_minute)="{ rowData }">
      <div>
        {{ rowData.avg_minute || '' }}
      </div>
    </template>

    <!-- Image URL (optional - maybe show image thumbnail) -->
    <template #cell(image_url)="{ rowData }">
      <img
        v-if="rowData.image_url"
        :src="BASE_URL + rowData.image_url"
        alt="Service Image"
        class="h-12 w-12 rounded object-cover"
      />
    </template>

    <!-- Actions -->
    <template #cell(actions)="{ rowData }">
      <div class="flex justify-end gap-2">
        <VaButton
          preset="primary"
          size="small"
          icon="mso-edit"
          aria-label="Edit service"
          @click="$emit('edit-service', rowData)"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          aria-label="Delete service"
          @click="onServiceDelete(rowData)"
        />
      </div>
    </template>
  </VaDataTable>
  </div>
</template>

<style lang="scss" scoped>
  .va-data-table {
    ::v-deep(.va-data-table__table-tr) {
      border-bottom: 1px solid var(--va-background-border);
    }
  }
</style>
