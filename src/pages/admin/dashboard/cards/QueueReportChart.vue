<template>
  <div class="relative flex h-full w-full justify-center overflow-hidden">
    <canvas ref="canvas" style="max-width: 100%"></canvas>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, nextTick } from 'vue'
  import { Chart, registerables } from 'chart.js'

  import type { Queues } from '../../../../data/charts/queueChartData'
  import { queueColor } from '../../../../data/charts/queueChartData'

  const { queues, months } = defineProps<{
    months: string[]
    queues: Queues[]
  }>()

  Chart.register(...registerables)

  const BR_THICKNESS = 5

  Chart.register([
    {
      id: 'background-color',
      beforeDatasetDraw: function (chart) {
        const ctx = chart.ctx
        const config = chart.config

        config.data.datasets.forEach(function (dataset, datasetIndex) {
          const meta = chart.getDatasetMeta(datasetIndex)
          if (meta.type === 'bar') {
            const bgColor = queueColor

            // Loop through each bar in the dataset
            meta.data.forEach(function (bar) {
              ctx.fillStyle = bgColor
              ctx.fillRect(bar.x - BR_THICKNESS / 2, 0, BR_THICKNESS, chart.chartArea.bottom)
            })
          }
        })
      },
    },
  ])

  const canvas = ref<HTMLCanvasElement | null>(null)

  onMounted(() => {
    console.log('Values', queues)

    nextTick(() => {
      if (canvas.value) {
        const ctx = canvas.value.getContext('2d')
        if (ctx) {
          new Chart(ctx, {
            type: 'bar',
            data: {
              labels: months,
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
                  type: 'category', // Default for bar
                  stacked: true,
                  grid: { display: false },
                },
                y: {
                  type: 'linear', // Needs to be registered!
                  display: true,
                  beginAtZero: true,
                  ticks: {
                    callback: value => Number(value),
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
