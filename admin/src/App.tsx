import { BrowserRouter } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import AuthLayout from './layouts/AuthLayout'
import MainLayout from './layouts/MainLayout'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <BrowserRouter>
      {isAuthenticated ? <MainLayout /> : <AuthLayout />}
    </BrowserRouter>
  )
}

export default App
