export type UserRole = 'admin' | 'client' | 'service_admin'
export type Genders = 'male' | 'female'

export type Client = {
  id: number
  firstname: string
  surename: string
  middlename: string
  fullname: string
  gender: Genders
  created_at: string
}

export type NewClient = {
  firstname: string
  surename: string
  middlename: string
  gender: Genders
}

export type User = {
  id: number
  email: string
  fullname: string
  role: UserRole
  username: string
  notes: string
  disabled: boolean
  profile: Client
}
