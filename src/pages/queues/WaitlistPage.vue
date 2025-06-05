<script setup lang="ts">
  import { useQueuesStore } from '../../stores/queues'
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
  import Swal from 'sweetalert2'
  import api from '../../services/api'
  import { useServiceStore } from '../../stores/services'
  import { CarouselItem } from './types'
  import { buildImageUrl } from '../../services/utils'

  const queueStore = useQueuesStore()
  const serviceStore = useServiceStore()

  const carouselValue = ref(0)
  const carouselItems = ref<CarouselItem[]>([])

  let socket: WebSocket

  onMounted(async () => {
    await queueStore.getWaitlistData()
    await serviceStore.getAll({})

    // Initialize carousel items safely
    updateCarouselItems()

    socket = new WebSocket(`wss://waitkue.onrender.com/ws/queue`)
    socket.onmessage = async event => {
      const data = JSON.parse(event.data)
      await queueStore.getWaitlistData()
      if (data.type === 'updated-ticket') {
        if (suppressNextUpdate) {
          suppressNextUpdate = false
        } else {
          notifyUpdatedTicket(data.payload.number)
        }
      }
    }
  })

  // Watch for any change in serviceStore.items to keep carousel updated
  watch(
    () => serviceStore.items,
    () => {
      updateCarouselItems()
    },
    { deep: true },
  )

  function updateCarouselItems() {
    carouselItems.value = serviceStore.items
      .map(item => ({
        src: buildImageUrl(item.image_url),
        title: item.name, // make sure your serviceStore items have title & subtitle
        subtitle: item.description,
      }))
      .filter(item => item.src)
  }

  onUnmounted(() => {
    socket?.close()
  })

  const notificationSound = new Audio('/notification-sound.m4a')
  let suppressNextUpdate = false

  function callTicketWithoutNotify(queueId: number) {
    suppressNextUpdate = true
    queueStore.callTicket(queueId)
  }

  function notifyUpdatedTicket(ticketNumber: number) {
    notificationSound.play().catch(e => {
      console.warn('Failed to play notification sound:', e)
    })
    let timerInterval: any
    Swal.fire({
      title: '',
      html: `<div style="font-size: 4rem; font-weight: bold; text-align: center; margin-bottom: 10px;">
             Queue #${ticketNumber}
           </div>
           <div style="text-align: center;">Please come in!</div>`,
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        const timer = Swal.getPopup()?.querySelector('b')
        timerInterval = setInterval(() => {
          if (timer) timer.textContent = `${Swal.getTimerLeft()}`
        }, 100)
      },
      willClose: () => {
        clearInterval(timerInterval)
      },
    }).then(result => {
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('Notification closed by timer')
      }
    })
  }

  const waitlist = computed(() => queueStore.waitlist)
</script>

<template>
  <div class="h-100 flex w-full flex-col gap-3 sm:flex-row">
    <VaCard stripe stripe-color="secondary" class="w-full sm:w-1/4">
      <VaCardTitle>Waiting</VaCardTitle>
      <VaCardContent>
        <VaCard
          v-for="ticket in waitlist.waiting"
          :key="ticket.queue_id"
          class="mb-2"
          color="primary"
          @click="() => callTicketWithoutNotify(ticket.queue_id)"
        >
          <VaCardContent class="flex"> {{ ticket.service }} #{{ ticket.number }} </VaCardContent>
        </VaCard>

        <VaAlert v-if="!waitlist.waiting" color="info" class="mt-4" icon="info">
          No queues available at the moment.
        </VaAlert>
      </VaCardContent>
    </VaCard>
    <div class="w-full sm:w-3/5">
      <div v-if="carouselItems.length > 0" class="carousel-wrapper">
        <VaCarousel
          v-model="carouselValue"
          stateful
          autoscroll
          :items="carouselItems.map(item => item.src)"
          :ratio="16 / 12"
        />

        <div class="carousel-caption-top">
          <h3>{{ carouselItems[carouselValue].title }}</h3>
          <p>{{ carouselItems[carouselValue].subtitle }}</p>
        </div>
      </div>
    </div>
    <VaCard stripe stripe-color="success" class="w-full sm:w-1/4">
      <VaCardTitle>Meeting</VaCardTitle>
      <VaCardContent>
        <VaCard
          v-for="ticket in waitlist.meeting"
          :key="ticket.queue_id"
          class="mb-2"
          color="info"
          @click="() => api.request(api.finish(ticket.queue_id.toString()), { method: 'POST' })"
        >
          <VaCardContent> {{ ticket.service }} #{{ ticket.number }} </VaCardContent>
        </VaCard>

        <VaAlert v-if="!waitlist.meeting" color="info" class="mt-4" icon="info">
          No queues available at the moment.
        </VaAlert>
      </VaCardContent>
    </VaCard>
  </div>
</template>
