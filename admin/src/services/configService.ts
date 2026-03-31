import api from './api'

interface AgentConfig {
  name: string
  displayName: string
  welcomeMessage: string
  description?: string
  primaryColor?: string
  icon?: string
}

export const configService = {
  getAgentConfig: () => api.get<AgentConfig>('/config/agent'),

  updateAgentConfig: (data: Partial<AgentConfig>) =>
    api.put<AgentConfig>('/config/agent', data),

  uploadIcon: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post<{ url: string }>('/config/upload-icon', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
