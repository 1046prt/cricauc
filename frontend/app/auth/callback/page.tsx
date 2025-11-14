'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAuth } = useAuthStore()

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (token) {
      // Verify token and get user info
      api.defaults.headers.Authorization = `Bearer ${token}`
      api.get('/users/me')
        .then((response) => {
          setAuth(response.data, token)
          toast.success('Logged in successfully!')
          router.push('/dashboard')
        })
        .catch(() => {
          toast.error('Authentication failed')
          router.push('/auth/login')
        })
    } else {
      router.push('/auth/login')
    }
  }, [searchParams, router, setAuth])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  )
}



