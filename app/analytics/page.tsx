'use client'

import { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const data = [
  { country: 'USA', gdp: 21433225, population: 331002651 },
  { country: 'China', gdp: 14342903, population: 1439323776 },
  { country: 'Japan', gdp: 5082465, population: 126476461 },
  { country: 'Germany', gdp: 3845630, population: 83783942 },
  { country: 'UK', gdp: 2827113, population: 67886011 },
]

export default function AnalyticsPage() {
  const [chartData, setChartData] = useState({
    labels: data.map(item => item.country),
    datasets: [
      {
        label: 'GDP (millions USD)',
        data: data.map(item => item.gdp / 1000000),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  })

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>GDP by Country</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={chartData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Country Data</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Country</TableHead>
                  <TableHead>GDP (USD)</TableHead>
                  <TableHead>Population</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.country}>
                    <TableCell>{item.country}</TableCell>
                    <TableCell>{item.gdp.toLocaleString()}</TableCell>
                    <TableCell>{item.population.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

