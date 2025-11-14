import { create } from 'zustand'
import { io, Socket } from 'socket.io-client'

interface User {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
}

interface SocketState {
  socket: Socket | null
  connect: (token: string) => void
  disconnect: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
    }
    set({ user, token })
  },
  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
    set({ user: null, token: null })
  },
}))

export const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  connect: (token: string) => {
    const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/auctions`, {
      auth: { token },
      transports: ['websocket'],
    })

    socket.on('connect', () => {
      console.log('Connected to auction server')
    })

    set({ socket })
  },
  disconnect: () => {
    const { socket } = useSocketStore.getState()
    if (socket) {
      socket.disconnect()
      set({ socket: null })
    }
  },
}))



