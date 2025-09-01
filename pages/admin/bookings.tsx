import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { 
  Calendar, 
  User, 
  Bike, 
  Clock, 
  DollarSign,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Filter
} from 'lucide-react'

interface BookingType {
  id: string
  userId: string
  bikeId: string
  bikeName: string
  userName: string
  userEmail: string
  startTime: string
  endTime: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
  totalPrice: number
  createdAt: string
}

export default function AdminBookings() {
  const { user, loading } = useAuth()
  const [bookings, setBookings] = useState<BookingType[]>([])
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [filter, setFilter] = useState<string>('ALL')

  useEffect(() => {
    // Mock bookings data
    setBookings([
      {
        id: 'booking-1',
        userId: 'user-1',
        bikeId: 'bike-1',
        bikeName: 'Electric City Cruiser',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        startTime: '2024-01-20T10:00:00Z',
        endTime: '2024-01-20T14:00:00Z',
        status: 'APPROVED',
        totalPrice: 60.00,
        createdAt: '2024-01-19T15:30:00Z'
      },
      {
        id: 'booking-2',
        userId: 'user-2',
        bikeId: 'bike-2',
        bikeName: 'Mountain Explorer Pro',
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        startTime: '2024-01-21T09:00:00Z',
        endTime: '2024-01-21T17:00:00Z',
        status: 'PENDING',
        totalPrice: 96.00,
        createdAt: '2024-01-20T08:15:00Z'
      },
      {
        id: 'booking-3',
        userId: 'user-3',
        bikeId: 'bike-3',
        bikeName: 'Urban Scooter X1',
        userName: 'Mike Johnson',
        userEmail: 'mike@example.com',
        startTime: '2024-01-19T12:00:00Z',
        endTime: '2024-01-19T16:00:00Z',
        status: 'COMPLETED',
        totalPrice: 40.00,
        createdAt: '2024-01-18T14:20:00Z'
      },
      {
        id: 'booking-4',
        userId: 'user-4',
        bikeId: 'bike-4',
        bikeName: 'E-Bike Comfort Plus',
        userName: 'Sarah Wilson',
        userEmail: 'sarah@example.com',
        startTime: '2024-01-22T11:00:00Z',
        endTime: '2024-01-22T15:00:00Z',
        status: 'REJECTED',
        totalPrice: 56.00,
        createdAt: '2024-01-21T10:45:00Z'
      }
    ])
    setLoadingBookings(false)
  }, [])

  const handleStatusChange = (bookingId: string, newStatus: BookingType['status']) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'REJECTED':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-blue-500" />
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  const filteredBookings = filter === 'ALL' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter)

  if (loading || loadingBookings) {
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
                <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
                  <p className="text-sm text-gray-600">Manage customer bookings</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="ALL">All Bookings</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {bookings.filter(b => b.status === 'PENDING').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'APPROVED').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${bookings.reduce((sum, b) => sum + b.totalPrice, 0).toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bike
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-purple-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{booking.userName}</div>
                          <div className="text-sm text-gray-500">{booking.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Bike className="w-5 h-5 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">{booking.bikeName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>{new Date(booking.startTime).toLocaleDateString()}</div>
                        <div className="text-gray-500">
                          {new Date(booking.startTime).toLocaleTimeString()} - {new Date(booking.endTime).toLocaleTimeString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${booking.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(booking.status)}
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {booking.status === 'PENDING' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusChange(booking.id, 'APPROVED')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(booking.id, 'REJECTED')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {booking.status === 'APPROVED' && (
                        <button
                          onClick={() => handleStatusChange(booking.id, 'COMPLETED')}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Complete
                        </button>
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