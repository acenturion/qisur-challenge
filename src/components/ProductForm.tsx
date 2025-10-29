import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useStore } from '../context/Store'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form'
import { toast } from 'sonner'
import { ImageIcon, ImagePlusIcon, TrashIcon } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  sku: z.string().optional(),
  price: z.string()
    .min(1, 'Price is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number with maximum 2 decimal places')
    .refine((val) => parseFloat(val) >= 0, 'Price must be greater than or equal to 0'),
  stock: z.string()
    .min(1, 'Stock is required')
    .regex(/^\d+$/, 'Stock must be a valid integer')
    .refine((val) => parseInt(val) >= 0 && parseInt(val) <= 9999, 'Stock must be between 0 and 9999'),
  categoryId: z.string().optional(),
  image: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

const ProductForm: React.FC<{ initial?: Partial<FormValues> & { id?: string }; onClose?: () => void }> = ({ initial, onClose }) => {
  const { createProduct, updateProduct, categories } = useStore()
  const [imagePreview, setImagePreview] = useState<string | null>(initial?.image || null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initial?.name || '',
      sku: initial?.sku || '',
      price: initial?.price?.toString() || '',
      stock: initial?.stock?.toString() || '',
      categoryId: initial?.categoryId || '',
      image: initial?.image || '',
    },
  })

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file')
        return
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        form.setValue('image', result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = (data: FormValues) => {
    const productData = {
      ...data,
      price: parseFloat(data.price),
      stock: parseInt(data.stock),
      categoryId: data.categoryId || undefined,
      image: data.image || undefined
    }

    if (initial && initial.id) {
      updateProduct(initial.id, productData as any)
      toast.success('Product updated successfully')
    } else {
      createProduct(productData as any)
      toast.success('Product created successfully')
    }
    onClose?.()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded shadow">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input placeholder="Product SKU" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder="Select a category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem >
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only numbers and one decimal point
                      if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                        field.onChange(value);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="0"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only numbers and limit to 4 digits (0-9999)
                      if (value === '' || (/^\d+$/.test(value) && parseInt(value) <= 9999)) {
                        field.onChange(value);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem>
              <FormLabel>Product Image</FormLabel>
              <FormControl>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="w-full sm:w-auto sm:flex-1"
                  >
                    {imagePreview ? <ImageIcon className="w-4 h-4" /> : <ImagePlusIcon className="w-4 h-4" />}
                    {imagePreview ? 'Change Image' : 'Select Image'}
                  </Button>
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="destructive"
                      className="w-full sm:w-auto sm:flex-1"
                      onClick={() => {
                        setImagePreview(null)
                        form.setValue('image', '')
                      }}
                    >
                      <TrashIcon className="w-4 h-4" />
                      Remove Image
                    </Button>
                  )}
                </div>
              </FormControl>
              <FormMessage />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded border"
                  />
                </div>
              )}
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <Button type="button" onClick={onClose} variant="outline" size="sm" className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button type="submit" size="sm" className="w-full sm:w-auto">
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ProductForm
