// pages/admin/bikes/edit/[id].tsx
import { withAdminAuth } from '@/components/withAdminAuth'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Bike, ArrowLeft, Trash2 } from 'lucide-react'

interface BikeType {
  id: string
  name: string
  description: string
  pricePerHour: number
  status: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE'
  trackingId?: string
  createdAt: string
  images?: { id: string; url: string }[]
}

function EditBike() {
  const router = useRouter()
  const { id } = router.query
  const [bike, setBike] = useState<BikeType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricePerHour: '',
    status: 'AVAILABLE' as const,
    trackingId: ''
  })

  useEffect(() => {
    if (!id) return

    const fetchBike = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`/api/bikes/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch bike')
        }
        
        const data = await response.json()
        setBike(data)
        setFormData({
          name: data.name,
          description: data.description || '',
          pricePerHour: data.pricePerHour.toString(),
          status: data.status,
          trackingId: data.trackingId || ''
        })
        setLoading(false)
      } catch (err) {
        setError('Failed to load bike details')
        setLoading(false)
        console.error('Error fetching bike:', err)
      }
    }

    fetchBike()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/bikes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          pricePerHour: parseFloat(formData.pricePerHour)
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update bike')
      }

      const updatedBike = await response.json()
      setBike(updatedBike)
      router.push('/admin/bikes')
    } catch (err: any) {
      setError(err.message || 'Failed to update bike')
      console.error('Error updating bike:', err)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this bike?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/bikes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete bike')
      }

      router.push('/admin/bikes')
    } catch (err) {
      setError('Failed to delete bike')
      console.error('Error deleting bike:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error || !bike) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6 text-center">
          <Bike className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Bike not found</h3>
          <p className="text-gray-600 mb-4">{error || 'The requested bike could not be found.'}</p>
          <button 
            onClick={() => router.push('/admin/bikes')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bikes
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <button 
        onClick={() => router.push('/admin/bikes')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Bikes
      </button>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Bike: {bike.name}</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Bike Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter bike name"
                />
              </div>

              <div>
                <label htmlFor="trackingId" className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking ID
                </label>
                <input
                  type="text"
                  id="trackingId"
                  name="trackingId"
                  value={formData.trackingId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter tracking ID"
                />
              </div>

              <div>
                <label htmlFor="pricePerHour" className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Hour *
                </label>
                <input
                  type="number"
                  id="pricePerHour"
                  name="pricePerHour"
                  required
                  step="0.01"
                  min="0"
                  value={formData.pricePerHour}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="RENTED">Rented</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter bike description"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash2 className="w-4 h-4 inline mr-2" />
                Delete Bike
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/bikes')}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Update Bike
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default withAdminAuth(EditBike, 'Edit Bike')