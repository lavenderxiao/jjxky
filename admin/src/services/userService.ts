import api from './api'
import type { PaginatedResponse } from '../types/api'

interface User {
  id: string
  username: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'inactive'
  createdAt: string
}

export const userService = {
  getList: (params?: { page?: number; pageSize?: number; role?: string }) =>
    api.get<PaginatedResponse<User>>('/users', { params }),

  create: (data: Omit<User, 'id' | 'createdAt'> & { password: string }) =>
    api.post<User>('/users', data),

  update: (id: string, data: Partial<User>) => api.put<User>(`/users/${id}`, data),

  delete: (id: string) => api.delete(`/users/${id}`),

  resetPassword: (id: string, newPassword: string) =>
    api.post(`/users/${id}/reset-password`, { password: newPassword }),
}
