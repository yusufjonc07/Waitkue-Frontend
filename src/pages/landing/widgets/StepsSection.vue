<template>
  <section class="bg-slate-50" id="steps-section">
    <div class="space-y-24 py-16">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="relative py-20 overflow-hidden"
      >
        <!-- Background with overlay -->
        <div
          v-if="step.bgImage"
          class="absolute inset-0 w-full h-full bg-no-repeat bg-cover bg-center z-0 opacity-40"
          :style="`background-image: url(${step.bgImage});`"
        >
          <div class="absolute inset-0 bg-white/50 backdrop-blur-sm"></div>
        </div>

        <!-- Content container -->
        <div
          :class="[
            'relative z-10 max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16',
            index % 2 !== 0 ? 'md:flex-row-reverse' : ''
          ]"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <!-- Image Container -->
          <div class="md:w-1/2 w-full">
            <div class="relative group">
              <img
                :src="step.image"
                :alt="step.title"
                class="step-image w-full transition-transform duration-300 group-hover:scale-102"
                :id="index+`-step`"
              />
            </div>
          </div>

          <!-- Text Content -->
          <div class="md:w-1/2 w-full text-center md:text-left space-y-6">
            <span class="text-blue-600 font-semibold text-lg">
              Step {{ index + 1 }}
            </span>
            <h3 class="text-4xl font-bold text-gray-900 leading-tight">
              {{ step.title }}
            </h3>
            <p class="text-gray-600 text-xl leading-relaxed">
              {{ step.description }}
            </p>
            <div class="pt-4">
              <va-button
                :href="`#${index+1}-step`"
                v-if="step.buttonText"
                color="primary"
                class="transform transition hover:scale-105 duration-300 ease-in-out"
              >
                {{ step.buttonText }}
                <i class="fas fa-arrow-right ml-2"></i>
              </va-button>
            </div>
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
    description: 'Choose from our wide range of available services and join the queue with just a few clicks.',
    image: '/step1.png',
    buttonText: 'Join Now',
    bgImage: "/stacked-waves-haikei.png"
  },
  // Add more steps as needed
]

onMounted(() => {
  AOS.init({
    duration: 1000,
    once: true,
    offset: 150,
    easing: 'ease-out-cubic'
  })

  document.querySelector('html').style.scrollBehavior = 'smooth'
})
</script>

<style lang="scss">
.step-image {
  width: 100%;
  max-width: 600px;
  position: relative;
  z-index: 1;
  // filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
}

/* Custom animation for image hover */
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.group:hover .step-image {
  animation: float 3s ease-in-out infinite;
}


/* Responsive adjustments */
@media (max-width: 768px) {
  .space-y-24 {
    padding: 2rem 0;
  }
  
  .step-image {
    max-width: 100%;
  }
}
</style>
