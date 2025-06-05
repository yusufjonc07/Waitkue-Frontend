// src/data/auth.ts
import api from '../../services/api'
import { Client, NewClient, User, UserRole } from '../../pages/users/types'
import { handleApiError } from '../../services/handleApiError'

export const loginUser = async (data: { email: string; password: string }) => {
  try {
    const params = new URLSearchParams()
    params.append('username', data.email)
    params.append('password', data.password)
    params.append('scope', 'me items') // Optional: match your backend

    const response = await fetch(api.login(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    })

    const result = await response.json()

    if (!response.ok) {
      throw result
    }

    return result
  } catch (error) {
    handleApiError(error, 'Login failed')
    throw error
  }
}

export const registerUser = async (data: { email: string; password: string }) => {
  const headers = new Headers({ 'Content-Type': 'application/json' })

  const response = await fetch(api.register(), {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  }).then(r => r.json())

  if (response?.error) {
    throw new Error(response.error)
  }

  return response.user as User
}

export const registerClient = async (data: NewClient) => {
  const response = await api.request(api.client(), {
    method: 'POST',
    body: JSON.stringify(data),
  })

  if (response?.error) {
    throw new Error(response.error)
  }

  return response as Client
}

export const fetchCurrentUser = async (): Promise<User> => {
  const response = await fetch(api.me()).then(r => r.json())

  if (response?.error) {
    throw new Error(response.error)
  }

  return response.user as User
}
