import React from 'react'
import Chart from 'react-apexcharts'
import { useStore } from '../context/Store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Skeleton } from '../components/ui/skeleton'
import HistoryTable from '../components/HistoryTable'
import HistoryStats from '../components/HistoryStats'

const Dashboard: React.FC = () => {
  const { products } = useStore()
  const [isLoading, setIsLoading] = React.useState(true)

  //Simulo el fetch de la primer llamada para generar un loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const totalProducts = products.length
  const totalStock = products.reduce((s, p) => s + p.stock, 0)

  const series = [
    {
      name: 'Stock',
      data: products.map(p => p.stock)
    },
    {
      name: 'Price',
      data: products.map(p => p.price)
    }
  ]

  const options: any = {
    chart: { id: 'main' },
    xaxis: { categories: products.map(p => p.name) }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-52" />
            <Skeleton className="h-4 w-72 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[320px] w-full" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
            <CardDescription>Number of products in inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Stock</CardTitle>
            <CardDescription>Total units available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStock}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock & Price Analysis</CardTitle>
          <CardDescription>Visual representation of product stock and pricing</CardDescription>
        </CardHeader>
        <CardContent>
          <Chart options={options} series={series} type="line" height={320} />
        </CardContent>
      </Card>

      <HistoryStats />

      <HistoryTable />
    </div>
  )
}

export default Dashboard
