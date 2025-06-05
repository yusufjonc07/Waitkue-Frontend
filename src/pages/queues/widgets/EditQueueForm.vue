<script setup lang="ts">
  import { PropType, computed, ref, watch, onMounted } from 'vue'
  import { useForm } from 'vuestic-ui'
  import { useUsersStore } from '../../../stores/users'
  import { useServiceStore } from '../../../stores/services'
  import { useQueuesStore } from '../../../stores/queues'
  import { validators } from '../../../services/utils'
  import { NewQueue, QueueStatus } from '../types'

  const props = defineProps({
    queue: {
      type: Object as PropType<NewQueue | null>,
      default: null,
    },
    saveButtonLabel: {
      type: String,
      default: 'Save',
    },
  })

  const defaultNewQueue: NewQueue = {
    date: new Date().toISOString().split('T')[0],
    number: null,
    time: null,
    step: 0,
    client_id: null,
    comment: '',
    service_id: null,
  }

  const stepLabels: Record<number, string> = {
    0: 'Reserved',
    1: 'Waiting',
    2: 'Meeting',
    3: 'Finished',
  }

  const newQueue = ref<NewQueue>({ ...defaultNewQueue })

  watch(
    () => props.queue,
    newVal => {
      if (newVal) {
        newQueue.value = { ...newVal }
      } else {
        newQueue.value = { ...defaultNewQueue }
      }
    },
    { immediate: true },
  )

  const isFormHasUnsavedChanges = computed(() => {
    return Object.keys(newQueue.value).some(key => {
      return (
        newQueue.value[key as keyof NewQueue] !==
        (props.queue ?? defaultNewQueue)?.[key as keyof NewQueue]
      )
    })
  })

  defineExpose({ isFormHasUnsavedChanges })

  // Watch for service_id and date to fetch new numbers
  watch(
    () => [newQueue.value.service_id, newQueue.value.date],
    ([serviceId, date]) => {
      if (serviceId && date) {
        newQueue.value.number = null
        queueStore.getAvailableNumbers(date, serviceId)
      }
    },
  )

  // Watch for number to update time
  watch(
    () => newQueue.value.number,
    number => {
      if (number) {
        const selected = queueStore.numbers.find(n => n.queue_number === number)
        if (selected) {
          newQueue.value.time = selected.time
        }
      }
    },
  )

  const form = useForm('add-queue-form')
  const emit = defineEmits(['close', 'save'])

  const onSave = () => {
    if (form.validate()) {
      emit('save', newQueue.value)
    }
  }

  const usersStore = useUsersStore()
  const serviceStore = useServiceStore()
  const queueStore = useQueuesStore()

  onMounted(async () => {
    await usersStore.getClientUsers()
    await serviceStore.getAll({})
  })

  const clientOptions = computed(() =>
    usersStore.clients.map(client => ({
      text: client.profile?.fullname || client.username,
      value: client.id,
    })),
  )

  const serviceOptions = computed(() => {
    return serviceStore.items.map((service: any) => ({
      text: service.name,
      value: service.id,
    }))
  })

  const numberOptions = computed(() =>
    queueStore.numbers.map(item => ({
      text: `${item.time} - ${item.queue_number} ${!item.possible ? ' - Reserved' : ''}`,
      value: item.queue_number,
      disabled: !item.possible,
    })),
  )
</script>

<template>
  <VaForm v-slot="{ isValid }" ref="add-queue-form" class="flex w-full flex-col gap-4">
    <div class="flex w-full flex-col gap-4 sm:flex-row">
      <VaSelect
        v-model="newQueue.client_id"
        placeholder="Select a client"
        label="Client"
        class="w-full sm:w-1/2"
        :options="clientOptions"
        :rules="[validators.required]"
        name="client_id"
        track-by="value"
        value-by="value"
      />
      <VaSelect
        v-model="newQueue.service_id"
        :options="serviceOptions"
        label="Service"
        :rules="[validators.required]"
        placeholder="Select a service"
        class="w-full sm:w-1/2"
        track-by="value"
        value-by="value"
      />
    </div>

    <div class="flex w-full flex-col gap-4 sm:flex-row">
      <VaDateInput
        v-model="newQueue.date"
        label="Date"
        class="w-full sm:w-1/2"
        :rules="[validators.required]"
      />

      <VaSelect
        v-model="newQueue.number"
        placeholder="Select a time"
        label="Time & Number"
        class="w-full sm:w-1/2"
        :options="numberOptions"
        :rules="[validators.required]"
        name="number"
        track-by="value"
        value-by="value"
      />
    </div>

    <div class="flex w-full flex-col gap-4 sm:flex-row">
      <VaSlider
        v-model="newQueue.step"
        label="Queue Status"
        :min="0"
        :max="2"
        :step="1"
        pins
        class="w-full"
      />
      <p>{{ stepLabels[newQueue.step] }}</p>
    </div>

    <div class="flex w-full flex-col gap-4 sm:flex-row">
      <VaTextarea
        v-model="newQueue.comment"
        placeholder="Comment to service admin"
        label="Comment"
        class="w-full"
      />
    </div>

    <div class="flex w-full justify-end gap-2">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
    </div>
  </VaForm>
</template>
