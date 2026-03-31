// API Response Types
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    username: string
    name: string
    role: string
    avatar?: string
  }
}

// University Types
export interface University {
  id: string
  name: string
  code: string
  province: string
  city: string
  level: string[]
  website?: string
  admissionWebsite?: string
  createdAt: string
  updatedAt: string
}

export interface UniversityCreateRequest {
  name: string
  code: string
  province: string
  city: string
  level: string[]
  website?: string
  admissionWebsite?: string
}
