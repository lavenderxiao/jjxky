import api from './api'

interface DashboardStats {
  questionCount: number
  universityCount: number
  knowledgePointCount: number
  userCount: number
  pendingReviewCount: number
}

export const statsService = {
  getDashboard: () => api.get<DashboardStats>('/stats/dashboard'),
}
