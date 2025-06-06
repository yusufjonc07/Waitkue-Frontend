export const sleep = (ms = 0) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** Validation */
export const validators = {
  email: (v: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(v) || 'Please enter a valid email address'
  },
  required: (v: any) => !!v || 'This field is required',
}

export function buildImageUrl(imageUrl: string | undefined): string | null {
  if (!imageUrl) return null
  const base = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')
  const path = imageUrl.replace(/^\//, '')
  return `${base}/${path}`
}
