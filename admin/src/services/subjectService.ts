import api from './api'
import type { PaginatedResponse } from '../types/api'

interface Subject {
  id: string
  name: string
  code: string
  category: '公共课' | '专业课'
  status: 'active' | 'inactive'
}

export const subjectService = {
  getList: (params?: { page?: number; pageSize?: number; category?: string }) =>
    api.get<PaginatedResponse<Subject>>('/subjects', { params }),

  create: (data: Omit<Subject, 'id'>) => api.post<Subject>('/subjects', data),

  update: (id: string, data: Partial<Subject>) => api.put<Subject>(`/subjects/${id}`, data),

  delete: (id: string) => api.delete(`/subjects/${id}`),
}
