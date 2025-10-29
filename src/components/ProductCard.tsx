import React from 'react'
import type { Product } from '../context/Store'
import { useStore } from '../context/Store'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card'

const ProductCard: React.FC<{ product: Product; onEdit?: () => void; onDelete?: () => void }> = ({ product, onEdit, onDelete }) => {
  const { categories } = useStore()
  const category = categories.find(cat => cat.id === product.categoryId)
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                }}
              />
            ) : null}
            <span className={`text-xs text-gray-500 ${product.image ? 'hidden' : ''}`}>Img</span>
          </div>
          <div className="flex-1">
            <CardTitle>{product.name}</CardTitle>
            <CardDescription>
              SKU: {product.sku}
              {category && <span className="ml-2 text-blue-600 dark:text-blue-400">• {category.name}</span>}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm">${product.price.toFixed(2)} • {product.stock} in stock</div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button onClick={onEdit} size="sm">Edit</Button>
        <Button onClick={onDelete} variant="destructive" size="sm">Delete</Button>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
