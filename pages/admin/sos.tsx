import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { 
  AlertTriangle, 
  User, 
  MapPin, 
  Clock, 
  CheckCircle,
  ArrowLeft,
  Phone,
  MessageSquare
} from 'lucide-react'

interface SOSAlertType {
  id: string
  userId: string
  userName: string
  userEmail: string
  message: string
  location?: string
  status: 'PENDING' | 'RESOLVED'
  createdAt: string
}

export default function AdminSOS() {
  const { user, loading } = useAuth()
  const [alerts, setAlerts] = useState<SOSAlertType[]>([])
  const [loadingAlerts, setLoadingAlerts] = useState(true)

  useEffect(() => {
    // Mock SOS alerts data
    setAlerts([
      {
        id: 'sos-1',
        userId: 'user-1',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        message: 'Bike broke down on Main Street. Need immediate assistance!',
        location: 'Main Street, Downtown',
        status: 'PENDING',
        createdAt: '2024-01-20T14:30:00Z'
      },
      {
        id: 'sos-2',
        userId: 'user-2',
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        message: 'Accident occurred. Minor injury, need help.',
        location: 'Park Avenue, Central Park',
        status: 'PENDING',
        createdAt: '2024-01-20T13:15:00Z'
      },
      {
        id: 'sos-3',
        userId: 'user-3',
        userName: 'Mike Johnson',
        userEmail: 'mike@example.com',
        message: 'Flat tire, unable to continue journey.',
        location: 'Oak Street, Residential Area',
        status: 'RESOLVED',
        createdAt: '2024-01-19T16:45:00Z'
      },
      {
        id: 'sos-4',
        userId: 'user-4',
        userName: 'Sarah Wilson',
        userEmail: 'sarah@example.com',
        message: 'Lost and need directions back to rental station.',
        status: 'RESOLVED',
        createdAt: '2024-01-19T11:20:00Z'
      }
    ])
    setLoadingAlerts(false)
  }, [])

  const handleResolveAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, status: 'RESOLVED' as const } : alert
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-red-100 text-red-800'
      case 'RESOLVED':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'RESOLVED':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const pendingAlerts = alerts.filter(alert => alert.status === 'PENDING')
  const resolvedAlerts = alerts.filter(alert => alert.status === 'RESOLVED')

  if (loading || loadingAlerts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">SOS Alert Management</h1>
                  <p className="text-sm text-gray-600">Monitor and respond to emergency alerts</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">{pendingAlerts.length}</div>
                <div className="text-sm text-gray-600">Pending Alerts</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-red-600">{pendingAlerts.length}</p>
              </div>
              <Clock className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{resolvedAlerts.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Pending Alerts */}
        {pendingAlerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
              Urgent - Pending Alerts
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingAlerts.map((alert) => (
                <div key={alert.id} className="card border-l-4 border-red-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(alert.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(alert.status)}`}>
                        {alert.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(alert.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-red-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{alert.userName}</div>
                      <div className="text-sm text-gray-500">{alert.userEmail}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
                      <p className="text-gray-700">{alert.message}</p>
                    </div>
                  </div>

                  {alert.location && (
                    <div className="mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600">{alert.location}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleResolveAlert(alert.id)}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Mark Resolved</span>
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>Call</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Alerts History */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {alerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{alert.userName}</div>
                          <div className="text-sm text-gray-500">{alert.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{alert.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {alert.location || 'Not provided'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(alert.status)}
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(alert.status)}`}>
                          {alert.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(alert.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {alert.status === 'PENDING' ? (
                        <button
                          onClick={() => handleResolveAlert(alert.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Resolve
                        </button>
                      ) : (
                        <span className="text-gray-400">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}