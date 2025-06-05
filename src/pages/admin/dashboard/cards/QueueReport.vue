<template>
  <VaCard class="flex flex-col">
    <VaCardTitle class="flex items-start justify-between">
      <h1 class="card-title font-bold uppercase text-secondary">Annual Queues Report</h1>
      <div class="flex gap-2">
        <VaButton class="h-2" size="small" preset="primary" @click="exportAsCSV">Export</VaButton>
      </div>
    </VaCardTitle>
    <VaCardContent
      class="flex h-full flex-col-reverse justify-between gap-5 md:flex-row md:items-center"
    >
      <QueueReportChart
        v-if="queues.length"
        class="h-full min-h-72 w-full pt-4 sm:min-h-32"
        :queues="queues"
        :months="months"
      />
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue'
  import { VaCard } from 'vuestic-ui'
  import QueueReportChart from './QueueReportChart.vue'
  import { downloadAsCSV } from '../../../../services/toCSV'
  import { months, getQueues } from '../../../../data/charts/queueChartData'
  const queues = ref([])

  const currentYear = new Date().getFullYear()

  onMounted(async () => {
    queues.value = await getQueues(currentYear, months)
  })

  const monthsWithCurrentYear = months.map(month => `${month} ${currentYear}`)

  const selectedMonth = ref(monthsWithCurrentYear[0])

  const exportAsCSV = () => {
    downloadAsCSV(queues.value, 'queue-report')
  }
</script>
