import { fetchBullishTokens } from '@/api/token'
import type { TokensDataResponse } from '@/api/token.types'
import { formatCurrency } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import type { ApexOptions } from 'apexcharts'
import Chart from 'react-apexcharts'
import { Card } from '../ui/card'

const COLORS = ['#6366f1', '#f59e42', '#10b981', '#f43f5e', '#fbbf24']
export const MarketCapChart = () => {
  const {
    data: tokensData,
    isLoading,
    error,
  } = useQuery<TokensDataResponse>({
    queryKey: ['bullish-tokens'],
    queryFn: () => fetchBullishTokens(),
    refetchInterval: 300000, // Refetch every 5 minutes
  })

  if (isLoading) {
    return (
      <Card className="w-full h-full flex items-center justify-center min-h-[500px]">
        <div className="text-gray-500">Loading market cap data...</div>
      </Card>
    )
  }

  if (error || !tokensData) {
    return (
      <Card className="w-full h-full flex items-center justify-center min-h-[500px]">
        <div className="text-red-500">Failed to load market cap data</div>
      </Card>
    )
  }

  const chartData = Object.entries(tokensData.data).map(([symbol, data]) => ({
    symbol: data.symbol || symbol,
    marketCap: data.marketCap,
  }))
  const series = chartData.map((item) => item.marketCap)
  const totalMarketCap = chartData.reduce(
    (acc, item) => acc + item.marketCap,
    0
  )

  const options: ApexOptions = {
    colors: COLORS,
    chart: {
      type: 'pie' as const,
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 350 },
      },
    },
    labels: chartData.map((item) => item.symbol),
    tooltip: {
      y: {
        formatter: (value: number) => formatCurrency(value),
      },
    },
    legend: {
      position: 'bottom',
      fontSize: '14px',
      fontWeight: 'bold',
      labels: {
        colors: '#999',
      },
      itemMargin: {
        horizontal: 16,
        vertical: 8,
      },
    },

    plotOptions: {
      pie: {
        expandOnClick: true,
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontWeight: 'bold',
              offsetY: 0,
            },
            value: {
              show: true,
              formatter: (val: string) => formatCurrency(Number(val)),
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  }

  return (
    <Card className="w-full h-full p-4 mt-4 min-h-[500px]">
      <div className="space-y-2 mb-4">
        <div className="text-lg font-medium">Market Cap Distribution</div>
        <div className="text-sm text-gray-500">
          Total Market Cap: {formatCurrency(totalMarketCap)}
        </div>
      </div>

      <div className="w-full h-[400px]">
        <Chart
          options={options}
          series={series}
          type="pie"
          height="100%"
          width="100%"
        />
      </div>
    </Card>
  )
}
