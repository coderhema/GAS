'use client'

import * as React from 'react'
import { TrendingUp } from 'lucide-react'
import { Label, Pie, PieChart } from 'recharts'
import { ResponsiveContainer } from 'recharts';

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
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const chartData = [
  { alertLevel: 'Low', count: 275, fill: 'var(--color-low)' },
  { alertLevel: 'Medium', count: 200, fill: 'var(--color-medium)' },
  { alertLevel: 'High', count: 125, fill: 'var(--color-high)' },
]

const chartConfig = {
  count: {
    label: 'Count',
  },
  low: {
    label: 'Low',
    color: 'hsl(var(--chart-1))',
  },
  medium: {
    label: 'Medium',
    color: 'hsl(var(--chart-2))',
  },
  high: {
    label: 'High',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig

export function ChartPie() {
  const totalAlerts = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0)
  }, [])

  return (
    <Card className="flex flex-col bg-card text-card-foreground">
      <CardHeader className="items-center pb-0">
        <CardTitle>Global Alert Distribution</CardTitle>
        <CardDescription>Current alert levels worldwide</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="w-full h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="alertLevel"
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={2}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalAlerts.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Total Alerts
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 font-medium leading-none text-foreground">
          Low-level alerts are most common <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none">
          High-level alerts require immediate attention
        </div>
      </CardFooter>
    </Card>
  )
}

