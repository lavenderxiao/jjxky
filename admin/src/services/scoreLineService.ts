import api from './api'
import type { PaginatedResponse } from '../types/api'

interface ScoreLine {
  id: string
  year: number
  universityId: string
  universityName: string
  major: string
  totalScore: number
  politicsScore: number
  englishScore: number
  subject1Score: number
  subject2Score: number
}

export const scoreLineService = {
  getList: (params?: { page?: number; pageSize?: number; year?: number; universityId?: string }) =>
    api.get<PaginatedResponse<ScoreLine>>('/score-lines', { params }),

  create: (data: Omit<ScoreLine, 'id'>) => api.post<ScoreLine>('/score-lines', data),

  update: (id: string, data: Partial<ScoreLine>) =>
    api.put<ScoreLine>(`/score-lines/${id}`, data),

  delete: (id: string) => api.delete(`/score-lines/${id}`),

  import: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/score-lines/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  export: (params?: { year?: number; universityId?: string }) =>
    api.get('/score-lines/export', { params, responseType: 'blob' }),
}
