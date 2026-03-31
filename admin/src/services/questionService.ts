import api from './api'
import type { PaginatedResponse } from '../types/api'

interface Question {
  id: string
  type: 'choice' | 'qa' | 'calculation'
  content: string
  subject: string
  knowledgePoint: string
  difficulty: '简单' | '中等' | '困难'
  source?: string
  year?: number
  status: 'active' | 'inactive'
  reviewStatus: 'pending' | 'approved' | 'rejected'
}

interface QuestionQuery {
  page?: number
  pageSize?: number
  subject?: string
  difficulty?: string
  reviewStatus?: string
  keyword?: string
}

export const questionService = {
  getList: (params?: QuestionQuery) =>
    api.get<PaginatedResponse<Question>>('/questions', { params }),

  getById: (id: string) => api.get<Question>(`/questions/${id}`),

  create: (data: Omit<Question, 'id'>) => api.post<Question>('/questions', data),

  update: (id: string, data: Partial<Question>) =>
    api.put<Question>(`/questions/${id}`, data),

  delete: (id: string) => api.delete(`/questions/${id}`),

  batchDelete: (ids: string[]) => api.post('/questions/batch-delete', { ids }),

  review: (id: string, status: 'approved' | 'rejected', reason?: string) =>
    api.post(`/questions/${id}/review`, { status, reason }),
}
