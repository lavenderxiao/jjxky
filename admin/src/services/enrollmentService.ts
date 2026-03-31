import api from './api'
import type { PaginatedResponse } from '../types/api'

interface Enrollment {
  id: string
  year: number
  universityId: string
  universityName: string
  major: string
  planCount: number
  actualCount: number
  applicantCount: number
  admissionRate: number
}

export const enrollmentService = {
  getList: (params?: { page?: number; pageSize?: number; year?: number; universityId?: string }) =>
    api.get<PaginatedResponse<Enrollment>>('/enrollments', { params }),

  create: (data: Omit<Enrollment, 'id' | 'admissionRate'>) =>
    api.post<Enrollment>('/enrollments', data),

  update: (id: string, data: Partial<Enrollment>) =>
    api.put<Enrollment>(`/enrollments/${id}`, data),

  delete: (id: string) => api.delete(`/enrollments/${id}`),
}
