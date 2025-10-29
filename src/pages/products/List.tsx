import React, { useMemo, useState } from 'react'
import { useStore } from '../../context/Store'
import ProductCard from '../../components/ProductCard'
import CategoryDialog from '../../components/CategoryDialog'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { useNavigate } from 'react-router'

const PAGE_SIZE = 6

const Products: React.FC = () => {
  const { products, categories, exportProductsCSV, deleteProduct } = useStore()
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  // Filtrar productos basado en el término de búsqueda
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products
    
    const term = searchTerm.toLowerCase()
    return products.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(term)
      const skuMatch = product.sku?.toLowerCase().includes(term) || false
      const categoryMatch = categories.find(cat => cat.id === product.categoryId)?.name.toLowerCase().includes(term) || false
      
      return nameMatch || skuMatch || categoryMatch
    })
  }, [products, categories, searchTerm])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))

  const pageItems = useMemo(() => filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filteredProducts, page])

  // Resetear página cuando cambie el término de búsqueda
  React.useEffect(() => {
    setPage(1)
  }, [searchTerm])

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      <div className="flex items-center gap-4">
        <div className="w-full sm:w-80">
          <Input
            type="text"
            placeholder="Buscar productos por nombre, SKU o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button onClick={() => setView('grid')} variant={view === 'grid' ? 'default' : 'outline'} size="sm" className="flex-1 sm:flex-initial">Grid</Button>
          <Button onClick={() => setView('list')} variant={view === 'list' ? 'default' : 'outline'} size="sm" className="flex-1 sm:flex-initial">List</Button>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <CategoryDialog />
          <Button onClick={() => exportProductsCSV()} variant="outline" size="sm" className="w-full sm:w-auto">Export CSV</Button>
          <Button onClick={() => navigate('/products/new')} size="sm" className="w-full sm:w-auto">New product</Button>
        </div>
      </div>

      {pageItems.length > 0 ? (
        <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
          {pageItems.map(p => (
            <ProductCard key={p.id} product={p} onEdit={() => navigate(`/products/edit/${p.id}`)} onDelete={() => deleteProduct(p.id)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? (
            <div>
              <p className="text-lg font-medium">No se encontraron productos</p>
              <p className="text-sm">Intenta con otros términos de búsqueda</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium">No hay productos disponibles</p>
              <p className="text-sm">Crea tu primer producto para comenzar</p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-sm">Page {page} / {totalPages}</div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={() => setPage(p => Math.max(1, p - 1))} variant="outline" size="sm" className="flex-1 sm:flex-initial" disabled={page === 1}>Prev</Button>
          <Button onClick={() => setPage(p => Math.min(totalPages, p + 1))} variant="outline" size="sm" className="flex-1 sm:flex-initial" disabled={page === totalPages}>Next</Button>
        </div>
      </div>
    </div>
  )
}

export default Products
