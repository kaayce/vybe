import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MarketCapChart } from './charts/MarketCapChart'
import { Overview } from './charts/Overview'
import { TpsChart } from './charts/TpsChart'
import { WalletBalancesChart } from './charts/WalletBalancesChart'

const tabs = [
  {
    label: 'Overview',
    value: 'overview',
    component: <Overview />,
  },
  {
    label: 'Market Cap',
    value: 'market-cap',
    component: <MarketCapChart />,
  },
  {
    label: 'TPS',
    value: 'tps',
    component: <TpsChart />,
  },
  {
    label: 'Wallets',
    value: 'balances',
    component: <WalletBalancesChart />,
  },
]
export const InsightsTabs = () => {
  return (
    <div className="w-full">
      <Tabs defaultValue="overview" className="">
        <TabsList className="w-full">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
