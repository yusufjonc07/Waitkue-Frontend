<script setup lang="ts">
  import { ref, watchEffect } from 'vue'
  import ServiceCards from './ServiceCards.vue'
  import { Service } from '../../services/types'
  import { useServices } from '../../services/composables/useServices'
  import { useModal, useToast } from 'vuestic-ui'
  import { useAuthStore } from '../../../stores/auth'
  import Login from '../../auth/Login.vue'
  import ReservationForm from './ReservationForm.vue'
  import { NewQueue, Queue } from '../../queues/types'
  import { useQueues } from '../../queues/composables/useQueues'

  const doShowReserveServiceModal = ref(false)

  const { services, isLoading, filters, sorting, pagination, error, ...servicesApi } = useServices()
  const { ...queuesApi } = useQueues({ lazy: true })

  const serviceToReserve = ref<Service | null>(null)
  const queueToEdit = ref<Queue | null>(null)

  const showReservationModal = (service: Service) => {
    serviceToReserve.value = service
    doShowReserveServiceModal.value = true
  }

  const auth = useAuthStore()

  const { init: notify } = useToast()

  watchEffect(() => {
    if (error.value) {
      notify({
        message: error.value.message,
        color: 'danger',
      })
    }
  })

  const onQueueSaved = async (queue: NewQueue) => {
    await queuesApi.add(queue)

    if (!error.value) {
      notify({
        message: `Ticket ${queue.number} has been created`,
        color: 'success',
      })
    }
  }

  const editFormRef = ref()

  const { confirm } = useModal()

  // const beforeEditFormModalClose = async (hide: () => unknown) => {
  //   if (editFormRef.value.isFormHasUnsavedChanges) {
  //     const agreed = await confirm({
  //       maxWidth: '380px',
  //       message: 'Form has unsaved changes. Are you sure you want to close it?',
  //       size: 'small',
  //     })
  //     if (agreed) {
  //       hide()
  //     }
  //   } else {
  //     hide()
  //   }
  // }
</script>

<template>
  <!-- <h1 class="page-title">Services</h1> -->

  <div class="my-2 flex flex-col justify-between gap-2 md:flex-row">
    <div class="flex flex-col justify-start gap-2 md:flex-row">
      <VaInput v-model="filters.search" placeholder="Search">
        <template #prependInner>
          <VaIcon name="search" color="secondary" size="small" />
        </template>
      </VaInput>
    </div>
  </div>
  <ServiceCards
    v-model:sort-by="sorting.sortBy"
    v-model:sorting-order="sorting.sortingOrder"
    :services="services"
    :loading="isLoading"
    :pagination="pagination"
    @reserveTicket="showReservationModal"
  />
  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowReserveServiceModal"
    blur
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
  >
    <Login v-if="!auth.isAuthenticated" />
    <ReservationForm
      v-if="auth.isAuthenticated && serviceToReserve && auth.currentUser"
      :service="serviceToReserve"
      :client="auth.currentUser"
      @close="cancel"
      @save="
        (queue: any) => {
          onQueueSaved(queue)
          ok()
        }
      "
    />
  </VaModal>

  <!-- :before-cancel="beforeEditFormModalClose" -->
</template>
