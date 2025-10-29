import React from 'react'
import Chart from 'react-apexcharts'
import { useStore } from '../context/Store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import HistoryTable from '../components/HistoryTable'
import HistoryStats from '../components/HistoryStats'

const Dashboard: React.FC = () => {
  const { products } = useStore()

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
