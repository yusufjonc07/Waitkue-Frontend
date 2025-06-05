<script setup lang="ts">
  import { PropType, computed, ref, watch, onMounted } from 'vue'
  import { useForm } from 'vuestic-ui'
  import { useQueuesStore } from '../../../stores/queues'
  import { validators } from '../../../services/utils'
  import { NewQueue, QueueStatus } from '../../queues/types'
  import { useAuthStore } from '../../../stores/auth'
  import { Service } from '../../services/types'
  import { Client, User } from '../../users/types'

  const props = defineProps({
    queue: {
      type: Object as PropType<NewQueue | null>,
      default: null,
    },
    service: {
      type: Object as PropType<Service>,
      required: true,
    },
    client: {
      type: Object as PropType<User>,
      required: true,
    },
    saveButtonLabel: {
      type: String,
      default: 'Reserve',
    },
  })

  const auth = useAuthStore()

  const defaultNewQueue: NewQueue = {
    date: new Date().toISOString().split('T')[0],
    number: null,
    time: null,
    step: 0,
    client_id: props.client?.id || 0,
    comment: '',
    service_id: props.service?.id || 0,
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

  watch(
    () => newQueue.value.date,
    date => {
      if (newQueue.value.service_id && date) {
        newQueue.value.number = null

        if (date instanceof Date) {
          newQueue.value.date = date.toISOString().split('T')[0]
        } else if (typeof date === 'string' && date.includes('T')) {
          newQueue.value.date = date.split('T')[0]
        }

        queueStore.getAvailableNumbers(date, newQueue.value.service_id)
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

  const queueStore = useQueuesStore()

  onMounted(async () => {
    await queueStore.getAvailableNumbers(newQueue.value.date, props.service.id)
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
  <h1 class="mb-4 text-3xl font-semibold">Ticket: {{ service.name }}</h1>

  <VaForm v-slot="{ isValid }" ref="add-queue-form" class="flex w-full flex-col gap-4">
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
