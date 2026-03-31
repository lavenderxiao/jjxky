import api from './api'
import type { LoginRequest, LoginResponse } from '../types/api'

export const authService = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/auth/login', data),

  logout: () => api.post('/auth/logout'),

  getCurrentUser: () => api.get('/auth/me'),
}
