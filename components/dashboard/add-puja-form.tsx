'use client'

import { useState, useEffect } from 'react'
import { Plus, Upload, X, Image as ImageIcon, Video } from 'lucide-react'

interface PujaFormData {
  name: string
  sku: string
  price: number
  priceLabel: string
  category: string
  categorySlug: string
  shortDescription: string
  fullDescription: string
  duration: string
  image: string | null
  video: string | null
  specifications: Array<{ label: string; value: string }>
  japaOptions: Array<{ label: string; value: string }>
  features: string[]
}

interface Category {
  id: string
  name: string
  slug: string
}

export function AddPujaForm() {
  const [formData, setFormData] = useState<PujaFormData>({
    name: '',
    sku: '',
    price: 0,
    priceLabel: 'From',
    category: '',
    categorySlug: '',
    shortDescription: '',
    fullDescription: '',
    duration: '',
    image: null,
    video: null,
    specifications: [],
    japaOptions: [],
    features: [],
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [currentFeature, setCurrentFeature] = useState('')
  const [currentSpecLabel, setCurrentSpecLabel] = useState('')
  const [currentSpecValue, setCurrentSpecValue] = useState('')
  const [currentJapaLabel, setCurrentJapaLabel] = useState('')
  const [currentJapaValue, setCurrentJapaValue] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadType, setUploadType] = useState<'image' | 'video' | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true)
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoadingCategories(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: name === 'price' ? parseFloat(value) || 0 : value,
      }
      // Auto-generate categorySlug from selected category
      if (name === 'category') {
        const selectedCategory = categories.find(c => c.name === value)
        updated.categorySlug = selectedCategory ? selectedCategory.slug : value.toLowerCase().replace(/\s+/g, '-')
      }
      return updated
    })
  }

  const handleAddFeature = () => {
    if (currentFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()],
      }))
      setCurrentFeature('')
    }
  }

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  const handleAddSpecification = () => {
    if (currentSpecLabel.trim() && currentSpecValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: [...prev.specifications, { label: currentSpecLabel.trim(), value: currentSpecValue.trim() }],
      }))
      setCurrentSpecLabel('')
      setCurrentSpecValue('')
    }
  }

  const handleRemoveSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }))
  }

  const handleAddJapaOption = () => {
    if (currentJapaLabel.trim() && currentJapaValue.trim()) {
      setFormData(prev => ({
        ...prev,
        japaOptions: [...prev.japaOptions, { label: currentJapaLabel.trim(), value: currentJapaValue.trim() }],
      }))
      setCurrentJapaLabel('')
      setCurrentJapaValue('')
    }
  }

  const handleRemoveJapaOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      japaOptions: prev.japaOptions.filter((_, i) => i !== index),
    }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadType(type)

    try {
      // Create form data for our local API upload
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('folder', 'panditji')
      uploadFormData.append('resource_type', type === 'image' ? 'image' : 'video')

      // Upload to our internal API route
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Cloudinary upload error:', errorData)
        throw new Error(errorData.error?.message || `Upload failed with status ${response.status}`)
      }

      const data = await response.json()

      // Update form data with the uploaded URL
      setFormData(prev => ({
        ...prev,
        [type]: data.secure_url,
      }))

      alert(`✅ ${type === 'image' ? 'Image' : 'Video'} uploaded successfully!`)
    } catch (error: any) {
      console.error('Upload error:', error)

      // Provide detailed error message
      let errorMessage = `Failed to upload ${type}.`
      if (error.message.includes('Invalid')) {
        errorMessage += '\n\nPlease create an unsigned upload preset in Cloudinary:\n1. Go to Settings → Upload\n2. Add upload preset\n3. Set signing mode to "Unsigned"\n4. Update .env with preset name'
      } else {
        errorMessage += `\n\nError: ${error.message}`
      }

      alert(`❌ ${errorMessage}`)
    } finally {
      setIsUploading(false)
      setUploadType(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.name || !formData.price || !formData.category) {
      alert('Please fill in all required fields: Name, Price, and Category')
      return
    }

    try {
      // Save to API (which will save to localStorage temporarily)
      const response = await fetch('/api/pujas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save puja')
      }

      const result = await response.json()

      // Show success alert with details
      alert(`✅ Puja Added Successfully!\n\nName: ${formData.name}\nPrice: ₹${formData.price}\nCategory: ${formData.category}\n\nID: ${result.id}\n\nThe product is now saved and available on the website.`)

      // Reset form
      setFormData({
        name: '',
        sku: '',
        price: 0,
        priceLabel: 'From',
        category: '',
        categorySlug: '',
        shortDescription: '',
        fullDescription: '',
        duration: '',
        image: null,
        video: null,
        specifications: [],
        japaOptions: [],
        features: [],
      })
      setCurrentSpecLabel('')
      setCurrentSpecValue('')
      setCurrentJapaLabel('')
      setCurrentJapaValue('')
      setCurrentFeature('')

      // Refresh the page to show the new puja in the list
      window.location.reload()
    } catch (error: any) {
      console.error('Error saving puja:', error)
      alert(`❌ Failed to save puja: ${error.message || 'Please try again.'}`)
    }
  }

  return (
    <div className="bg-white dark:bg-card rounded-2xl border-2 border-border p-6 shadow-lg">
      <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Plus className="w-6 h-6 text-primary" />
        Add New Puja
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Puja Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="e.g., Diwali Puja"
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>

        {/* SKU */}
        <div>
          <label htmlFor="sku" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            SKU
          </label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleInputChange}
            placeholder="e.g., DP-001 or N/A"
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>

        {/* Short Description */}
        <div>
          <label htmlFor="shortDescription" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Short Description *
          </label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleInputChange}
            required
            rows={2}
            placeholder="Brief description shown on product card..."
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
          />
        </div>

        {/* Full Description */}
        <div>
          <label htmlFor="fullDescription" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Full Description *
          </label>
          <textarea
            id="fullDescription"
            name="fullDescription"
            value={formData.fullDescription}
            onChange={handleInputChange}
            required
            rows={8}
            placeholder="Complete detailed description with paragraphs, bullet points, etc..."
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
          />
        </div>

        {/* Price, Price Label, and Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Price (INR) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="priceLabel" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Price Label
            </label>
            <select
              id="priceLabel"
              name="priceLabel"
              value={formData.priceLabel}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="From">From</option>
              <option value="">Regular Price</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              disabled={loadingCategories}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {loadingCategories ? 'Loading categories...' : 'Select Category'}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && !loadingCategories && (
              <p className="text-sm text-muted-foreground mt-1">
                No categories available. Please add categories first.
              </p>
            )}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Duration *
          </label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            required
            placeholder="e.g., 2 hours, 1 day"
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Puja Image
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary transition-colors">
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isUploading && uploadType === 'image' ? 'Uploading...' : 'Upload Image'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'image')}
                className="hidden"
                disabled={isUploading}
              />
            </label>
            {formData.image && (
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">Uploaded</span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Video Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Puja Video
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary transition-colors">
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isUploading && uploadType === 'video' ? 'Uploading...' : 'Upload Video'}
              </span>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileUpload(e, 'video')}
                className="hidden"
                disabled={isUploading}
              />
            </label>
            {formData.video && (
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">Uploaded</span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, video: null }))}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Specifications */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Specifications
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <input
              type="text"
              value={currentSpecLabel}
              onChange={(e) => setCurrentSpecLabel(e.target.value)}
              placeholder="Label (e.g., Duration)"
              className="px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={currentSpecValue}
                onChange={(e) => setCurrentSpecValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecification())}
                placeholder="Value (e.g., 2-3 hours)"
                className="flex-1 px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddSpecification}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Add
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {formData.specifications.map((spec, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 dark:text-white">{spec.label}:</span>
                  <span className="ml-2 text-gray-700 dark:text-gray-300">{spec.value}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSpecification(index)}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Japa Options */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Japa Options
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <input
              type="text"
              value={currentJapaLabel}
              onChange={(e) => setCurrentJapaLabel(e.target.value)}
              placeholder="Label (e.g., 11000 Chants)"
              className="px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={currentJapaValue}
                onChange={(e) => setCurrentJapaValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddJapaOption())}
                placeholder="Value (e.g., 11000)"
                className="flex-1 px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddJapaOption}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Add
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {formData.japaOptions.map((japa, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 dark:text-white">{japa.label}</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">({japa.value})</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveJapaOption(index)}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Features
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={currentFeature}
              onChange={(e) => setCurrentFeature(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
              placeholder="Add a feature..."
              className="flex-1 px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.features.map((feature, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {feature}
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(index)}
                  className="hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3.5 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
        >
          Add Puja
        </button>
      </form>
    </div>
  )
}
