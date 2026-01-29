'use client'

import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ChevronRight, ArrowRight, Flame, Focus as Lotus, BookOpen, Sparkles, Gift, Calendar } from 'lucide-react'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

// Icon mapping for services
const iconMap: Record<string, any> = {
  'Daily Rituals': Flame,
  'Offerings': Lotus,
  'Consultations': BookOpen,
  'Special Rituals': Sparkles,
  'Planning': Calendar,
}

function ServicesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [categories, setCategories] = useState<string[]>(['All'])
  const [allServices, setAllServices] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  // Map category names to URL slugs
  const categoryToSlug = (categoryName: string): string => {
    const slugMap: Record<string, string> = {
      'Pujas & Vrat': 'pujas-vrat',
      'Yagnas / Homas': 'yagnas-homas',
      'Dosha Nivaran': 'dosha-nivaran',
      'Daily Rituals': 'daily-rituals',
      'Offerings': 'offerings',
      'Consultations': 'consultations',
      'Special Rituals': 'special-rituals',
      'Planning': 'planning',
    }
    return slugMap[categoryName] || categoryName.toLowerCase().replace(/\s+/g, '-')
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    if (category === 'All') {
      router.push('/services')
    } else {
      const slug = categoryToSlug(category)
      router.push(`/services?category=${slug}`)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchServices()
  }, [])

  useEffect(() => {
    // Read category from URL query parameter
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      // Map URL slugs to category names
      const categoryMap: Record<string, string> = {
        'pujas-vrat': 'Pujas & Vrat',
        'yagnas-homas': 'Yagnas / Homas',
        'dosha-nivaran': 'Dosha Nivaran',
        'daily-rituals': 'Daily Rituals',
        'offerings': 'Offerings',
        'consultations': 'Consultations',
        'special-rituals': 'Special Rituals',
        'planning': 'Planning',
      }
      const categoryName = categoryMap[categoryParam] || categoryParam
      setSelectedCategory(categoryName)
    }
  }, [searchParams])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        const categoryNames = ['All', ...data.map((cat: any) => cat.name)]
        setCategories(categoryNames)

        // If category is set from URL, ensure it exists in categories
        const categoryParam = searchParams.get('category')
        if (categoryParam) {
          const categoryMap: Record<string, string> = {
            'pujas-vrat': 'Pujas & Vrat',
            'yagnas-homas': 'Yagnas / Homas',
            'dosha-nivaran': 'Dosha Nivaran',
            'daily-rituals': 'Daily Rituals',
            'offerings': 'Offerings',
            'consultations': 'Consultations',
            'special-rituals': 'Special Rituals',
            'planning': 'Planning',
          }
          const categoryName = categoryMap[categoryParam] || categoryParam
          // Check if category exists in fetched categories, or use the mapped name
          if (categoryNames.includes(categoryName) || categoryMap[categoryParam]) {
            setSelectedCategory(categoryName)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/pujas')
      if (response.ok) {
        const data = await response.json()
        // Map pujas to services format with icons
        const services = data.map((puja: any) => ({
          id: puja.id || puja._id,
          category: puja.category,
          name: puja.name,
          price: puja.price,
          description: puja.shortDescription || puja.description || '',
          duration: puja.duration || 'N/A',
          icon: iconMap[puja.category] || Gift,
        }))
        setAllServices(services)
      } else {
        console.error('Failed to fetch services:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredServices = selectedCategory === 'All'
    ? allServices
    : allServices.filter(s => s.category === selectedCategory)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-b border-border px-4">
        <div className="mx-auto max-w-7xl py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium">Services</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <section className="px-4 py-16 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent/10 to-primary/5" />
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="inline-block mb-6 px-4 py-1 bg-primary/20 rounded-full">
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">Services</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Our Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Explore our complete range of authentic traditional Indian temple services, performed by certified priests with decades of experience
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="flex-1 px-4 py-12 gradient-section-1">
        <div className="mx-auto max-w-7xl">
          {/* Category Filter */}
          {loading ? (
            <div className="mb-12 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="mb-12 overflow-x-auto">
              <div className="flex gap-3 pb-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 ${selectedCategory === cat
                        ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg scale-105'
                        : 'bg-card text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border hover:border-primary/50'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredServices.map((service, index) => {
              const Icon = service.icon
              const gradients = [
                'from-primary/20 via-primary/10 to-accent/20',
                'from-accent/20 via-accent/10 to-primary/20',
                'from-primary/20 via-accent/20 to-primary/10',
              ]
              const gradient = gradients[index % gradients.length]
              return (
                <div
                  key={service.id}
                  className={`bg-gradient-to-br ${gradient} rounded-2xl border border-border/50 hover:border-primary/50 card-elevated overflow-hidden group relative`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="p-8 relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-4 bg-gradient-to-br from-primary/30 to-accent/20 rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <span className="text-xs px-4 py-2 bg-white/80 backdrop-blur-sm text-primary rounded-full font-bold shadow-sm">
                        {service.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border/50">
                      <span className="flex items-center gap-2">⏱️ <span className="font-semibold">{service.duration}</span></span>
                    </div>
                  </div>

                  <div className="px-8 pb-8 pt-0 flex items-center justify-between relative z-10">
                    <span className="text-3xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">₹{service.price}</span>
                    <Link
                      href={`/puja/${service.id}`}
                      className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl text-sm font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 shadow-lg"
                    >
                      View <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No services found in this category</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function ServicesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    }>
      <ServicesContent />
    </Suspense>
  )
}
