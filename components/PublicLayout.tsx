// components/PublicLayout.tsx
import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'
import { Bike, Menu, X, LogIn, UserPlus, Home, Shield } from 'lucide-react'

interface PublicLayoutProps {
  children: ReactNode
  title?: string
  showAuth?: boolean
}

export default function PublicLayout({ children, title, showAuth = true }: PublicLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const navigation = [
    { name: 'Home', href: '/', icon: Home, current: router.pathname === '/' },
    { name: 'Admin', href: '/admin', icon: Shield, current: router.pathname.startsWith('/admin') },
  ]

  const authNavigation = [
    { name: 'Admin Login', href: '/auth/login', icon: Shield },
    { name: 'Admin Register', href: '/auth/register', icon: UserPlus },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and main navigation */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center">
                  <Bike className="w-8 h-8 text-purple-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">BikeRental</span>
                </Link>
              </div>
              
              {/* Desktop navigation */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      item.current
                        ? 'border-purple-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Auth navigation */}
            {showAuth && (
              <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-700">Welcome, {user.name}</span>
                    <Link
                      href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
                    >
                      Dashboard
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    {authNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          router.pathname === item.href
                            ? 'bg-purple-100 text-purple-700'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              >
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${
                    item.current
                      ? 'bg-purple-50 border-purple-500 text-purple-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              ))}
            </div>
            
            {showAuth && (
              <div className="pt-4 pb-3 border-t border-gray-200">
                {user ? (
                  <div className="px-4">
                    <div className="text-base font-medium text-gray-800">{user.name}</div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                    <Link
                      href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                      className="mt-3 block w-full text-left px-4 py-2 text-base font-medium text-purple-600 hover:text-purple-500 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Go to Dashboard
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {authNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center pl-3 pr-4 py-2 text-base font-medium transition-colors ${
                          router.pathname === item.href
                            ? 'bg-purple-50 text-purple-700'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Page header */}
      {title && (
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          </div>
        </header>
      )}

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}