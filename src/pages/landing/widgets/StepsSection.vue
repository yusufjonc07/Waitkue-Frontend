<template>
  <section class="bg-gray-50" id="steps-section">
    <div class="space-y-24">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="relative py-20"
      >
        <!-- Full-width background -->
        <div
          v-if="step.bgImage"
          class="absolute inset-0 w-full h-full bg-no-repeat bg-cover bg-center z-0"
          :style="`background-image: url(${step.bgImage});`"
        ></div>

        <!-- Content container -->
        <div
          :class="[
            'relative z-10 max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10',
            index % 2 !== 0 ? 'md:flex-row-reverse' : ''
          ]"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <!-- Image -->
          <div class="md:w-1/2 w-full">
            <img
              :src="step.image"
              :alt="step.title"
              class="object-cover step-image w-full"
              :id="index+`-step`"
            />
          </div>

          <!-- Text -->
          <div class="md:w-1/2 w-full text-center md:text-left space-y-4">
            <h3 class="text-3xl font-bold text-gray-800">
              #{{ index + 1 }} {{ step.title }}
            </h3>
            <p class="text-gray-600 text-lg">
              {{ step.description }}
            </p>
            <va-button
              :href="`#${index+1}-step`"
              v-if="step.buttonText"
              color="primary"
            >
              {{ step.buttonText }}
            </va-button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script setup>
import { onMounted } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

const steps = [
  {
    title: 'Select the Service',
    description: 'Choose a service and click Join the Queue.',
    image: '/step1.png',
    buttonText: 'Join Now',
    bgImage: "/stacked-waves-haikei.png"

  },
  {
    title: 'Get a Ticket',
    description: 'Your ticket number and time will be displayed.',
    image: '/step1.png',
    buttonText: 'View Ticket',
    bgImage: "/stacked-waves-haikei.png"
  },
  {
    title: 'Wait for Your Turn',
    description: 'Relax while you wait — we’ll notify you!',
    image: '/step1.png',
    buttonText: 'Track Status',
    bgImage: "/stacked-waves-haikei.png"
  },
]

onMounted(() => {
  AOS.init({
    duration: 800,
    once: true,
    offset: 100,
  })

  document.querySelector('html').style.scrollBehavior = 'smooth'
})
</script>

<style lang="scss">
.step-image {
  width: 100%;
  max-width: 600px;
}

</style>
