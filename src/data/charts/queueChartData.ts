import api from '../../services/api'

export const queueColor = '#49A8FF'
export const months: string[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export type Queues = {
  month: string
  tickets: number
}

export type Services = {
  serviceName: string
  tickets: number
}

export const getQueues = async (year: number) => {
  return await api.request(api.reportQueues(year))
}

export const getServices = async (year: number, month: number) => {
  return await api.request(api.reportServices(year, month))
}

export const getQueuePerMonth = (month: string, queues: Queues[]): Queues => {
  const queue = queues.find(queue => queue.month === month)
  return queue || { month, tickets: 0 }
}

export const formatMoney = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}
