import api from './api'
import type { University, UniversityCreateRequest, PaginatedResponse } from '../types/api'

export const universityService = {
  getList: (params?: { page?: number; pageSize?: number; keyword?: string }) =>
    api.get<PaginatedResponse<University>>('/universities', { params }),

  getById: (id: string) => api.get<University>(`/universities/${id}`),

  create: (data: UniversityCreateRequest) => api.post<University>('/universities', data),

  update: (id: string, data: Partial<UniversityCreateRequest>) =>
    api.put<University>(`/universities/${id}`, data),

  delete: (id: string) => api.delete(`/universities/${id}`),
}
