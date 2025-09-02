// pages/index.tsx
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'
import Link from 'next/link'
import PublicLayout from '@/components/PublicLayout'
import { Bike, Shield, UserPlus, LogIn } from 'lucide-react'

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
    <PublicLayout title="BikeRental Admin Platform">
      <div className="flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <div className="inline-flex p-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl mb-6">
              <Bike className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">BikeRental Platform</h1>
            <p className="text-xl text-gray-600 mb-8">Manage your bike rental business with ease</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="inline-flex p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Admin Login</h3>
              <p className="text-gray-600 mb-6">Access the administrative dashboard to manage bikes, bookings, and users</p>
              <Link href="/auth/login" className="block w-full text-center bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                Admin Login
              </Link>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="inline-flex p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Admin Registration</h3>
              <p className="text-gray-600 mb-6">Create a new admin account to manage the bike rental platform</p>
              <Link href="/auth/register" className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Register as Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}


