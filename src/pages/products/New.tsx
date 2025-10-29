import React from 'react'
import { useNavigate } from 'react-router'
import ProductForm from '../../components/ProductForm'

const ProductNew: React.FC = () => {
  const navigate = useNavigate()

  const handleClose = () => {
    navigate('/products')
  }
  

  return (
    <div className="max-w-2xl">
      <ProductForm onClose={handleClose} />
    </div>
  )
}

export default ProductNew


