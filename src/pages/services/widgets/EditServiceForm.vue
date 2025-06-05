<script setup lang="ts">
  import { PropType, computed, ref, watch } from 'vue'
  import { useForm } from 'vuestic-ui'
  import { Service } from '../types'
  import { validators } from '../../../services/utils'

  // FilePond imports
  import vueFilePond from 'vue-filepond'
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
  import 'filepond/dist/filepond.min.css'
  import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

  const FilePond = vueFilePond(FilePondPluginImagePreview, FilePondPluginFileValidateType)

  const props = defineProps({
    service: {
      type: Object as PropType<Service | null>,
      default: null,
    },
    saveButtonLabel: {
      type: String,
      default: 'Save',
    },
  })

  const filepondServer = {
    url: `${import.meta.env.VITE_API_BASE_URL}/upload_service_image`,
    process: {
      url: '/',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      withCredentials: false,
      onload: (response: any) => {
        const { filename, url } = JSON.parse(response)
        newService.value.image_url = url
        return url
      },
      onerror: (response: any) => {
        console.error('Upload error:', response)
        return 'Upload failed'
      },
    },
    revert: null, // optional: implement if you want to allow image deletion
  }

  const defaultNewService: Omit<Service, 'id'> = {
    name: '',
    description: '',
    available_days: 'Mon,Tue,Wed,Thu,Fri,Sat,Sun',
    room: '',
    from_time: '',
    to_time: '',
    avg_minute: 0,
    image_url: '',
  }

  const newService = ref<Service>({ ...(defaultNewService as Service) })

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const selectedDays = ref<string[]>([])

  watch(
    () => props.service,
    newVal => {
      if (newVal) {
        newService.value = { ...newVal }
        selectedDays.value = newVal.available_days
          ? newVal.available_days.split(',').map(day => day.trim())
          : [...weekdays]
      } else {
        newService.value = { ...(defaultNewService as Service) }
        selectedDays.value = [...weekdays]
      }
      newService.value.available_days = selectedDays.value.join(',')
    },
    { immediate: true },
  )

  const toggleDay = (day: string) => {
    const index = selectedDays.value.indexOf(day)
    if (index > -1) {
      selectedDays.value.splice(index, 1)
    } else {
      selectedDays.value.push(day)
    }
    newService.value.available_days = selectedDays.value.join(',')
  }

  const form = useForm('add-service-form')
  const emit = defineEmits(['close', 'save'])

  const onSave = () => {
    if (form.validate()) {
      emit('save', newService.value)
    }
  }

  // Handle FilePond Image Upload
  const imageFile = ref<File[]>([])

  const handleImageUpdate = (files: File[]) => {
    const file = files[0]
    if (file) {
      newService.value.image_url = URL.createObjectURL(file)
    } else {
      newService.value.image_url = ''
    }
  }
</script>

<template>
  <VaForm
    v-slot="{ isValid }"
    ref="add-service-form"
    class="inline-flex w-full flex-col items-start justify-start gap-4"
  >
    <!-- Image Upload using FilePond -->
    <div class="w-full">
      <label class="mb-1 block font-semibold">Service Image</label>
      <FilePond
        name="file"
        accepted-file-types="image/*"
        :files="imageFile"
        :server="filepondServer"
        allow-multiple="false"
        allow-replace="true"
        label-idle='Drag & Drop or <span class="filepond--label-action">Browse</span>'
        @updatefiles="handleImageUpdate($event.map((f: any) => f.file))"
      />
    </div>
    <div class="flex w-full gap-4">
      <VaInput
        v-model="newService.name"
        label="Service Name"
        class="w-full"
        :rules="[validators.required]"
        name="name"
      />
      <VaInput v-model="newService.room" label="Room" class="w-1/2" name="room" />
    </div>
    <div class="flex w-full flex-col items-start justify-start gap-4 self-stretch">
      <VaTextarea
        v-model="newService.description"
        label="Description"
        class="w-full"
        name="description"
      />

      <!-- Available Days -->
      <div class="mb-4 self-stretch">
        <label class="mb-1 block font-semibold">Available Days</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="day in weekdays"
            :key="day"
            type="button"
            :class="[
              'cursor-pointer select-none rounded border px-3 py-1',
              selectedDays.includes(day)
                ? 'border-primary bg-primary text-white'
                : 'border-transparent bg-gray-200 text-gray-700',
            ]"
            @click="toggleDay(day)"
          >
            {{ day }}
          </button>
        </div>
      </div>

      <div class="flex w-full gap-4">
        <VaInput
          v-model="newService.from_time"
          label="From Time"
          type="time"
          class="w-1/4"
          name="from_time"
        />
        <VaInput
          v-model="newService.to_time"
          label="To Time"
          type="time"
          class="w-1/4"
          name="to_time"
        />
      </div>

      <VaInput
        v-model="newService.avg_minute"
        label="Average Time (minutes)"
        type="number"
        class="w-1/2"
        min="0"
        name="avg_minute"
      />

      <div
        class="flex w-full flex-col-reverse items-stretch justify-end gap-2 sm:flex-row sm:items-center"
      >
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
        <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>
