<template>
  <div class="relative flex h-full w-full justify-center overflow-hidden">
    <canvas ref="canvas2" style="max-width: 100%"></canvas>
    <img v-show="services.length < 1" src="/no-data.png" alt="">
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'

import type { Services } from '../../../../data/charts/queueChartData'

const { services } = defineProps<{
  services: Services[]
}>()

Chart.register(...registerables)

const canvas2 = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  nextTick(() => {
    if (canvas2.value) {
      const ctx = canvas2.value.getContext('2d')
      if (ctx) {
        // Prepare data for Pie chart
        const labels = services.map(s => s.serviceName)
        const data = services.map(s => s.tickets)

        new Chart(ctx, {
          type: 'pie',
          data: {
            labels,
            datasets: [
              {
                data,
                backgroundColor: [
                  '#FF6384',
                  '#36A2EB',
                  '#FFCE56',
                  '#4BC0C0',
                  '#9966FF',
                  '#FF9F40',
                ],
              },
            ],
          },
          options: {
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const label = context.label || ''
                    const value = context.raw as number
                    return `${label}: ${value} queues`
                  },
                },
              },
            },
          },
        })
      }
    }
  })
})
</script>

<style lang="scss" scoped>
canvas {
  position: absolute;
  height: 100%;
  width: 100%;
}
</style>
