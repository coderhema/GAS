import { ChartArea } from '@/components/chart-area'
import { ChartBar } from '@/components/chart-bar'
import { ChartLine } from '@/components/chart-line'
import { ChartPie } from '@/components/chart-pie'
import { GlobeVisualization } from '@/components/globe'
import { GlobalAlert } from '@/components/global-alert'

const globalAlertData = {
  level: 'medium' as const,
  message: 'Increased activity detected in multiple regions. Stay vigilant and follow local guidelines.'
}

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 bg-background">
      <div className="w-full max-w-7xl mx-auto mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Global Analytics System (GAS)</h1>
        <GlobalAlert data={globalAlertData} />
        <div className="mt-8">
          <GlobeVisualization />
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Detailed Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartLine />
          <ChartBar />
          <ChartArea />
          <ChartPie />
        </div>
      </div>
    </div>
  )
}

