import api from './api'

interface KnowledgePoint {
  id: string
  name: string
  parentId: string | null
  subjectId: string
  level: number
  order: number
  children?: KnowledgePoint[]
}

export const knowledgePointService = {
  getTree: (subjectId?: string) =>
    api.get<KnowledgePoint[]>('/knowledge-points/tree', { params: { subjectId } }),

  create: (data: Omit<KnowledgePoint, 'id' | 'children'>) =>
    api.post<KnowledgePoint>('/knowledge-points', data),

  update: (id: string, data: Partial<KnowledgePoint>) =>
    api.put<KnowledgePoint>(`/knowledge-points/${id}`, data),

  delete: (id: string) => api.delete(`/knowledge-points/${id}`),

  updateOrder: (items: { id: string; order: number }[]) =>
    api.post('/knowledge-points/update-order', { items }),
}
