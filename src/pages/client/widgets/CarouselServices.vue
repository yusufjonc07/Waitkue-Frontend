<script setup lang="ts">
import { useModal } from 'vuestic-ui'
import { Service } from '../../services/types'
import { PropType, toRef, computed, ref } from 'vue'
import { Pagination, Sorting } from '../../../data/pages/services'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const props = defineProps({
    services: {
        type: Array as PropType<Service[]>,
        required: true,
    },
    loading: { type: Boolean, default: false },
    pagination: { type: Object as PropType<Pagination>, required: true },
    sortBy: { type: String as PropType<Sorting['sortBy']>, required: true },
    sortingOrder: { type: String as PropType<Sorting['sortingOrder']>, default: null },
})

const emit = defineEmits<{
    (event: 'reserveTicket', service: Service): void
}>()

const services = toRef(props, 'services')
const { confirm } = useModal()

const totalPages = computed(() =>
    Math.ceil(props.pagination.total / props.pagination.perPage)
)

// Carousel scrolling logic
const carouselRef = ref<HTMLElement | null>(null)

const scrollLeft = () => {
    carouselRef.value?.scrollBy({ left: -300, behavior: 'smooth' })
}

const scrollRight = () => {
    carouselRef.value?.scrollBy({ left: 300, behavior: 'smooth' })
}
</script>

<template>
    <div>
        <div v-if="loading" class="flex justify-center py-10">
            <VaProgressCircle indeterminate size="large" />
        </div>

        <div v-else class="relative flex items-center gap-2">
            <VaButton color="transparent" class="arrow left" @click="scrollLeft">
                <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 12H4M4 12L10 18M4 12L10 6" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </VaButton>
            <div class="carousel" ref="carouselRef">
                <div v-for="service in services" :key="service.id" class="card-wrapper">

                    <VaCard :bordered="false" class="min-w-[260px] max-w-xs">
                        <VaCardTitle>{{ service.name }}</VaCardTitle>
                        <VaCardContent>
                            <div class="flex flex-col gap-2">
                                <p class="truncate text-sm text-gray-600">
                                    <strong>Description:</strong> {{ service.description }}
                                </p>
                                <p class="text-sm">
                                    <strong>Available Days:</strong> {{ service.available_days }}
                                </p>
                                <p class="text-sm"><strong>Room:</strong> {{ service.room }}</p>
                                <p class="text-sm">
                                    <strong>From:</strong> {{ service.from_time }} → <strong>To:</strong>
                                    {{ service.to_time }}
                                </p>
                                <p class="text-sm"><strong>Avg Minutes:</strong> {{ service.avg_minute }}</p>

                                <div v-if="service.image_url" class="pt-2">
                                    <img :src="BASE_URL + service.image_url" alt="Service Image"
                                        class="h-32 w-full rounded object-cover" />
                                </div>
                                <VaButton @click="$emit('reserveTicket', service)">
                                    Reserve now
                                </VaButton>
                            </div>
                        </VaCardContent>
                    </VaCard>
                </div>
            </div>

            <VaButton color="transparent" class="arrow right" @click="scrollRight">
                <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </VaButton>
        </div>

        <div v-if="totalPages > 1" class="mt-6 text-center text-sm text-gray-500">
            Showing page {{ props.pagination.page }} of {{ totalPages }}
        </div>
    </div>
</template>

<style scoped>
.carousel {
    display: flex;
    overflow-x: auto;
    gap: 1rem;
    padding: 1rem 0;
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory;
}

.card-wrapper {
    flex: 0 0 auto;
    scroll-snap-align: start;
}

.arrow {
    background-color: #334155;
    /* dark slate */
    color: white;
    border: none;
    font-size: 1.5rem;
    padding: 0.5rem 1rem;
    border-radius: 50%;
    cursor: pointer;
    user-select: none;
    transition: background 0.2s;
}

.arrow:hover {
    background-color: #1e293b;
}
</style>
