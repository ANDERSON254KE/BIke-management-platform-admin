// pages/index.tsx
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        // If user is logged in, redirect to admin dashboard
        router.push('/admin')
      } else {
        // If user is not logged in, redirect to login
        router.push('/auth/login')
      }
    }
  }, [user, loading, router])

  // Show loading spinner while checking authentication
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  )
}
