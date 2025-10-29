import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Server, WebSocket as MockWebSocket } from 'mock-socket'
import { exportCsv } from '../utils/csv'

export type Product = {
  id: string
  name: string
  sku?: string
  price: number
  stock: number
  categoryId?: string
  image?: string
  updatedAt: string
}

export type Category = {
  id: string
  name: string
}

type ChangeLog = {
  id: string
  type: 'create' | 'update' | 'delete'
  entity: 'product' | 'category'
  payload: any
  at: string
}

type StoreContextValue = {
  products: Product[]
  categories: Category[]
  history: ChangeLog[]
  createProduct: (p: Omit<Product, 'id' | 'updatedAt'>) => void
  updateProduct: (id: string, patch: Partial<Product>) => void
  deleteProduct: (id: string) => void
  createCategory: (c: Omit<Category, 'id'>) => void
  updateCategory: (id: string, patch: Partial<Category>) => void
  deleteCategory: (id: string) => void
  exportProductsCSV: () => void
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined)

const WS_URL = 'ws://localhost:8080'

const initialCategories: Category[] = [
  { id: 'c1', name: 'General' },
  { id: 'c2', name: 'Electronics' },
]

const initialProducts: Product[] = [
  { id: 'p1', name: 'Sample A', sku: 'A-001', price: 19.99, stock: 12, categoryId: 'c1', updatedAt: new Date().toISOString() },
  { id: 'p2', name: 'Sample B', sku: 'B-002', price: 129.5, stock: 3, categoryId: 'c2', updatedAt: new Date().toISOString() },
]

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [history, setHistory] = useState<ChangeLog[]>([])

  // Create a mock WebSocket server (runs in the browser) to demonstrate real-time updates
  useEffect(() => {
    const mockServer = new Server(WS_URL)

    mockServer.on('connection', socket => {
      // send initial state
      socket.send(JSON.stringify({ type: 'init', products, categories }))
    })

    return () => {
      mockServer.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // client socket to listen to mock server
  useEffect(() => {
    const client = new MockWebSocket(WS_URL)

    client.onmessage = (ev: MessageEvent) => {
      try {
        const msg = JSON.parse(ev.data)
        if (msg.type === 'broadcast') {
          const { action, payload } = msg
          if (action === 'product:created') {
            setProducts(prev => [payload, ...prev])
            setHistory(h => [{ id: String(Date.now()), type: 'create', entity: 'product', payload, at: new Date().toISOString() }, ...h])
          }
          if (action === 'product:updated') {
            setProducts(prev => prev.map(p => (p.id === payload.id ? payload : p)))
            setHistory(h => [{ id: String(Date.now()), type: 'update', entity: 'product', payload, at: new Date().toISOString() }, ...h])
          }
          if (action === 'product:deleted') {
            setProducts(prev => prev.filter(p => p.id !== payload.id))
            setHistory(h => [{ id: String(Date.now()), type: 'delete', entity: 'product', payload, at: new Date().toISOString() }, ...h])
          }
          if (action === 'category:created') {
            setCategories(prev => [payload, ...prev])
            setHistory(h => [{ id: String(Date.now()), type: 'create', entity: 'category', payload, at: new Date().toISOString() }, ...h])
          }
          if (action === 'category:updated') {
            setCategories(prev => prev.map(c => (c.id === payload.id ? payload : c)))
            setHistory(h => [{ id: String(Date.now()), type: 'update', entity: 'category', payload, at: new Date().toISOString() }, ...h])
          }
          if (action === 'category:deleted') {
            setCategories(prev => prev.filter(c => c.id !== payload.id))
            setHistory(h => [{ id: String(Date.now()), type: 'delete', entity: 'category', payload, at: new Date().toISOString() }, ...h])
          }
        }
      } catch (e) {
        // ignore
      }
    }

    return () => {
      try {
        client.close()
      } catch {}
    }
  }, [])

  // helper to broadcast via the mock server
  const broadcast = (action: string, payload: any) => {
    try {
      // connect client to server to broadcast a message handled by server -> clients
      const s = new Server(WS_URL)
      s.emit('message', JSON.stringify({ type: 'broadcast', action, payload }))
      s.stop()
    } catch (e) {
      // fallback: directly update (local)
    }
  }

  const createProduct = (p: Omit<Product, 'id' | 'updatedAt'>) => {
    const prod: Product = { ...p, id: `p${Date.now()}`, updatedAt: new Date().toISOString() }
    setProducts(prev => [prod, ...prev])
    setHistory(h => [{ id: String(Date.now()), type: 'create', entity: 'product', payload: prod, at: new Date().toISOString() }, ...h])
    // broadcast
    broadcast('product:created', prod)
  }

  const updateProduct = (id: string, patch: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p)))
    const payload = { id, ...patch }
    setHistory(h => [{ id: String(Date.now()), type: 'update', entity: 'product', payload, at: new Date().toISOString() }, ...h])
    broadcast('product:updated', payload)
  }

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id))
    setHistory(h => [{ id: String(Date.now()), type: 'delete', entity: 'product', payload: { id }, at: new Date().toISOString() }, ...h])
    broadcast('product:deleted', { id })
  }

  const createCategory = (c: Omit<Category, 'id'>) => {
    const cat: Category = { ...c, id: `c${Date.now()}` }
    setCategories(prev => [cat, ...prev])
    setHistory(h => [{ id: String(Date.now()), type: 'create', entity: 'category', payload: cat, at: new Date().toISOString() }, ...h])
    // broadcast
    broadcast('category:created', cat)
  }

  const updateCategory = (id: string, patch: Partial<Category>) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...patch } : c)))
    const payload = { id, ...patch }
    setHistory(h => [{ id: String(Date.now()), type: 'update', entity: 'category', payload, at: new Date().toISOString() }, ...h])
    // broadcast
    broadcast('category:updated', payload)
  }

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id))
    setHistory(h => [{ id: String(Date.now()), type: 'delete', entity: 'category', payload: { id }, at: new Date().toISOString() }, ...h])
    // broadcast
    broadcast('category:deleted', { id })
  }

  const exportProductsCSV = () => {
    exportCsv(products, 'products')
  }

  const value = useMemo(() => ({ products, categories, history, createProduct, updateProduct, deleteProduct, createCategory, updateCategory, deleteCategory, exportProductsCSV }), [products, categories, history])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

export default StoreProvider
