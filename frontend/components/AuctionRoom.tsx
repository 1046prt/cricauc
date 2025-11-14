'use client'

import { useEffect, useState } from 'react'
import { useSocketStore, useAuthStore } from '@/lib/store'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface Auction {
  id: string
  player: {
    id: string
    name: string
    image?: string
    role: string
  }
  currentPrice: number
  status: string
  timerSeconds: number
  winningTeamId?: string
  bids: any[]
}

export default function AuctionRoom({ auctionId }: { auctionId: string }) {
  const { socket, connect, disconnect } = useSocketStore()
  const { token, user } = useAuthStore()
  const [auction, setAuction] = useState<Auction | null>(null)
  const [bidAmount, setBidAmount] = useState('')
  const [teamId, setTeamId] = useState('')
  const [teams, setTeams] = useState([])

  useEffect(() => {
    if (token) {
      connect(token)
    }

    return () => {
      disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  useEffect(() => {
    if (!socket) return

    socket.emit('join-auction', { auctionId, teamId })

    socket.on('auction-updated', (data: Auction) => {
      setAuction(data)
    })

    socket.on('bid-placed', (data: { bid: any; auction: Auction }) => {
      setAuction(data.auction)
      toast.success('New bid placed!')
    })

    socket.on('auction-started', (data: Auction) => {
      setAuction(data)
      toast.success('Auction started!')
    })

    socket.on('auction-ended', (data: Auction) => {
      setAuction(data)
      toast.success('Auction ended!')
    })

    return () => {
      socket.emit('leave-auction', { auctionId })
    }
  }, [socket, auctionId, teamId])

  useEffect(() => {
    fetchAuction()
    fetchTeams()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctionId])

  const fetchAuction = async () => {
    try {
      const response = await api.get(`/auctions/${auctionId}`)
      setAuction(response.data)
    } catch (error) {
      toast.error('Failed to load auction')
    }
  }

  const fetchTeams = async () => {
    try {
      const response = await api.get('/teams')
      setTeams(response.data)
      if (response.data.length > 0) {
        setTeamId(response.data[0].id)
      }
    } catch (error) {
      console.error('Failed to load teams')
    }
  }

  const handlePlaceBid = () => {
    if (!socket || !teamId) {
      toast.error('Please select a team')
      return
    }

    const amount = parseFloat(bidAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Invalid bid amount')
      return
    }

    socket.emit('place-bid', { auctionId, amount }, (response: any) => {
      if (response.error) {
        toast.error(response.error)
      } else {
        toast.success('Bid placed successfully!')
        setBidAmount('')
      }
    })
  }

  if (!auction) {
    return <div>Loading auction...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          {auction.player.image && (
            <img
              src={auction.player.image}
              alt={auction.player.name}
              className="w-24 h-24 rounded-full"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold">{auction.player.name}</h2>
            <p className="text-gray-600">{auction.player.role}</p>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-primary-600 mb-2">
            ₹{auction.currentPrice.toLocaleString()}
          </div>
          <div className="text-lg text-gray-600">
            Timer: {auction.timerSeconds}s
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Status: {auction.status}
          </div>
        </div>

        {auction.status === 'live' && (
          <div className="border-t pt-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Team</label>
              <select
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                {teams.map((team: any) => (
                  <option key={team.id} value={team.id}>
                    {team.name} (₹{(team.purse - team.spent).toLocaleString()} available)
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Enter bid amount"
                className="flex-1 px-3 py-2 border rounded-md"
                min={auction.currentPrice + 0.25}
                step="0.25"
              />
              <button
                onClick={handlePlaceBid}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Place Bid
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold mb-2">Recent Bids</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {auction.bids?.slice(0, 10).map((bid: any) => (
              <div key={bid.id} className="flex justify-between text-sm">
                <span>{bid.team?.name}</span>
                <span className="font-semibold">₹{bid.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


