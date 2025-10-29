import React from 'react'
import { useStore } from '../context/Store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { Badge } from './ui/badge'
import { Clock, Plus, Edit, Trash2, Package, Tag } from 'lucide-react'

const HistoryTable: React.FC = () => {
  const { history } = useStore()

  const getActionIcon = (type: string, entity: string) => {
    if (type === 'create') return <Plus className="h-4 w-4 text-green-600" />
    if (type === 'update') return <Edit className="h-4 w-4 text-blue-600" />
    if (type === 'delete') return <Trash2 className="h-4 w-4 text-red-600" />
    return null
  }

  const getEntityIcon = (entity: string) => {
    if (entity === 'product') return <Package className="h-4 w-4" />
    if (entity === 'category') return <Tag className="h-4 w-4" />
    return null
  }

  const getActionBadgeVariant = (type: string) => {
    if (type === 'create') return 'default'
    if (type === 'update') return 'secondary'
    if (type === 'delete') return 'destructive'
    return 'outline'
  }

  const getActionText = (type: string) => {
    if (type === 'create') return 'Creado'
    if (type === 'update') return 'Actualizado'
    if (type === 'delete') return 'Eliminado'
    return type
  }

  const getEntityText = (entity: string) => {
    if (entity === 'product') return 'Producto'
    if (entity === 'category') return 'Categoría'
    return entity
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getItemName = (payload: any) => {
    if (payload.name) return payload.name
    if (payload.id) return `ID: ${payload.id}`
    return 'Elemento'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Historial de Cambios
        </CardTitle>
        <CardDescription>
          Registro de todas las operaciones realizadas en el sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay cambios registrados aún
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Acción</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Elemento</TableHead>
                <TableHead>Detalles</TableHead>
                <TableHead className="text-right">Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((change) => (
                <TableRow key={change.id}>
                  <TableCell>
                    {getActionIcon(change.type, change.entity)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getEntityIcon(change.entity)}
                      <Badge variant={getActionBadgeVariant(change.type)}>
                        {getActionText(change.type)} {getEntityText(change.entity)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {getItemName(change.payload)}
                  </TableCell>
                  <TableCell>
                    {change.type === 'create' && (
                      <div className="text-sm text-muted-foreground">
                        {change.entity === 'product' && (
                          <>
                            Precio: ${change.payload.price} | 
                            Stock: {change.payload.stock} | 
                            SKU: {change.payload.sku || 'N/A'}
                          </>
                        )}
                        {change.entity === 'category' && (
                          <>Nueva categoría creada</>
                        )}
                      </div>
                    )}
                    {change.type === 'update' && (
                      <div className="text-sm text-muted-foreground">
                        Campos actualizados
                      </div>
                    )}
                    {change.type === 'delete' && (
                      <div className="text-sm text-muted-foreground">
                        Elemento eliminado
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {formatDate(change.at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

export default HistoryTable
