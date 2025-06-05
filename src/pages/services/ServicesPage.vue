<script setup lang="ts">
  import { ref, watchEffect } from 'vue'
  import EditServiceForm from './widgets/EditServiceForm.vue'
  import ServicesTable from './widgets/ServicesTable.vue'
  import { Service } from './types'
  import { useServices } from './composables/useServices'
  import { useModal, useToast } from 'vuestic-ui'

  const doShowEditServiceModal = ref(false)

  const { services, isLoading, filters, sorting, pagination, error, ...servicesApi } = useServices()

  const serviceToEdit = ref<Service | null>(null)

  const showEditServiceModal = (service: Service) => {
    serviceToEdit.value = service
    doShowEditServiceModal.value = true
  }

  const showAddServiceModal = () => {
    serviceToEdit.value = null
    doShowEditServiceModal.value = true
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

  const onServiceSaved = async (service: Service) => {
    if (serviceToEdit.value) {
      await servicesApi.update(service)
      if (!error.value) {
        notify({
          message: `${service.name} has been updated`,
          color: 'success',
        })
      }
    } else {
      await servicesApi.add(service)

      if (!error.value) {
        notify({
          message: `${service.name} has been created`,
          color: 'success',
        })
      }
    }
  }

  const onServiceDelete = async (service: Service) => {
    await servicesApi.remove(service)
    notify({
      message: `${service.name} has been deleted`,
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
  <h1 class="page-title">Services</h1>

  <VaCard>
    <VaCardContent>
      <div class="mb-2 flex flex-col justify-between gap-2 md:flex-row">
        <div class="flex flex-col justify-start gap-2 md:flex-row">
          <VaInput v-model="filters.search" placeholder="Search">
            <template #prependInner>
              <VaIcon name="search" color="secondary" size="small" />
            </template>
          </VaInput>
        </div>
        <VaButton @click="showAddServiceModal">Add Service</VaButton>
      </div>

      <ServicesTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        :services="services"
        :loading="isLoading"
        :pagination="pagination"
        @editService="showEditServiceModal"
        @deleteService="onServiceDelete"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditServiceModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">{{ serviceToEdit ? 'Edit service' : 'Add service' }}</h1>
    <EditServiceForm
      ref="editFormRef"
      :service="serviceToEdit"
      :save-button-label="serviceToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        service => {
          onServiceSaved(service)
          ok()
        }
      "
    />
  </VaModal>
</template>
