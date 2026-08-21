import { ScanCrop } from '@/components/dashboard/scan-crop'
import { CropDiagnostics } from '@/components/dashboard/crop-diagnostics'
import { SchedulePlanner } from '@/components/dashboard/schedule-planner'
import { GovSchemes } from '@/components/dashboard/gov-schemes'

export function GrowBetter() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <ScanCrop />
        <CropDiagnostics />
      </div>
      <SchedulePlanner />
      <GovSchemes />
    </div>
  )
}
