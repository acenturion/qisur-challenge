import React from 'react'
import { useStore } from '../context/Store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Badge } from './ui/badge'
import { Activity, TrendingUp, Clock, Users } from 'lucide-react'

const HistoryStats: React.FC = () => {
  const { history } = useStore()

  const totalChanges = history.length
  const todayChanges = history.filter(change => {
    const today = new Date().toDateString()
    const changeDate = new Date(change.at).toDateString()
    return today === changeDate
  }).length

  const productChanges = history.filter(change => change.entity === 'product').length
  const categoryChanges = history.filter(change => change.entity === 'category').length

  const createActions = history.filter(change => change.type === 'create').length
  const updateActions = history.filter(change => change.type === 'update').length
  const deleteActions = history.filter(change => change.type === 'delete').length

  const getMostActiveHour = () => {
    if (history.length === 0) return 'N/A'
    
    const hourCounts: { [key: number]: number } = {}
    
    history.forEach(change => {
      const hour = new Date(change.at).getHours()
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    })

    const hourKeys = Object.keys(hourCounts)
    if (hourKeys.length === 0) return 'N/A'

    const mostActiveHour = hourKeys.reduce((a, b) => 
      hourCounts[parseInt(a)] > hourCounts[parseInt(b)] ? a : b
    )

    return mostActiveHour ? `${mostActiveHour}:00` : 'N/A'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cambios</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalChanges}</div>
          <p className="text-xs text-muted-foreground">
            {todayChanges} hoy
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Productos</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{productChanges}</div>
          <p className="text-xs text-muted-foreground">
            Cambios en productos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categorías</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{categoryChanges}</div>
          <p className="text-xs text-muted-foreground">
            Cambios en categorías
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hora Más Activa</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getMostActiveHour()}</div>
          <p className="text-xs text-muted-foreground">
            Pico de actividad
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Distribución de Acciones</CardTitle>
          <CardDescription>Desglose de tipos de operaciones realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default" className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Crear: {createActions}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Actualizar: {updateActions}
            </Badge>
            <Badge variant="destructive" className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Eliminar: {deleteActions}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default HistoryStats
