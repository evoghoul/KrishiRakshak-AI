import { MandiPrices } from '@/components/dashboard/mandi-prices'
import { NearbyBuyers } from '@/components/dashboard/nearby-buyers'
import { GroupAggregation } from '@/components/dashboard/group-aggregation'
import { LogisticsMatching } from '@/components/dashboard/logistics-matching'

export function SellSmarter() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <MandiPrices />
        <NearbyBuyers />
      </div>
      <GroupAggregation />
      <LogisticsMatching />
    </div>
  )
}
