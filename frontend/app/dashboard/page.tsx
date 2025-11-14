'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import api from '@/lib/api'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const { user, token } = useAuthStore()
  const [leagues, setLeagues] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      router.push('/auth/login')
      return
    }

    fetchData()
  }, [token, router])

  const fetchData = async () => {
    try {
      const [leaguesRes, teamsRes] = await Promise.all([
        api.get('/leagues'),
        api.get('/teams'),
      ])
      setLeagues(leaguesRes.data || [])
      setTeams(teamsRes.data || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-xl text-gray-600">Manage your teams, leagues, and auctions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl shadow-lg p-6 border border-primary-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">My Teams</h2>
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            {teams.length > 0 ? (
              <ul className="space-y-3 mb-4">
                {teams.map((team: any) => (
                  <li key={team.id}>
                    <Link
                      href={`/teams/${team.id}`}
                      className="block p-3 bg-white rounded-lg hover:shadow-md transition group"
                    >
                      <div className="font-semibold text-gray-900 group-hover:text-primary-600 transition">
                        {team.name}
                      </div>
                      <div className="text-sm text-gray-600">{team.league?.name || 'No league'}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 mb-4">No teams yet. Create your first team!</p>
            )}
            <Link
              href="/teams/create"
              className="inline-block w-full text-center px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium shadow-md"
            >
              Create Team
            </Link>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Active Leagues</h2>
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
            {leagues.length > 0 ? (
              <ul className="space-y-3">
                {leagues.map((league: any) => (
                  <li key={league.id}>
                    <Link
                      href={`/leagues/${league.id}`}
                      className="block p-3 bg-white rounded-lg hover:shadow-md transition group"
                    >
                      <div className="font-semibold text-gray-900 group-hover:text-green-600 transition">
                        {league.name}
                      </div>
                      <div className="text-sm text-gray-600 capitalize">{league.type || 'Standard'}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No active leagues</p>
            )}
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-lg p-6 border border-yellow-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Quick Stats</h2>
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <div className="text-3xl font-bold text-primary-600">{teams.length}</div>
                <div className="text-sm text-gray-600">Total Teams</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-3xl font-bold text-green-600">{leagues.length}</div>
                <div className="text-sm text-gray-600">Active Leagues</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/auctions"
              className="flex items-center justify-between p-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition shadow-md group"
            >
              <div>
                <div className="font-bold text-lg mb-1">View Auctions</div>
                <div className="text-primary-100 text-sm">Browse live player auctions</div>
              </div>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/teams"
              className="flex items-center justify-between p-6 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition shadow-md group"
            >
              <div>
                <div className="font-bold text-lg mb-1">My Teams</div>
                <div className="text-green-100 text-sm">Manage your teams</div>
              </div>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/teams/create"
              className="flex items-center justify-between p-6 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition shadow-md group"
            >
              <div>
                <div className="font-bold text-lg mb-1">Create Team</div>
                <div className="text-yellow-100 text-sm">Start a new team</div>
              </div>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


