import { WeatherCard } from '@/components/dashboard/weather-card'
import { AlertsPanel } from '@/components/dashboard/alerts-panel'
import { ActiveCrops } from '@/components/dashboard/crop-card'

export function DashboardHome() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <WeatherCard />
        <AlertsPanel />
      </div>
      <ActiveCrops />
    </div>
  )
}
