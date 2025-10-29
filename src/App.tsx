import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { StoreProvider } from './context/Store'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Products from './pages/products/List'
import ProductNew from './pages/products/New'
import ProductEdit from './pages/products/Edit'
import { Toaster } from './components/ui/sonner'
import './App.css'

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/new" element={<ProductNew />} />
            <Route path="/products/edit/:id" element={<ProductEdit />} />
          </Routes>
        </Layout>
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </StoreProvider>
  )
}

export default App
