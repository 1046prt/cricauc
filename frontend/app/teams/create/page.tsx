'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function CreateTeamPage() {
  const router = useRouter()
  const { token } = useAuthStore()
  const [leagues, setLeagues] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    leagueId: '',
    logo: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      router.push('/auth/login')
      return
    }

    fetchLeagues()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, router])

  const fetchLeagues = async () => {
    try {
      const response = await api.get('/leagues')
      setLeagues(response.data)
      if (response.data.length > 0) {
        setFormData({ ...formData, leagueId: response.data[0].id })
      }
    } catch (error) {
      toast.error('Failed to load leagues')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/teams', formData)
      toast.success('Team created successfully!')
      router.push('/teams')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create team')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/teams" className="text-primary-600 hover:underline mb-4 inline-block">
          ← Back to Teams
        </Link>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6">Create Team</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                League
              </label>
              <select
                required
                value={formData.leagueId}
                onChange={(e) => setFormData({ ...formData, leagueId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {leagues.map((league: any) => (
                  <option key={league.id} value={league.id}>
                    {league.name} ({league.type})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo URL (Optional)
              </label>
              <input
                type="url"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Team'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}


