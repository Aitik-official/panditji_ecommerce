'use client'

import { AddPujaForm } from '@/components/dashboard/add-puja-form'
import { PujaList } from '@/components/dashboard/puja-list'
import { CustomerBookings } from '@/components/dashboard/customer-bookings'
import { CategoryManager } from '@/components/dashboard/category-manager'
import { Package, Users, TrendingUp, Lock, User, Eye, EyeOff, Folder } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'add' | 'manage' | 'bookings' | 'categories'>('add')

  const [stats, setStats] = useState({
    totalPujas: 0,
    totalBookings: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('dashboard_authenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
      fetchStats()
    }
    setIsLoading(false)
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Check credentials
    if (username === 'admin_01' && password === 'admin@123') {
      setIsAuthenticated(true)
      localStorage.setItem('dashboard_authenticated', 'true')
      fetchStats()
    } else {
      setError('Invalid username or password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('dashboard_authenticated')
    setUsername('')
    setPassword('')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-card rounded-2xl shadow-2xl w-full max-w-md p-8 border-2 border-border">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
              Admin Dashboard
            </h2>
            <p className="text-muted-foreground">
              Please enter your credentials to continue
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Logout */}
      <div className="bg-white dark:bg-card border-b-2 border-border shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your pujas and view customer bookings
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border-2 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">Total Pujas</p>
                <p className="text-3xl font-extrabold text-primary">{stats.totalPujas}</p>
              </div>
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl p-6 border-2 border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">Total Bookings</p>
                <p className="text-3xl font-extrabold text-blue-600">{stats.totalBookings}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-2xl p-6 border-2 border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">Total Revenue</p>
                <p className="text-3xl font-extrabold text-green-600">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b-2 border-gray-200 dark:border-gray-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab('add')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${activeTab === 'add'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-primary'
              }`}
          >
            Add New Puja
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${activeTab === 'manage'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-primary'
              }`}
          >
            Manage Pujas
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${activeTab === 'categories'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-primary'
              }`}
          >
            <Folder className="w-4 h-4" />
            Categories
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${activeTab === 'bookings'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-primary'
              }`}
          >
            Customer Bookings
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'add' && <AddPujaForm />}
          {activeTab === 'manage' && <PujaList />}
          {activeTab === 'categories' && <CategoryManager />}
          {activeTab === 'bookings' && <CustomerBookings />}
        </div>
      </main>
    </div>
  )
}
