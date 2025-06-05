import { User } from '../users/types'
export type QueueStatus = 0 | 1 | 2 | 3

export type Service = {
  id: number
  name: string
  room: number
}

export type AvailableNumber = {
  queue_number: number
  time: string
  possible: boolean
}

export type Queue = {
  id: number
  number: number
  time: string
  step: number
  created_at: string
  service: Service
  client: User
}

export type NewQueue = {
  date: string // format: 'YYYY-MM-DD'
  comment: string
  number: number | null
  time: string | null
  step: number
  client_id: number | null
  service_id: number | null
}

export type Ticket = {
  queue_id: number
  number: number
  time: string
  service: string
}

export type Waitlist = {
  waiting: Ticket[]
  meeting: Ticket[]
}

export type CarouselItem = {
  src: string | null
  title: string
  subtitle: string
}
