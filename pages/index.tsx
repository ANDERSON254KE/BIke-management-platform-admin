// pages/index.tsx
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/admin')
    }
  }, [user, loading, router])

  if (loading) {
    return <LoadingSpinner />
  }

  return <AdminPortal />
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  )
}

function AdminPortal() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <PortalHeader />
          <PortalButtons />
          <UserLoginLink />
        </div>
      </div>
    </div>
  )
}

function PortalHeader() {
  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h2>
      <p className="text-gray-600">Access the administrative dashboard</p>
    </div>
  )
}

function PortalButtons() {
  return (
    <div className="space-y-4">
      <Link href="/auth/admin-login" legacyBehavior>
        <a className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          Admin Login
        </a>
      </Link>
      <Link href="/auth/register" legacyBehavior>
        <a className="block w-full text-center bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
          Create Account
        </a>
      </Link>
    </div>
  )
}

function UserLoginLink() {
  return (
    <div className="mt-6 pt-6 border-t border-gray-200 text-center">
      <Link href="/auth/login" legacyBehavior>
        <a className="text-sm text-gray-500 hover:text-gray-700">
          User Login
        </a>
      </Link>
    </div>
  )
}
