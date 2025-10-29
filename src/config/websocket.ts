// WebSocket Server Configuration
// Este archivo puede ser usado para configurar un servidor WebSocket real en producción

export const WS_CONFIG = {
  // URL del servidor WebSocket
  URL: process.env.NODE_ENV === 'production' 
    ? 'wss://your-production-server.com/ws'
    : 'ws://localhost:8080',
  
  // Configuración de reconexión
  RECONNECT: {
    MAX_ATTEMPTS: 5,
    INITIAL_DELAY: 1000, // 1 segundo
    MAX_DELAY: 30000, // 30 segundos
    BACKOFF_MULTIPLIER: 2
  },
  
  // Configuración de heartbeat
  HEARTBEAT: {
    INTERVAL: 30000, // 30 segundos
    TIMEOUT: 10000 // 10 segundos
  },
  
  // Eventos soportados
  EVENTS: {
    PRODUCT_CREATED: 'product:created',
    PRODUCT_UPDATED: 'product:updated',
    PRODUCT_DELETED: 'product:deleted',
    CATEGORY_CREATED: 'category:created',
    CATEGORY_UPDATED: 'category:updated',
    CATEGORY_DELETED: 'category:deleted',
    INIT: 'init',
    BROADCAST: 'broadcast'
  }
}

// Función para crear un cliente WebSocket con configuración robusta
export const createWebSocketClient = (url: string) => {
  const ws = new WebSocket(url)
  
  // Configurar heartbeat
  let heartbeatInterval: NodeJS.Timeout
  let heartbeatTimeout: NodeJS.Timeout
  
  const startHeartbeat = () => {
    heartbeatInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }))
        
        heartbeatTimeout = setTimeout(() => {
          console.warn('Heartbeat timeout, reconnecting...')
          ws.close()
        }, WS_CONFIG.HEARTBEAT.TIMEOUT)
      }
    }, WS_CONFIG.HEARTBEAT.INTERVAL)
  }
  
  const stopHeartbeat = () => {
    if (heartbeatInterval) clearInterval(heartbeatInterval)
    if (heartbeatTimeout) clearTimeout(heartbeatTimeout)
  }
  
  ws.onopen = () => {
    console.log('WebSocket connected')
    startHeartbeat()
  }
  
  ws.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data)
      
      // Manejar pong del heartbeat
      if (message.type === 'pong') {
        if (heartbeatTimeout) clearTimeout(heartbeatTimeout)
        return
      }
      
      // Procesar otros mensajes
      console.log('WebSocket message received:', message)
    } catch (error) {
      console.error('Error parsing WebSocket message:', error)
    }
  }
  
  ws.onclose = () => {
    console.log('WebSocket disconnected')
    stopHeartbeat()
  }
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
    stopHeartbeat()
  }
  
  return ws
}

// Función para enviar datos al servidor usando axios
export const syncWithServer = async (endpoint: string, data: any) => {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error syncing with server:', error)
    throw error
  }
}

// Función para obtener datos del servidor
export const fetchFromServer = async (endpoint: string) => {
  try {
    const response = await fetch(endpoint)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching from server:', error)
    throw error
  }
}
