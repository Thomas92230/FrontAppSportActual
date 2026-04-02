import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const API_URL = '/api'

// Adapters to normalize backend fields to frontend types
const adaptMatch = (m: any): Match => ({
  id: m.id,
  homeTeam: m.homeTeam,
  awayTeam: m.awayTeam,
  competition: m.competition,
  startTime: m.matchDate,
  status: m.status as Match['status'],
  score: (m.homeScore != null || m.awayScore != null)
    ? { home: m.homeScore ?? 0, away: m.awayScore ?? 0 }
    : undefined,
  minute: m.currentMinute ? parseInt(m.currentMinute) : undefined,
})

const adaptNews = (n: any): News => ({
  id: n.id,
  title: n.title,
  content: n.content,
  image: n.imageUrl,
  publishedAt: n.publishedAt,
  sport: n.sport,
  competition: n.competition,
  source: n.source,
})

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
      const currentToken = useAuthStore.getState().token
      if (currentToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, null, {
            headers: { Authorization: `Bearer ${currentToken}` },
          })
          const { token } = response.data
          useAuthStore.getState().refreshAuth(token, token)
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
    const response = await api.get('/auth/validate', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  },
  refresh: async (token: string) => {
    const response = await api.post('/auth/refresh', null, {
      headers: { Authorization: `Bearer ${token}` },
    })
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
    return (response.data as any[]).map(adaptMatch)
  },
  getLive: async () => {
    const response = await api.get('/matches/live')
    return (response.data as any[]).map(adaptMatch)
  },
  getByCompetition: async (competitionId: number) => {
    const response = await api.get(`/matches/competition/${competitionId}`)
    return (response.data as any[]).map(adaptMatch)
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
    const items: any[] = response.data?.content ?? response.data
    return items.map(adaptNews)
  },
  getById: async (id: number) => {
    const response = await api.get(`/news/${id}`)
    return adaptNews(response.data)
  },
}