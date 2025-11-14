'use client'

import { use } from 'react'
import AuctionRoom from '@/components/AuctionRoom'

export default function AuctionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  return (
    <div className="min-h-screen bg-gray-50">
      <AuctionRoom auctionId={id} />
    </div>
  )
}


