import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const API_URL = '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const { refreshToken } = useAuthStore.getState()
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          })
          const { token, refreshToken: newRefreshToken } = response.data
          useAuthStore.getState().refreshAuth(token, newRefreshToken)
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        } catch {
          useAuthStore.getState().logout()
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api

// Types
export interface Sport {
  id: number
  name: string
  icon?: string
}

export interface Competition {
  id: number
  name: string
  sport: Sport
  logo?: string
  country?: string
}

export interface Team {
  id: number
  name: string
  logo?: string
  sport: Sport
  competition?: Competition
}

export interface Match {
  id: number
  homeTeam: Team
  awayTeam: Team
  competition: Competition
  startTime: string
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED'
  score?: {
    home: number
    away: number
  }
  minute?: number
}

export interface News {
  id: number
  title: string
  content: string
  image?: string
  publishedAt: string
  sport?: Sport
  competition?: Competition
  source?: string
}

// API Functions
export const authApi = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password })
    return response.data
  },
  validate: async (token: string) => {
    const response = await api.post('/auth/validate', { token })
    return response.data
  },
  refresh: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh', { refreshToken })
    return response.data
  },
}

export const sportsApi = {
  getAll: async () => {
    const response = await api.get('/sports')
    return response.data
  },
}

export const competitionsApi = {
  getAll: async () => {
    const response = await api.get('/competitions')
    return response.data
  },
  getById: async (id: number) => {
    const response = await api.get(`/competitions/${id}`)
    return response.data
  },
}

export const matchesApi = {
  getAll: async () => {
    const response = await api.get('/matches')
    return response.data
  },
  getLive: async () => {
    const response = await api.get('/matches/live')
    return response.data
  },
  getByCompetition: async (competitionId: number) => {
    const response = await api.get(`/matches/competition/${competitionId}`)
    return response.data
  },
}

export const teamsApi = {
  getAll: async () => {
    const response = await api.get('/teams')
    return response.data
  },
  getById: async (id: number) => {
    const response = await api.get(`/teams/${id}`)
    return response.data
  },
}

export const newsApi = {
  getAll: async () => {
    const response = await api.get('/news')
    return response.data
  },
  getById: async (id: number) => {
    const response = await api.get(`/news/${id}`)
    return response.data
  },
}