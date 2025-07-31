<script setup lang="ts">
import { useQueuesStore } from '../../stores/queues'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import Swal from 'sweetalert2'
import { useServiceStore } from '../../stores/services'
import { CarouselItem } from './types'
import { buildImageUrl } from '../../services/utils'
import { useGlobalStore } from '../../stores/global-store'
import { storeToRefs } from 'pinia'
import { useBreakpoint } from 'vuestic-ui'

const queueStore = useQueuesStore()
const serviceStore = useServiceStore()

const carouselValue = ref(0)
const isCarouselEnabled = ref(localStorage.getItem('isCarouselEnabled') === 'true' || true)
const carouselItems = ref<CarouselItem[]>([])
const breakpoints = useBreakpoint()
let socket: WebSocket

onMounted(async () => {
  await queueStore.getWaitlistData()
  await serviceStore.getAll({})

  // Initialize carousel items safely
  updateCarouselItems()
// waitkue.onrender.com
  socket = new WebSocket(`ws://10.55.92.165:9009/ws/queue`)
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
   <VaSwitch
    v-model="isCarouselEnabled"
    true-label="Carousel enabled"
    false-label="Carousel disabled"
    size="small"
    style="position: absolute;top: 4rem;right: 1rem;"
  />
<div class="h-100 flex w-full flex-col gap-3 sm:flex-row">
  <!-- Left column -->
  <div :class="isCarouselEnabled ? 'sm:w-1/4' : 'sm:w-1/2'">
    <VaCard stripe stripe-color="secondary" class="w-full mb-3">
      <VaCardTitle>Waiting</VaCardTitle>
    </VaCard>
    <VaCard
      v-for="ticket in waitlist.waiting || []"
      :key="ticket.queue_id"
      class="mb-2 stripe-left"
      @click="() => callTicketWithoutNotify(ticket.queue_id)"
    >
      <VaCardContent class="flex justify-between card-content-columns">
        <div>
          <h3>#{{ ticket.number }}</h3>
          <span>{{ ticket.service }}</span>
        </div>
        <div class="text-right">
          <span>{{ ticket.time.slice(0, 5) }}</span>
        </div>
      </VaCardContent>
    </VaCard>
    <div v-if="!(waitlist?.waiting?.length)">
      <VaAlert color="info" class="mt-4" icon="info">
        
        No queues exist at the moment.
      </VaAlert>
      <img src="/no-data.png" alt="" class="mt-5">
    </div>
   
  </div>

  <!-- Middle column (carousel) only visible when sidebar is minimized -->
  <div
    v-if="isCarouselEnabled && breakpoints.mdUp"
    class="w-full sm:w-3/5"
  >
    <div v-if="carouselItems.length > 0" class="carousel-wrapper">
      <VaCarousel
        v-model="carouselValue"
        :items="carouselItems.map(item => item.src)"
        stateful
        indicators
        infinite
        :ratio="16 / 12"
      />

      <div class="carousel-caption-top">
        <h3>{{ carouselItems[carouselValue].title }}</h3>
        <p>{{ carouselItems[carouselValue].subtitle }}</p>
      </div>
    </div>
  </div>

  <!-- Right column -->
  <div :class="isCarouselEnabled ? 'sm:w-1/4' : 'sm:w-1/2'">
    <VaCard stripe stripe-color="secondary" class="w-full mb-3">
      <VaCardTitle>Meeting</VaCardTitle>
    </VaCard>
    <VaCard
      v-for="ticket in waitlist.meeting || []"
      :key="ticket.queue_id"
      class="mb-2 stripe-right"
      @click="() => callTicketWithoutNotify(ticket.queue_id)"
    >
      <VaCardContent class="card-content-columns">
        <div>
          <h3>#{{ ticket.number }}</h3>
          <span>{{ ticket.service }}</span>
        </div>
      </VaCardContent>
    </VaCard>
    <div v-if="!(waitlist?.meeting?.length)">
      <VaAlert color="info" class="mt-4" icon="info">
        
        No queues exist at the moment.
      </VaAlert>
      <img src="/no-data.png" alt="" class="mt-5">
    </div>
  </div>
</div>

</template>
<style lang="scss">
.stripe-left,
.stripe-right {
  position: relative;
  overflow: hidden;

  h3 {
    font-size: xx-large;
    margin-bottom: 1rem;
  }

  span {
    font-size: large;
  }

  ;
}

.stripe-left::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 6px;
  height: 100%;
  background: var(--va-primary);
}

.stripe-right::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 6px;
  height: 100%;
  background: var(--va-success);
}

</style>