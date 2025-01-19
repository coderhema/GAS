'use client'

import { TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const chartData = [
  { continent: 'North America', lowAlerts: 50, mediumAlerts: 30, highAlerts: 10 },
  { continent: 'South America', lowAlerts: 40, mediumAlerts: 35, highAlerts: 15 },
  { continent: 'Europe', lowAlerts: 60, mediumAlerts: 25, highAlerts: 5 },
  { continent: 'Africa', lowAlerts: 30, mediumAlerts: 40, highAlerts: 20 },
  { continent: 'Asia', lowAlerts: 45, mediumAlerts: 35, highAlerts: 25 },
  { continent: 'Oceania', lowAlerts: 70, mediumAlerts: 20, highAlerts: 5 },
]

const chartConfig = {
  lowAlerts: {
    label: 'Low Alerts',
    color: 'hsl(var(--chart-1))',
  },
  mediumAlerts: {
    label: 'Medium Alerts',
    color: 'hsl(var(--chart-2))',
  },
  highAlerts: {
    label: 'High Alerts',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig

export function ChartBar() {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle>Alert Distribution by Continent</CardTitle>
        <CardDescription>Current global situation</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis
                dataKey="continent"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                stroke="rgba(255, 255, 255, 0.5)"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                stroke="rgba(255, 255, 255, 0.5)"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="lowAlerts" stackId="a" fill="var(--color-lowAlerts)" />
              <Bar dataKey="mediumAlerts" stackId="a" fill="var(--color-mediumAlerts)" />
              <Bar dataKey="highAlerts" stackId="a" fill="var(--color-highAlerts)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm text-gray-300">
        <div className="flex gap-2 font-medium leading-none">
          Asia has the highest number of high alerts <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-gray-400">
          Oceania has the lowest overall alert levels
        </div>
      </CardFooter>
    </Card>
  )
}

