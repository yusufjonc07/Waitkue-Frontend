<template>
  <div class="flex flex-col gap-5 md:flex-row">
    <!-- Queue Chart -->
    <VaCard class="flex flex-col md:w-2/3">
      <VaCardTitle class="flex items-start justify-between">
        <h1 class="card-title font-bold uppercase text-secondary">Annual Queues Report</h1>
        <div class="flex gap-2">
          <select v-model="selectedYear">
            <option :value="2023">2023</option>
            <option :value="2024">2024</option>
            <option :value="2025">2025</option>
          </select>
          <VaButton class="h-2" size="small" preset="primary" @click="exportAsCSV">Export</VaButton>
        </div>
      </VaCardTitle>
      <VaCardContent class="flex h-full flex-col-reverse justify-between gap-5">
        <QueueReportChart :key="selectedYear" class="h-full min-h-72 w-full pt-4 sm:min-h-32" :queues="queues" />
      </VaCardContent>
    </VaCard>

    <!-- Service Chart -->
    <VaCard class="flex flex-col md:w-1/3">
      <VaCardTitle class="flex items-start justify-between">
        <h1 class="card-title font-bold uppercase text-secondary">Service Queues Report</h1>
        <div class="flex gap-2">
          <select v-model="selectedMonth">
            <option v-for="(month, i) in months" :key="month" :value="i + 1">
              {{ month }}
            </option>
          </select>
          <VaButton class="h-2" size="small" preset="primary" @click="exportAsCSV">Export</VaButton>
        </div>
      </VaCardTitle>
      <VaCardContent class="flex h-full flex-col-reverse justify-between gap-5">
        <ServiceReportChart :key="selectedYear" v-if="services.length > 0"
          class="h-full min-h-72 w-full pt-4 sm:min-h-32" :services="services" />
      </VaCardContent>
    </VaCard>
  </div>
</template>


<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { VaCard } from 'vuestic-ui'
import QueueReportChart from './QueueReportChart.vue'
import { downloadAsCSV } from '../../../../services/toCSV'
import { months, getQueues, getServices } from '../../../../data/charts/queueChartData'
import ServiceReportChart from './ServiceReportChart.vue'
import { watch } from 'vue'

const queues = ref([])
const services = ref([])

const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth()

onMounted(async () => {
  queues.value = await getQueues(currentYear)
  services.value = await getServices(currentYear, currentMonth + 1)
})


const selectedMonth = ref(currentMonth + 1)
const selectedYear = ref(currentYear)


watch(selectedYear, async (newYear) => {
  if (newYear) {



    queues.value = await getQueues(newYear)
    services.value = await getServices(newYear, currentMonth + 1)
  }
})

watch(selectedMonth, async (newMonth) => {
  if (newMonth) {

    services.value = await getServices(currentYear, newMonth)
  }
})

const exportAsCSV = () => {
  downloadAsCSV(queues.value, 'queue-report')
}
</script>
