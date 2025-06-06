<script setup lang="ts">
  import { defineVaDataTableColumns, useModal } from 'vuestic-ui'
  import { PropType, computed, toRef } from 'vue'
  import { Pagination, Sorting } from '../../../data/pages/queues'
  import { useVModel } from '@vueuse/core'
  import { Queue, QueueStatus } from '../types'
  import { useAuthStore } from '../../../stores/auth'
  const auth = useAuthStore()
  const columns = defineVaDataTableColumns(
    auth.currentUser?.role !== 'client'
      ? [
          { label: 'Service', key: 'service', sortable: true },
          { label: 'Room', key: 'room', sortable: true },
          { label: 'Client', key: 'client', sortable: true },
          { label: 'Number', key: 'number', sortable: true },
          { label: 'Time', key: 'time', sortable: true },
          { label: 'Status', key: 'status', sortable: true },
          { label: 'Created At', key: 'created', sortable: true },
          { label: ' ', key: 'actions', align: 'right' },
        ]
      : [
          { label: 'Service', key: 'service', sortable: true },
          { label: 'Room', key: 'room', sortable: true },
          { label: 'Number', key: 'number', sortable: true },
          { label: 'Time', key: 'time', sortable: true },
          { label: 'Status', key: 'status', sortable: true },
          { label: ' ', key: 'actions', align: 'right' },
        ],
  )

  const props = defineProps({
    queues: {
      type: Array as PropType<Queue[]>,
      required: true,
    },
    loading: { type: Boolean, default: false },
    pagination: { type: Object as PropType<Pagination>, required: true },
    sortBy: { type: String as PropType<Sorting['sortBy']>, required: true },
    sortingOrder: { type: String as PropType<Sorting['sortingOrder']>, default: null },
  })

  const emit = defineEmits<{
    (event: 'edit-queue', queue: Queue): void
    (event: 'delete-queue', queue: Queue): void
    (event: 'update:sortBy', sortBy: Sorting['sortBy']): void
    (event: 'update:sortingOrder', sortingOrder: Sorting['sortingOrder']): void
  }>()

  const queues = toRef(props, 'queues')
  const sortByVModel = useVModel(props, 'sortBy', emit)
  const sortingOrderVModel = useVModel(props, 'sortingOrder', emit)

  const roleColors: Record<QueueStatus, string> = {
    0: 'background-element',
    1: 'warning',
    2: 'info',
    3: 'success',
  }

  const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))

  const { confirm } = useModal()

  const onQueueDelete = async (queue: Queue) => {
    const agreed = await confirm({
      title: 'Delete queue ticket',
      message: `Are you sure you want to delete Ticket ${queue.number} for ${queue.service.name}?`,
      okText: 'Delete',
      cancelText: 'Cancel',
      size: 'small',
      maxWidth: '380px',
    })

    if (agreed) {
      emit('delete-queue', queue)
    }
  }
</script>

<template>
  <div>
    <VaDataTable
    v-model:sort-by="sortByVModel"
    v-model:sorting-order="sortingOrderVModel"
    :columns="columns"
    :items="queues"
    :loading="$props.loading"
  >
    <template #cell(service)="{ rowData }">
      <div class="ellipsis max-w-[120px]">
        {{ rowData.service.name }}
      </div>
    </template>
    <template #cell(room)="{ rowData }">
      <div class="ellipsis max-w-[120px]">
        {{ rowData.service.room }}
      </div>
    </template>
    <template #cell(client)="{ rowData }">
      <div class="ellipsis max-w-[120px]">
        {{ rowData.client.profile?.fullname || rowData.client.username }}
      </div>
    </template>
    <template #cell(number)="{ rowData }">
      <div class="ellipsis max-w-[120px]">
        {{ rowData.number }}
      </div>
    </template>
    <template #cell(time)="{ rowData }">
      <div class="ellipsis max-w-[120px]">
        {{ rowData.time }}
      </div>
    </template>
    <template #cell(status)="{ rowData }">
      <div class="ellipsis max-w-[120px]">
        {{ rowData.step }}
      </div>
    </template>
    <template #cell(created)="{ rowData }">
      <div class="ellipsis max-w-[120px]">
        {{ rowData.created_at }}
      </div>
    </template>
    <template #cell(actions)="{ rowData }">
      <div class="flex justify-end gap-2">
        <VaButton
          preset="primary"
          size="small"
          icon="mso-edit"
          aria-label="Edit queue"
          @click="$emit('edit-queue', rowData as Queue)"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          aria-label="Delete queue"
          @click="onQueueDelete(rowData as Queue)"
        />
      </div>
    </template>
  </VaDataTable>

  <div class="flex flex-col-reverse items-center justify-between gap-2 py-2 md:flex-row">
    <div>
      <b>{{ $props.pagination.total }} results.</b>
      Results per page
      <VaSelect v-model="$props.pagination.perPage" class="!w-20" :options="[10, 50, 100]" />
    </div>

    <div v-if="totalPages > 1" class="flex">
      <VaButton
        preset="secondary"
        icon="va-arrow-left"
        aria-label="Previous page"
        :disabled="$props.pagination.page === 1"
        @click="$props.pagination.page--"
      />
      <VaButton
        class="mr-2"
        preset="secondary"
        icon="va-arrow-right"
        aria-label="Next page"
        :disabled="$props.pagination.page === totalPages"
        @click="$props.pagination.page++"
      />
      <VaPagination
        v-model="$props.pagination.page"
        buttons-preset="secondary"
        :pages="totalPages"
        :visible-pages="5"
        :boundary-links="false"
        :direction-links="false"
      />
    </div>
  </div>
  </div>
</template>

<style lang="scss" scoped>
  .va-data-table {
    ::v-deep(.va-data-table__table-tr) {
      border-bottom: 1px solid var(--va-background-border);
    }
  }
</style>
