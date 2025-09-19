// contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}           

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    if (token) {
      // Verify token is valid
      verifyToken(token)
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async (token: string) => {
    try {
      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(response.data.user)
    } catch (error) {
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

// contexts/AuthContext.tsx
const login = async (email: string, password: string) => {
  try {
    const response = await axios.post('/api/auth/login', {
      email,
      password
    });
    
    const { token, user: userData } = response.data;
    localStorage.setItem('token', token);
    setUser(userData);
    
    // IMPORTANT: Don't redirect here - let the component handle it
    return { success: true };
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message || 'Login failed';
    return { success: false, error: errorMessage };
  }
}

const register = async (name: string, email: string, password: string) => {
  try {
    const response = await axios.post('/api/auth/register', {
      name,
      email,
      password
    });
    
    const { token, user: userData } = response.data;
    localStorage.setItem('token', token);
    setUser(userData);
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
    throw new Error(errorMessage);
  }
}

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/auth/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}