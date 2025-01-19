import { AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AlertData {
  level: 'low' | 'medium' | 'high'
  message: string
}

const alertColors = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500'
}

export function GlobalAlert({ data }: { data: AlertData }) {
  return (
    <Card className={`${alertColors[data.level]} text-white`}>
      <CardHeader className="flex flex-row items-center space-x-2 pb-2">
        <AlertTriangle size={24} />
        <CardTitle>Global Alert Level: {data.level.toUpperCase()}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-white text-sm mt-1">{data.message}</CardDescription>
      </CardContent>
    </Card>
  )
}

