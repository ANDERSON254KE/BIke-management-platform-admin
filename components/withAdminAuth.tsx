// components/withAdminAuth.tsx
import { ComponentType, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'
import AdminLayout from './AdminLayout'

export function withAdminAuth<P extends object>(WrappedComponent: ComponentType<P>, title?: string) {
  return function WithAdminAuth(props: P) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading) {
        if (!user || user.role !== 'ADMIN') {
          router.push('/auth/login')
        }
      }
    }, [user, loading, router])

    if (loading || !user || user.role !== 'ADMIN') {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    return (
      <AdminLayout title={title}>
        <WrappedComponent {...props} />
      </AdminLayout>
    )
  }
}