import { useEffect, useRef } from 'react'
import axios from 'axios'

interface WebSocketMessage {
  type: string
  action?: string
  payload?: any
  products?: any[]
  categories?: any[]
}

interface UseWebSocketProps {
  url: string
  onMessage: (message: WebSocketMessage) => void
  onError?: (error: Event) => void
  onOpen?: () => void
  onClose?: () => void
}

export const useWebSocket = ({
  url,
  onMessage,
  onError,
  onOpen,
  onClose
}: UseWebSocketProps) => {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  const connect = () => {
    try {
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('WebSocket connected')
        reconnectAttempts.current = 0
        onOpen?.()
      }

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          onMessage(message)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        onError?.(error)
      }

      ws.onclose = () => {
        console.log('WebSocket disconnected')
        onClose?.()
        
        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++
          const delay = Math.pow(2, reconnectAttempts.current) * 1000 // Exponential backoff
          
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})`)
            connect()
          }, delay)
        }
      }
    } catch (error) {
      console.error('Error creating WebSocket connection:', error)
    }
  }

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }

  const sendMessage = (message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected')
    }
  }

  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [url])

  return {
    sendMessage,
    disconnect,
    reconnect: connect,
    isConnected: wsRef.current?.readyState === WebSocket.OPEN
  }
}

// Hook para sincronizar datos con el servidor usando axios
export const useDataSync = () => {
  const syncWithServer = async (endpoint: string, data: any) => {
    try {
      const response = await axios.post(endpoint, data)
      return response.data
    } catch (error) {
      console.error('Error syncing with server:', error)
      throw error
    }
  }

  const fetchFromServer = async (endpoint: string) => {
    try {
      const response = await axios.get(endpoint)
      return response.data
    } catch (error) {
      console.error('Error fetching from server:', error)
      throw error
    }
  }

  return {
    syncWithServer,
    fetchFromServer
  }
}
