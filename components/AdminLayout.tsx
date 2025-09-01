// components/AdminLayout.tsx
import { ReactNode } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'
import { BarChart3, Bike, Calendar, AlertCircle, Users, Settings, LogOut } from 'lucide-react'

interface AdminLayoutProps {
  children: ReactNode
  title?: string
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: BarChart3, current: router.pathname === '/admin' },
  { name: 'Bikes', href: '/admin/bikes', icon: Bike, current: router.pathname.startsWith('/admin/bikes') },
  { name: 'Bookings', href: '/admin/bookings', icon: Calendar, current: router.pathname.startsWith('/admin/bookings') },
  { name: 'SOS Alerts', href: '/admin/sos', icon: AlertCircle, current: router.pathname.startsWith('/admin/sos') },
  { name: 'Users', href: '/admin/users', icon: Users, current: router.pathname.startsWith('/admin/users') },
  { name: 'Settings', href: '/admin/settings', icon: Settings, current: router.pathname.startsWith('/admin/settings') },
]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-gray-900">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-800">
            <BarChart3 className="w-8 h-8 text-white" />
            <h1 className="ml-3 text-xl font-bold text-white">Admin Panel</h1>
          </div>
          
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    item.current
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* User section */}
          <div className="flex-shrink-0 flex bg-gray-800 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs font-medium text-gray-400">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        {/* Top header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{title || 'Dashboard'}</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>

      {/* Mobile sidebar backdrop (can be implemented later) */}
    </div>
  )
}