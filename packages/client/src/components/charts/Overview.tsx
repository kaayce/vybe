import { MarketCapChart } from './MarketCapChart'
import { TpsChart } from './TpsChart'
import { WalletBalancesChart } from './WalletBalancesChart'

export const Overview = () => {
  return (
    <div className="flex-1 flex flex-col py-2 px-6 space-y-6 mt-4">
      <MarketCapChart />
      <TpsChart />
      <WalletBalancesChart />
    </div>
  )
}
