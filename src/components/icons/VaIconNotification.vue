<template>
  <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path
      :fill="color"
      d="M10 20c1.1 0 2-.9 2-2H8c0 1.1.9 2 2 2zm6-6V9c0-3.07-1.63-5.64-4.5-6.32V2c0-.83-.67-1.5-1.5-1.5S8.5 1.17 8.5 2v.68C5.64 3.36 4 5.92 4 9v5l-2 2v1h16v-1l-2-2zm-2 1H6V9c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6zM5.58 2.08L4.15.65C1.75 2.48.17 5.3.03 8.5h2a8.445 8.445 0 0 1 3.55-6.42zM17.97 8.5h2c-.15-3.2-1.73-6.02-4.12-7.85l-1.42 1.43a8.495 8.495 0 0 1 3.54 6.42z"
    />
  </svg>
</template>

<script lang="ts" setup>
  withDefaults(
    defineProps<{
      color?: string
    }>(),
    {
      color: 'inherit',
    },
  )
</script>
