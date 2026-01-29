'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { useState, useEffect } from 'react'
import { ChevronRight, Facebook, Twitter, Linkedin, MessageCircle, Share2, Star, Check, Sparkles } from 'lucide-react'

export default function PujaDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [puja, setPuja] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'description' | 'specification' | 'reviews'>('description')
  const [selectedJapa, setSelectedJapa] = useState('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (id) {
      fetchPuja()
    }
  }, [id])

  const fetchPuja = async () => {
    try {
      const response = await fetch(`/api/pujas/${id}`)
      if (response.ok) {
        const data = await response.json()
        setPuja({
          ...data,
          id: data.id || data._id
        })
        if (data.japaOptions?.length > 0) {
          setSelectedJapa(data.japaOptions[0].value)
        }
      }
    } catch (error) {
      console.error('Error fetching puja:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!puja) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Puja not found</h1>
            <Link href="/" className="text-primary hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find((item: any) => item.id === id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({
        id,
        name: puja.name,
        price: puja.price,
        quantity,
        japa: selectedJapa,
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))

    // Update cart count
    const cartCount = document.getElementById('cart-count')
    if (cartCount) {
      const total = cart.reduce((sum: number, item: any) => sum + item.quantity, 0)
      cartCount.textContent = total.toString()
    }

    alert(`${puja.name} added to cart!`)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    window.location.href = '/checkout'
  }

  const handleWhatsAppBuy = () => {
    const message = `Hi, I want to book: ${puja.name} - ₹${puja.price}`
    window.open(`https://wa.me/911234567890?text=${encodeURIComponent(message)}`, '_blank')
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `Check out ${puja.name} on Book My Panditji`

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-b border-border bg-white dark:bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <Link href="/services" className="text-muted-foreground hover:text-foreground">Shop</Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <Link href={`/services?category=${puja.categorySlug || 'pujas-vrat'}`} className="text-muted-foreground hover:text-foreground">{puja.category}</Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">{puja.name}</span>
            </div>

            {/* Social Sharing Icons */}
            <div className="flex items-center gap-3">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                aria-label="Share on Facebook"
              >
                <Facebook className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                aria-label="Share on Twitter"
              >
                <Twitter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </a>
              <a
                href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                aria-label="Share on Pinterest"
              >
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                aria-label="Share on WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="flex-1 px-4 py-8 bg-white dark:bg-card">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Left - Product Media */}
            <div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4 aspect-square flex items-center justify-center relative">
                {puja.image && puja.image !== '/placeholder.jpg' ? (
                  <img src={puja.image} alt={puja.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-9xl opacity-30">🙏</div>
                )}
              </div>

              {/* Video Preview if available */}
              {puja.video && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Video Preview
                  </h3>
                  <div className="aspect-video rounded-xl overflow-hidden shadow-xl border-2 border-primary/20 bg-black">
                    <video src={puja.video} controls className="w-full h-full">
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              )}
            </div>

            {/* Right - Product Details */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">{puja.name}</h1>
              <p className="text-sm text-muted-foreground mb-6">SKU: {puja.sku || `PUJA-${id}`}</p>

              {/* Price */}
              <div className="mb-6">
                <div className="text-sm text-muted-foreground mb-1">{puja.priceLabel || 'Price'}:</div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white">₹{puja.price.toLocaleString('en-IN')}</div>
              </div>

              {/* Short Description */}
              <p className="text-base text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                {puja.shortDescription}
              </p>

              {/* Japa Option */}
              {puja.japaOptions && puja.japaOptions.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Japa:
                  </label>
                  <select
                    value={selectedJapa}
                    onChange={(e) => setSelectedJapa(e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    {puja.japaOptions.map((option: any) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Final Price */}
              <div className="mb-6 p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">₹{puja.price.toLocaleString('en-IN')}</div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="w-full px-6 py-3 bg-gray-900 dark:bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                >
                  Add to cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full px-6 py-3 bg-gradient-to-r from-accent to-accent/90 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
                >
                  Buy Now
                </button>
                <button
                  onClick={handleWhatsAppBuy}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Buy On WhatsApp
                </button>
              </div>

              {/* Category */}
              <div className="text-sm text-muted-foreground">
                Category:{' '}
                <Link href={`/services?category=${puja.categorySlug || 'pujas-vrat'}`} className="text-primary hover:underline">
                  {puja.category}
                </Link>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border mb-6">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-4 px-2 font-semibold text-sm transition-colors ${activeTab === 'description'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('specification')}
                className={`pb-4 px-2 font-semibold text-sm transition-colors ${activeTab === 'specification'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                Specification
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-4 px-2 font-semibold text-sm transition-colors ${activeTab === 'reviews'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                Reviews ({puja.reviews?.length || 0})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="prose prose-sm max-w-none">
            {activeTab === 'description' && (
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line pb-12">
                {puja.fullDescription || puja.description}
              </div>
            )}

            {activeTab === 'specification' && (
              <div className="space-y-4 pb-12">
                {puja.specifications?.map((spec: any, idx: number) => (
                  <div key={idx} className="flex border-b border-border/50 pb-3">
                    <div className="w-48 font-semibold text-gray-900 dark:text-white">{spec.label}:</div>
                    <div className="flex-1 text-gray-700 dark:text-gray-300">{spec.value}</div>
                  </div>
                )) || (
                    <div className="text-muted-foreground italic">No specifications available for this puja.</div>
                  )}
                {puja.duration && (
                  <div className="flex border-b border-border/50 pb-3">
                    <div className="w-48 font-semibold text-gray-900 dark:text-white">Duration:</div>
                    <div className="flex-1 text-gray-700 dark:text-gray-300">{puja.duration}</div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="pb-12">
                {!puja.reviews || puja.reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No reviews yet. Be the first to review this puja!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {puja.reviews.map((review: any, idx: number) => (
                      <div key={idx} className="border-b border-border/50 pb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white">{review.user}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
