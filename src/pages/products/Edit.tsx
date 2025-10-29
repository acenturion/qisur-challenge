import React from 'react'
import { useNavigate, useParams } from 'react-router'
import ProductForm from '../../components/ProductForm'
import { useStore } from '../../context/Store'

const ProductEdit: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { products } = useStore()

  const handleClose = () => {
    navigate('/products')
  }

  // Buscar el producto por ID
  const product = products.find(p => p.id === id)

  if (!product) {
    return (
      <div className="max-w-2xl">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Product not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">The product you're trying to edit doesn't exist.</p>
          <button 
            onClick={handleClose}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <ProductForm 
        initial={{
          id: product.id,
          name: product.name,
          sku: product.sku || '',
          price: product.price.toString(),
          stock: product.stock.toString(),
          categoryId: product.categoryId || '',
          image: product.image || ''
        }} 
        onClose={handleClose} 
      />
    </div>
  )
}

export default ProductEdit
