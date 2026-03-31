import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  username: string
  email: string
  realName: string
  avatar?: string
  role: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,

      login: async (username: string, password: string) => {
        // Mock login - 实际项目中应该调用API
        if (username === 'admin' && password === 'admin123') {
          const mockUser: User = {
            id: '1',
            username: 'admin',
            email: 'admin@example.com',
            realName: '系统管理员',
            role: 'admin',
          }
          const mockToken = 'mock-jwt-token-' + Date.now()

          set({
            isAuthenticated: true,
            user: mockUser,
            token: mockToken,
          })
        } else {
          throw new Error('用户名或密码错误')
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
        })
      },

      setUser: (user: User) => {
        set({ user })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
