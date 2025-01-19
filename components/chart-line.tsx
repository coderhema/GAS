'use client'

import { TrendingUp, DollarSign, Wind } from 'lucide-react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const chartData = [
  { year: 2015, globalAlertLevel: 2, avgGdpPerCapita: 10500, avgCo2Emissions: 4.5 },
  { year: 2016, globalAlertLevel: 2, avgGdpPerCapita: 10700, avgCo2Emissions: 4.4 },
  { year: 2017, globalAlertLevel: 3, avgGdpPerCapita: 11000, avgCo2Emissions: 4.5 },
  { year: 2018, globalAlertLevel: 3, avgGdpPerCapita: 11300, avgCo2Emissions: 4.6 },
  { year: 2019, globalAlertLevel: 4, avgGdpPerCapita: 11500, avgCo2Emissions: 4.5 },
  { year: 2020, globalAlertLevel: 5, avgGdpPerCapita: 10800, avgCo2Emissions: 4.2 },
  { year: 2021, globalAlertLevel: 4, avgGdpPerCapita: 11700, avgCo2Emissions: 4.4 },
]

const chartConfig = {
  globalAlertLevel: {
    label: 'Global Alert Level',
    color: 'hsl(var(--chart-1))',
  },
  avgGdpPerCapita: {
    label: 'Avg GDP per Capita',
    color: 'hsl(var(--chart-2))',
  },
  avgCo2Emissions: {
    label: 'Avg CO2 Emissions',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig

const alertColors = {
  1: 'text-green-500',
  2: 'text-yellow-500',
  3: 'text-orange-500',
  4: 'text-red-500',
  5: 'text-purple-500'
}

export function ChartLine() {
  const currentYear = chartData[chartData.length - 1]

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Global Trends</CardTitle>
        <CardDescription>Alert Levels, GDP per Capita, and CO2 Emissions</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="year"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke="hsl(var(--muted-foreground))"
                domain={[0, 5]}
                ticks={[1, 2, 3, 4, 5]}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="globalAlertLevel"
                stroke="var(--color-globalAlertLevel)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgGdpPerCapita"
                stroke="var(--color-avgGdpPerCapita)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgCo2Emissions"
                stroke="var(--color-avgCo2Emissions)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex flex-col sm:flex-row w-full items-start justify-between gap-2 text-sm">
          <div className="grid gap-1">
            <div className="flex items-center gap-2 font-medium leading-none text-foreground">
              <TrendingUp className="h-4 w-4" />
              Alert level: {currentYear.globalAlertLevel}
            </div>
            <div className="leading-none text-muted-foreground">
              Global situation overview
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="text-green-500">
              Avg GDP per Capita: ${currentYear.avgGdpPerCapita.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-blue-500" />
            <span className="text-blue-500">
              Avg CO2 Emissions: {currentYear.avgCo2Emissions.toFixed(1)} metric tons per capita
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

