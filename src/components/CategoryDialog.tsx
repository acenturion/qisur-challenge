import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useStore, type Category } from '../context/Store'
import { Button } from './ui/button'
import { Input } from './ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { toast } from 'sonner'
import { FolderIcon, EditIcon, TrashIcon, PlusIcon } from 'lucide-react'

const categoryFormSchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Category name must be less than 50 characters'),
})

type CategoryFormValues = z.infer<typeof categoryFormSchema>

const CategoryDialog: React.FC = () => {
  const { categories, createCategory, updateCategory, deleteCategory } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
    },
  })

  const handleCreate = () => {
    setIsCreating(true)
    setEditingCategory(null)
    form.reset({ name: '' })
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setIsCreating(false)
    form.reset({ name: category.name })
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingCategory(null)
    form.reset({ name: '' })
  }

  const onSubmit = (data: CategoryFormValues) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, data)
      toast.success('Category updated successfully')
    } else {
      createCategory(data)
      toast.success('Category created successfully')
    }
    handleCancel()
  }

  const handleDelete = (category: Category) => {
    if (window.confirm(`Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`)) {
      deleteCategory(category.id)
      toast.success('Category deleted successfully')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          <FolderIcon className="w-4 h-4 mr-2" />
          Categories
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
          <DialogDescription>
            Create, edit, and delete product categories. Products will be organized within these categories.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Create/Edit Form */}
          {(isCreating || editingCategory) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter category name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-2">
                      <Button type="button" onClick={handleCancel} variant="outline" size="sm">
                        Cancel
                      </Button>
                      <Button type="submit" size="sm">
                        {editingCategory ? 'Update' : 'Create'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Categories List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Existing Categories</h3>
              {!isCreating && !editingCategory && (
                <Button onClick={handleCreate} size="sm">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              )}
            </div>

            {categories.length > 0 ? (
              <div className="grid gap-2">
                {categories.map((category) => (
                  <Card key={category.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FolderIcon className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          onClick={() => handleEdit(category)}
                          variant="ghost"
                          size="sm"
                          disabled={isCreating || editingCategory?.id !== category.id}
                        >
                          <EditIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(category)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          disabled={isCreating || editingCategory?.id !== category.id}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FolderIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No categories yet</p>
                <p className="text-sm">Create your first category to organize products</p>
                {!isCreating && !editingCategory && (
                  <Button onClick={handleCreate} className="mt-4" size="sm">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Create Category
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CategoryDialog
