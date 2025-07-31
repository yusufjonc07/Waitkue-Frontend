<template>
  <div class="relative flex h-full w-full justify-center overflow-hidden">
    <canvas ref="canvas" style="max-width: 100%"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

import type { Queues } from '../../../../data/charts/queueChartData'
import { queueColor } from '../../../../data/charts/queueChartData'

const { queues } = defineProps<{
  queues: Queues[]
}>()

Chart.register(...registerables)

const BR_THICKNESS = 5
const canvas = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

// Register background color plugin
Chart.register([
  {
    id: 'background-color',
    beforeDatasetDraw: function (chart) {
      const ctx = chart.ctx
      const config = chart.config

      config.data.datasets.forEach(function (_dataset, datasetIndex) {
        const meta = chart.getDatasetMeta(datasetIndex)
        if (meta.type === 'bar') {
          const bgColor = queueColor
          meta.data.forEach(function (bar) {
            ctx.fillStyle = bgColor
            ctx.fillRect(
              bar.x - BR_THICKNESS / 2,
              0,
              BR_THICKNESS,
              chart.chartArea.bottom
            )
          })
        }
      })
    },
  },
])

/**
 * Renders the chart or updates it if it already exists
 */
function renderChart() {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  // Destroy existing chart
  if (chart) {
    chart.destroy()
  }

  // Create a new chart with current data
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: queues.map(({ month }) => month),
      datasets: [
        {
          data: queues.map(({ tickets }) => tickets),
          backgroundColor: '#000',
          barThickness: BR_THICKNESS,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          type: 'category',
          stacked: true,
          grid: { display: false },
        },
        y: {
          type: 'linear',
          display: true,
          beginAtZero: true,
          ticks: {
            callback: (value) => Number(value),
          },
        },
      },
    },
  })
}

// Initial render
onMounted(() => {
  nextTick(() => {
    renderChart()
  })
})

// Watch for prop changes and update chart
watch(
  () => queues,
  () => {
    renderChart()
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
canvas {
  position: absolute;
  height: 100%;
  width: 100%;
}
</style>
