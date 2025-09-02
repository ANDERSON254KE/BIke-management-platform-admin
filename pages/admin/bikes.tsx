// pages/admin/bikes.tsx
import { withAdminAuth } from '@/components/withAdminAuth'
import { useState, useEffect } from 'react'
import { Bike, Plus, Edit3, Trash2, CheckCircle, Clock, Wrench, ArrowLeft, X, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

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

function AdminBikes() {
  const [bikes, setBikes] = useState<BikeType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newBike, setNewBike] = useState({
    name: '',
    description: '',
    pricePerHour: '',
    status: 'AVAILABLE' as const,
    trackingId: ''
  })
  const [images, setImages] = useState<string[]>([])
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; bikeId: string; bikeName: string }>({
    show: false,
    bikeId: '',
    bikeName: ''
  })

  // Fetch bikes from API
  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('/api/bikes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch bikes')
        }
        
        const data = await response.json()
        setBikes(data)
        setLoading(false)
      } catch (err) {
        setError('Failed to load bikes')
        setLoading(false)
        console.error('Error fetching bikes:', err)
      }
    }

    fetchBikes()
  }, [])

  // Generate random tracking ID
  const generateRandomTrackingId = () => {
    const prefix = 'BIKE';
    const randomNum = Math.floor(Math.random() * 9000) + 1000; // 4-digit random number
    return `${prefix}${randomNum}`;
  }

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (selectedFiles.length + files.length > 10) {
      alert('Maximum 10 images allowed');
      return;
    }

    const newFiles = Array.from(files);
    const newImages = newFiles.map(file => URL.createObjectURL(file));
    
    setSelectedFiles(prev => [...prev, ...newFiles]);
    setImages(prev => [...prev, ...newImages]);
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddBike = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('token')
      
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('name', newBike.name)
      formData.append('description', newBike.description)
      formData.append('pricePerHour', newBike.pricePerHour)
      formData.append('status', newBike.status)
      formData.append('trackingId', newBike.trackingId || generateRandomTrackingId())
      
      // Add image files
      selectedFiles.forEach((file) => {
        formData.append('images', file)
      })

      const response = await fetch('/api/bikes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create bike')
      }

      const createdBike = await response.json()
      
      // Add the new bike to the list
      setBikes([createdBike, ...bikes])
      
      // Reset form
      setNewBike({
        name: '',
        description: '',
        pricePerHour: '',
        status: 'AVAILABLE',
        trackingId: ''
      })
      setImages([])
      setSelectedFiles([])
      setShowAddForm(false)
    } catch (err: any) {
      setError(err.message || 'Failed to add bike')
      console.error('Error adding bike:', err)
    }
  }

  const handleStatusChange = async (bikeId: string, newStatus: BikeType['status']) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/bikes/${bikeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        throw new Error('Failed to update bike status')
      }

      // Update local state
      setBikes(bikes.map(bike => 
        bike.id === bikeId ? { ...bike, status: newStatus } : bike
      ))
    } catch (err) {
      console.error('Error updating bike status:', err)
    }
  }

  const handleDeleteBike = (bikeId: string, bikeName: string) => {
    setDeleteConfirm({
      show: true,
      bikeId,
      bikeName
    })
  }

  const confirmDeleteBike = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/bikes/${deleteConfirm.bikeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete bike')
      }

      // Remove from local state
      setBikes(bikes.filter(bike => bike.id !== deleteConfirm.bikeId))
      setDeleteConfirm({ show: false, bikeId: '', bikeName: '' })
    } catch (err) {
      console.error('Error deleting bike:', err)
      setDeleteConfirm({ show: false, bikeId: '', bikeName: '' })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'RENTED':
        return <Clock className="w-5 h-5 text-red-500" />
      case 'MAINTENANCE':
        return <Wrench className="w-5 h-5 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800'
      case 'RENTED':
        return 'bg-red-100 text-red-800'
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
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
                  <Bike className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Bike Management</h1>
                  <p className="text-sm text-gray-600">Manage your bike inventory</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              <Plus className="w-5 h-5" />
              <span>Add Bike</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Add Bike Form */}
        {showAddForm && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Bike</h3>
            <form onSubmit={handleAddBike} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bike Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newBike.name}
                    onChange={(e) => setNewBike({ ...newBike, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter bike name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Hour ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newBike.pricePerHour}
                    onChange={(e) => setNewBike({ ...newBike, pricePerHour: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0.00"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    value={newBike.description}
                    onChange={(e) => setNewBike({ ...newBike, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                    placeholder="Enter bike description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newBike.status}
                    onChange={(e) => setNewBike({ ...newBike, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="RENTED">Rented</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tracking ID (optional)
                  </label>
                  <input
                    type="text"
                    value={newBike.trackingId}
                    onChange={(e) => setNewBike({ ...newBike, trackingId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Leave blank for auto-generate"
                  />
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="border-t pt-4 mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bike Images (Max 10)
                </label>
                
                {/* File Input */}
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 transition-colors mb-4">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-8 h-8 mb-4 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">Click to upload images</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                  </div>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="hidden" 
                  />
                </label>

                {/* Image Previews */}
                {images.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Images:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                            <img
                              src={image}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                >
                  Add Bike
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setImages([])
                    setSelectedFiles([])
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Bikes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bikes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Bike className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bikes found</h3>
              <p className="text-gray-600 mb-4">Get started by adding a new bike.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Bike
              </button>
            </div>
          ) : (
            bikes.map((bike) => (
              <div key={bike.id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(bike.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bike.status)}`}>
                        {bike.status}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/admin/bikes/edit/${bike.id}`} className="p-2 text-gray-400 hover:text-blue-600">
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDeleteBike(bike.id, bike.name)}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{bike.name}</h3>
                  <p className="text-gray-600 mb-4">{bike.description}</p>

                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex justify-between">
                      <span>Price per hour:</span>
                      <span className="font-semibold text-purple-600">${bike.pricePerHour}</span>
                    </div>
                    {bike.trackingId && (
                      <div className="flex justify-between">
                        <span>Tracking ID:</span>
                        <span className="font-mono">{bike.trackingId}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Added:</span>
                      <span>{new Date(bike.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {bike.images && bike.images.length > 0 ? (
                    <div className="mb-4">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                        <img
                          src={bike.images[0]?.url}
                          alt={bike.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-bike.jpg';
                          }}
                        />
                      </div>
                      {bike.images.length > 1 && (
                        <div className="mt-2 text-xs text-gray-500 text-center">
                          +{bike.images.length - 1} more image{bike.images.length > 2 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mb-4">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                        <div className="text-center text-gray-400">
                          <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                          <p className="text-sm">No image</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <select
                      value={bike.status}
                      onChange={(e) => handleStatusChange(bike.id, e.target.value as BikeType['status'])}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="RENTED">Rented</option>
                      <option value="MAINTENANCE">Maintenance</option>
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Delete Bike</h3>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete <strong>{deleteConfirm.bikeName}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm({ show: false, bikeId: '', bikeName: '' })}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteBike}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default withAdminAuth(AdminBikes, 'Bike Management')