'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import api from '@/lib/api'
import Link from 'next/link'

export default function AuctionsPage() {
  const router = useRouter()
  const { token } = useAuthStore()
  const [auctions, setAuctions] = useState([])
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Player Auctions</h1>
          <p className="text-xl text-gray-600">
            Browse and bid on your favorite cricket players
          </p>
        </div>

        {!token && (
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl p-6 mb-8 shadow-lg">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-xl font-bold mb-2">Want to place bids?</h3>
                <p className="text-primary-100">Sign up or log in to participate in live auctions</p>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/auth/register"
                  className="px-6 py-2 bg-white text-primary-700 rounded-lg font-medium hover:bg-primary-50 transition"
                >
                  Sign Up
                </Link>
                <Link
                  href="/auth/login"
                  className="px-6 py-2 bg-transparent border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-primary-700 transition"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading auctions...</p>
          </div>
        ) : auctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction: any) => (
              <Link
                key={auction.id}
                href={token ? `/auctions/${auction.id}` : '/auth/login'}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition overflow-hidden group transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition mb-2">
                        {auction.player?.name || 'Player Name'}
                      </h3>
                      <p className="text-gray-600 mb-1">{auction.player?.role || 'All-Rounder'}</p>
                      {auction.player?.team && (
                        <p className="text-sm text-gray-500">{auction.player.team}</p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
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
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Current Bid</p>
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
                    {auction.bidCount > 0 && (
                      <p className="text-sm text-gray-500 mt-2">
                        {auction.bidCount} bid{auction.bidCount !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow">
            <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No auctions available</h3>
            <p className="text-gray-600 mb-6">Check back soon for upcoming player auctions!</p>
            {!token && (
              <Link
                href="/auth/register"
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
              >
                Get Notified When Auctions Start
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


