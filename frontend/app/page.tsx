'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import api from '@/lib/api'

export default function Home() {
  const router = useRouter()
  const { token, user } = useAuthStore()
  const [auctions, setAuctions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAuctions()
  }, [])

  const fetchAuctions = async () => {
    try {
      const response = await api.get('/auctions')
      setAuctions(response.data || [])
    } catch (error) {
      console.error('Failed to fetch auctions:', error)
      setAuctions([])
    } finally {
      setLoading(false)
    }
  }

  const featuredAuctions = auctions.slice(0, 6)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Welcome to <span className="text-yellow-300">CricAuc</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Experience the thrill of virtual cricket player auctions. Bid in real-time, build your dream team, and compete in leagues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {token ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-8 py-4 bg-white text-primary-700 rounded-lg font-bold text-lg hover:bg-primary-50 transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    href="/auctions"
                    className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-primary-700 transition"
                  >
                    View Auctions
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/register"
                    className="px-8 py-4 bg-white text-primary-700 rounded-lg font-bold text-lg hover:bg-primary-50 transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    href="/auth/login"
                    className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-primary-700 transition"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose CricAuc?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for an authentic cricket auction experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 hover:shadow-xl transition">
              <div className="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Real-Time Bidding</h3>
              <p className="text-gray-600">
                Experience live auctions with instant updates. Place bids in real-time and watch the action unfold.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Team Management</h3>
              <p className="text-gray-600">
                Build and manage your dream team. Track players, manage budget, and strategize your picks.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-xl transition">
              <div className="w-16 h-16 bg-yellow-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Player Stats</h3>
              <p className="text-gray-600">
                Access comprehensive player statistics and historical performance data to make informed decisions.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition">
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Budget Management</h3>
              <p className="text-gray-600">
                Smart purse management system. Track your spending and make strategic decisions within your budget.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-gradient-to-br from-red-50 to-red-100 hover:shadow-xl transition">
              <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Trade System</h3>
              <p className="text-gray-600">
                Exchange players with other teams. Negotiate trades and optimize your squad throughout the season.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 hover:shadow-xl transition">
              <div className="w-16 h-16 bg-indigo-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Secure & Reliable</h3>
              <p className="text-gray-600">
                Your data is safe with us. Enterprise-grade security and 99.9% uptime guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Auctions Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Live Auctions
              </h2>
              <p className="text-xl text-gray-600">
                Join the action and bid on your favorite players
              </p>
            </div>
            <Link
              href="/auctions"
              className="hidden md:block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading auctions...</p>
            </div>
          ) : featuredAuctions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredAuctions.map((auction: any) => (
                <Link
                  key={auction.id}
                  href={token ? `/auctions/${auction.id}` : '/auth/login'}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition">
                          {auction.player?.name || 'Player Name'}
                        </h3>
                        <p className="text-gray-600 mt-1">{auction.player?.role || 'All-Rounder'}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          auction.status === 'live'
                            ? 'bg-green-100 text-green-800 animate-pulse'
                            : auction.status === 'completed'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {auction.status || 'upcoming'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <p className="text-sm text-gray-500">Current Bid</p>
                        <p className="text-3xl font-bold text-primary-600">
                          ₹{auction.currentPrice?.toLocaleString() || '0'}
                        </p>
                      </div>
                      {auction.status === 'live' && (
                        <div className="flex items-center gap-2 text-green-600">
                          <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                          <span className="font-medium">Live</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xl text-gray-600 mb-4">No auctions available at the moment</p>
              <p className="text-gray-500">Check back soon for upcoming player auctions!</p>
            </div>
          )}

          {!token && featuredAuctions.length > 0 && (
            <div className="text-center mt-8">
              <Link
                href="/auth/register"
                className="inline-block px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium text-lg shadow-lg"
              >
                Sign Up to Start Bidding
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!token && (
        <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Build Your Dream Team?
            </h2>
            <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
              Join thousands of cricket enthusiasts in the most exciting virtual auction experience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="px-8 py-4 bg-white text-primary-700 rounded-lg font-bold text-lg hover:bg-primary-50 transition shadow-xl"
              >
                Create Free Account
              </Link>
              <Link
                href="/auth/login"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-primary-700 transition"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
