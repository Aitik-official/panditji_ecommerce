'use client'

import { useState, useEffect } from 'react'
import { Edit, Trash2, Image as ImageIcon, Video, Search, Filter } from 'lucide-react'

interface Puja {
  id: string
  _id?: string
  name: string
  description: string
  shortDescription?: string
  fullDescription?: string
  price: number
  category: string
  duration: string
  image: string | null
  video: string | null
  features?: string[]
  createdAt: string
}

export function PujaList() {
  const [pujas, setPujas] = useState<Puja[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  useEffect(() => {
    fetchPujas()
  }, [])

  const fetchPujas = async () => {
    try {
      const response = await fetch('/api/pujas')
      if (response.ok) {
        const data = await response.json()
        const normalizedPujas = data.map((p: any) => ({
          ...p,
          id: p.id || p._id
        }))
        setPujas(normalizedPujas)
      }
    } catch (error) {
      console.error('Error fetching pujas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this puja?')) return

    try {
      const response = await fetch(`/api/pujas/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPujas(prev => prev.filter(puja => puja.id !== id))
        alert('Puja deleted successfully!')
      } else {
        alert('Failed to delete puja')
      }
    } catch (error) {
      console.error('Error deleting puja:', error)
      alert('Failed to delete puja')
    }
  }

  const filteredPujas = pujas.filter(puja => {
    const matchesSearch = puja.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      puja.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || puja.category === filterCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="bg-white dark:bg-card rounded-2xl border-2 border-border p-6 shadow-lg">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading pujas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-card rounded-2xl border-2 border-border p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Manage Pujas ({pujas.length})
        </h2>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search pujas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="all">All Categories</option>
            <option value="festival">Festival Puja</option>
            <option value="puja-vrat">Puja & Vrat</option>
            <option value="chakra-balancing">Chakra Balancing</option>
            <option value="yagnas-homas">Yagnas / Homas</option>
            <option value="dosha-nivaran">Dosha Nivaran</option>
          </select>
        </div>
      </div>

      {/* Puja List */}
      <div className="space-y-4">
        {filteredPujas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No pujas found</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              {pujas.length === 0 ? 'Add your first puja to get started!' : 'Try adjusting your search or filter'}
            </p>
          </div>
        ) : (
          filteredPujas.map((puja) => (
            <div
              key={puja.id}
              className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Image/Video Preview */}
                <div className="w-full md:w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                  {puja.image ? (
                    <img
                      src={puja.image}
                      alt={puja.name}
                      className="w-full h-full object-cover"
                    />
                  ) : puja.video ? (
                    <div className="relative w-full h-full">
                      <video
                        src={puja.video}
                        className="w-full h-full object-cover"
                        muted
                      />
                      <Video className="absolute top-2 right-2 w-6 h-6 text-white bg-black/50 rounded p-1" />
                    </div>
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {puja.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {puja.shortDescription || puja.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full font-semibold">
                          {puja.category}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          ₹{puja.price?.toLocaleString()}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {puja.duration}
                        </span>
                      </div>
                      {puja.features && puja.features.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {puja.features.slice(0, 3).map((feature, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
                            >
                              {feature}
                            </span>
                          ))}
                          {puja.features.length > 3 && (
                            <span className="text-xs text-gray-500">+{puja.features.length - 3} more</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => alert('Edit functionality coming soon!')}
                        className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5 text-primary" />
                      </button>
                      <button
                        onClick={() => handleDelete(puja.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
