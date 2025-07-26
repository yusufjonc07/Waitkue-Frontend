<script setup lang="ts">
  import { ref, watchEffect } from 'vue'
  import { useModal, useToast } from 'vuestic-ui'
  import { useQueues } from '../../queues/composables/useQueues'
  import { NewQueue, Queue } from '../../queues/types'
  import EditQueueForm from '../../queues/widgets/EditQueueForm.vue'
  import QueuesTable from '../../queues/widgets/QueuesTable.vue'

  const doShowEditQueueModal = ref(false)

  const { queues, isLoading, filters, sorting, pagination, error, ...queuesApi } = useQueues({
    lazy: false,
  })

  const queueToEdit = ref<Queue | null>(null)

  const showEditQueueModal = (queue: Queue) => {
    queueToEdit.value = queue
    doShowEditQueueModal.value = true
  }

  const showAddQueueModal = () => {
    queueToEdit.value = null
    doShowEditQueueModal.value = true
  }

  const onQueueSaved = async (queue: NewQueue) => {
    if (queueToEdit.value) {
      await queuesApi.update(queue)
      if (!error.value) {
        notify({
          message: `${queue.number} has been updated`,
          color: 'success',
        })
      }
    } else {
      await queuesApi.add(queue)

      if (!error.value) {
        notify({
          message: `Ticket ${queue.number} has been created`,
          color: 'success',
        })
      }
    }
  }

  const { init: notify } = useToast()

  watchEffect(() => {
    if (error.value) {
      notify({
        message: error.value.message,
        color: 'danger',
      })
    }
  })

  const onQueueDelete = async (queue: Queue) => {
    await queuesApi.remove(queue)
    notify({
      message: `Ticket ${queue.number} for ${queue.service.name} has been deleted`,
      color: 'success',
    })
  }

  const editFormRef = ref()

  const { confirm } = useModal()

  const beforeEditFormModalClose = async (hide: () => unknown) => {
    if (editFormRef.value.isFormHasUnsavedChanges) {
      const agreed = await confirm({
        maxWidth: '380px',
        message: 'Form has unsaved changes. Are you sure you want to close it?',
        size: 'small',
      })
      if (agreed) {
        hide()
      }
    } else {
      hide()
    }
  }
</script>

<template>
  <div class="p-4 pt-0 ">
    <h1 class="page-title" style="font-weight: 500;">My tickets</h1>

  <VaCard>
    <VaCardContent>
      <div class="mb-2 flex flex-col justify-between gap-2 md:flex-row">
        <div class="flex flex-col justify-start gap-2 md:flex-row">
          <VaButtonToggle
            v-model="filters.isActive"
            color="background-element"
            border-color="background-element"
            :options="[
              { label: 'Open', value: true },
              { label: 'Finished', value: false },
            ]"
          />
          <VaInput v-model="filters.search" placeholder="Search">
            <template #prependInner>
              <VaIcon name="search" color="secondary" size="small" />
            </template>
          </VaInput>
        </div>
      </div>

      <QueuesTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        :queues="queues"
        :loading="isLoading"
        :pagination="pagination"
        @editQueue="showEditQueueModal"
        @deleteQueue="onQueueDelete"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditQueueModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">{{ queueToEdit ? 'Edit queue' : 'Add queue' }}</h1>
    <EditQueueForm
      ref="editFormRef"
      :queue="queueToEdit"
      :save-button-label="queueToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        (queue: any) => {
          onQueueSaved(queue)
          ok()
        }
      "
    />
  </VaModal>
  </div>
</template>
