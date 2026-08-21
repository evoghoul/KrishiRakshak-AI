import { DecisionInputs } from '@/components/dashboard/decision-inputs'
import { DecisionEngine } from '@/components/dashboard/decision-engine'

export function LoseLess() {
  return (
    <div className="grid items-start gap-6 xl:grid-cols-2">
      <DecisionInputs />
      <DecisionEngine />
    </div>
  )
}
