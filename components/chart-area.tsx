'use client'

import { TrendingUp } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'

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
  { month: 'Jan', cyberAttacks: 120, naturalDisasters: 5, politicalUnrest: 30 },
  { month: 'Feb', cyberAttacks: 150, naturalDisasters: 8, politicalUnrest: 35 },
  { month: 'Mar', cyberAttacks: 200, naturalDisasters: 12, politicalUnrest: 45 },
  { month: 'Apr', cyberAttacks: 180, naturalDisasters: 15, politicalUnrest: 60 },
  { month: 'May', cyberAttacks: 220, naturalDisasters: 10, politicalUnrest: 50 },
  { month: 'Jun', cyberAttacks: 250, naturalDisasters: 7, politicalUnrest: 40 },
]

const chartConfig = {
  cyberAttacks: {
    label: 'Cyber Attacks',
    color: 'hsl(var(--chart-1))',
  },
  naturalDisasters: {
    label: 'Natural Disasters',
    color: 'hsl(var(--chart-2))',
  },
  politicalUnrest: {
    label: 'Political Unrest',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig

export function ChartArea() {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle>Global Threat Trends</CardTitle>
        <CardDescription>
          Showing incident types over the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid vertical={false} stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke="rgba(255, 255, 255, 0.5)"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke="rgba(255, 255, 255, 0.5)"
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                type="monotone"
                dataKey="cyberAttacks"
                stackId="1"
                stroke="var(--color-cyberAttacks)"
                fill="var(--color-cyberAttacks)"
              />
              <Area
                type="monotone"
                dataKey="naturalDisasters"
                stackId="1"
                stroke="var(--color-naturalDisasters)"
                fill="var(--color-naturalDisasters)"
              />
              <Area
                type="monotone"
                dataKey="politicalUnrest"
                stackId="1"
                stroke="var(--color-politicalUnrest)"
                fill="var(--color-politicalUnrest)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm text-gray-300">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none text-gray-300">
              Cyber attacks show the highest increase <TrendingUp className="h-4 w-4 text-gray-300" />
            </div>
            <div className="flex items-center gap-2 leading-none text-gray-400">
              Natural disasters fluctuate seasonally
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

