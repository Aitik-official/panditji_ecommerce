'use client'

import Link from 'next/link'
import { ShoppingCart, Menu, X, Phone, Search, User, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { AuthModal } from './auth-modal'

interface Category {
  id: string
  _id?: string
  name: string
  slug: string
  description?: string // Added description as optional based on the edit
  showOnNavbar?: boolean // Added showOnNavbar as optional based on the filter logic
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [navbarCategories, setNavbarCategories] = useState<Category[]>([]) // Changed type to Category[]

  useEffect(() => {
    fetchNavbarCategories()
  }, [])

  const fetchNavbarCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const categories: Category[] = await response.json() // Explicitly type categories
        // Only show categories that have showOnNavbar: true
        const navCategories = categories
          .filter((cat: Category) => cat.showOnNavbar === true) // Use Category type
          .map((cat: Category) => ({ // Use Category type
            id: cat.id || cat._id || '', // Ensure id is always present
            name: cat.name || '', // Ensure name is always present
            slug: cat.slug || '', // Ensure slug is always present
            description: cat.description || '', // Added description
          }))
        setNavbarCategories(navCategories)
      }
    } catch (error) {
      console.error('Error fetching navbar categories:', error)
    }
  }


  return (
    <nav className="sticky top-0 z-50 bg-background shadow-md">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center gap-6">
              <Link href="tel:+911234567890" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                <span className="font-medium">Call Us: +91 1234567890</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                <span>🇬🇧</span>
                <span className="font-medium">English</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                <span className="font-medium">INR</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-background border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold text-xl">
                🕉️
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-primary">Book My</span>
                <span className="text-xl font-extrabold text-accent -mt-1">Panditji</span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl hidden md:flex">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="I am shopping for..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-border rounded-l-lg focus:outline-none focus:border-primary bg-background"
                />
                <button className="absolute right-0 top-0 h-full px-6 bg-gradient-to-r from-primary to-accent text-white rounded-r-lg hover:opacity-90 transition-opacity">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <Link href="/cart" className="relative p-2 hover:bg-primary/10 rounded-lg transition-all group">
                <ShoppingCart className="w-6 h-6 group-hover:text-primary transition-colors" />
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary to-accent text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg" id="cart-count">
                  0
                </span>
              </Link>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden md:flex items-center gap-2 px-4 py-2 hover:bg-primary/10 rounded-lg transition-all group"
              >
                <User className="w-5 h-5 group-hover:text-primary transition-colors" />
                <span className="font-medium group-hover:text-primary transition-colors">Log in / Register</span>
              </button>
              <button
                className="md:hidden p-2 hover:bg-primary/10 rounded-lg"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex items-center gap-8 h-12">
            <Link href="/" className="text-sm font-bold hover:text-primary transition-colors py-3 border-b-2 border-transparent hover:border-primary">
              Home
            </Link>
            <Link href="/about" className="text-sm font-bold hover:text-primary transition-colors py-3 border-b-2 border-transparent hover:border-primary">
              About Us
            </Link>
            <Link href="/astrology" className="text-sm font-bold hover:text-primary transition-colors py-3 border-b-2 border-transparent hover:border-primary">
              Astrological Predictions
            </Link>
            {navbarCategories.map((category) => (
              <Link
                key={category.id}
                href={`/services?category=${category.slug}`}
                className="text-sm font-bold hover:text-primary transition-colors py-3 border-b-2 border-transparent hover:border-primary"
              >
                {category.name}
              </Link>
            ))}
            <Link href="/services" className="text-sm font-bold hover:text-primary transition-colors py-3 border-b-2 border-transparent hover:border-primary">
              Services
            </Link>
            <Link href="/contact" className="text-sm font-bold hover:text-primary transition-colors py-3 border-b-2 border-transparent hover:border-primary">
              Contact
            </Link>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <Link href="/" className="block px-4 py-2 text-sm font-medium hover:text-primary hover:bg-primary/10 rounded-lg">
                Home
              </Link>
              <Link href="/about" className="block px-4 py-2 text-sm font-medium hover:text-primary hover:bg-primary/10 rounded-lg">
                About Us
              </Link>
              <Link href="/astrology" className="block px-4 py-2 text-sm font-medium hover:text-primary hover:bg-primary/10 rounded-lg">
                Astrological Predictions
              </Link>
              {navbarCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/services?category=${category.slug}`}
                  className="block px-4 py-2 text-sm font-medium hover:text-primary hover:bg-primary/10 rounded-lg"
                >
                  {category.name}
                </Link>
              ))}
              <Link href="/services" className="block px-4 py-2 text-sm font-medium hover:text-primary hover:bg-primary/10 rounded-lg">
                Services
              </Link>
              <Link href="/contact" className="block px-4 py-2 text-sm font-medium hover:text-primary hover:bg-primary/10 rounded-lg">
                Contact
              </Link>
              <button
                onClick={() => {
                  setIsAuthModalOpen(true)
                  setIsOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-sm font-medium hover:text-primary hover:bg-primary/10 rounded-lg"
              >
                Log in / Register
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  )
}
