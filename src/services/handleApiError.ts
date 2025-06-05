import { useToast } from 'vuestic-ui'

export const handleApiError = (error: unknown, defaultMessage = 'Something went wrong') => {
  const { init } = useToast()

  let message = defaultMessage

  if (error instanceof Error) {
    message = error.message
  }

  // Custom FastAPI error structure example:
  if (typeof error === 'object' && error !== null && 'detail' in error) {
    const detail = (error as any).detail

    if (typeof detail === 'string') {
      message = detail
    } else if (Array.isArray(detail) && detail[0]?.msg) {
      message = detail.map(d => d.msg).join(', ')
    }
  }

  init({ message, color: 'danger' })

  console.error('API Error:', error) // Optional: Log for dev
}
