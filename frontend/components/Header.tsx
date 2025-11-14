'use client'

import Link from 'next/link'
import { useAuthStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Header() {
  const { user, clearAuth } = useAuthStore()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    clearAuth()
    router.push('/')
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              CricAuc
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium transition">
              Home
            </Link>
            <Link href="/auctions" className="text-gray-700 hover:text-primary-600 font-medium transition">
              Auctions
            </Link>
            <Link href="/teams" className="text-gray-700 hover:text-primary-600 font-medium transition">
              Teams
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 font-medium transition">
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin" className="text-gray-700 hover:text-primary-600 font-medium transition">
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-3 ml-4 pl-4 border-l">
                  <div className="flex items-center gap-2">
                    {user.avatar && (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                    )}
                    <span className="text-gray-700 font-medium">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l">
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-primary-600 font-medium transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition font-medium shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-primary-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-3">
              <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium py-2">
                Home
              </Link>
              <Link href="/auctions" className="text-gray-700 hover:text-primary-600 font-medium py-2">
                Auctions
              </Link>
              <Link href="/teams" className="text-gray-700 hover:text-primary-600 font-medium py-2">
                Teams
              </Link>
              {user ? (
                <>
                  <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 font-medium py-2">
                    Dashboard
                  </Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="text-gray-700 hover:text-primary-600 font-medium py-2">
                      Admin
                    </Link>
                  )}
                  <div className="pt-2 border-t">
                    <div className="flex items-center gap-2 mb-3">
                      {user.avatar && (
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                      )}
                      <span className="text-gray-700 font-medium">{user.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-2 border-t flex flex-col gap-2">
                  <Link
                    href="/auth/login"
                    className="text-center px-4 py-2 text-gray-700 hover:text-primary-600 font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="text-center px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

