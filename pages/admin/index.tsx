// pages/admin/index.tsx
import { useState, useEffect } from 'react'
import { withAdminAuth } from '@/components/withAdminAuth'
import Link from 'next/link'
import { BarChart3, Bike, Calendar, AlertCircle, Users, Settings } from 'lucide-react'

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBikes: 0,
    availableBikes: 0,
    totalBookings: 0,
    totalAlerts: 0,
    totalUsers: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard stats')
        }
        
        const data = await response.json()
        setStats(data)
        setLoading(false)
      } catch (err) {
        setError('Failed to load dashboard data')
        setLoading(false)
        console.error('Error fetching stats:', err)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link 
            href="/admin/bikes" 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 flex items-center"
          >
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <Bike className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Manage Bikes</h3>
              <p className="text-gray-600">Add, edit, or delete bikes</p>
            </div>
          </Link>

          <Link 
            href="/admin/bookings" 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 flex items-center"
          >
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Manage Bookings</h3>
              <p className="text-gray-600">View and manage bookings</p>
            </div>
          </Link>

          <Link 
            href="/admin/sos" 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 flex items-center"
          >
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">SOS Alerts</h3>
              <p className="text-gray-600">View emergency alerts</p>
            </div>
          </Link>

          <Link 
            href="/admin/users" 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 flex items-center"
          >
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Admin Users</h3>
              <p className="text-gray-600">View and manage admin users</p>
            </div>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3">
                <Bike className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bikes</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalBikes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-3">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="rounded-full bg-red-100 p-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">SOS Alerts</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalAlerts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withAdminAuth(AdminDashboard, 'Dashboard')