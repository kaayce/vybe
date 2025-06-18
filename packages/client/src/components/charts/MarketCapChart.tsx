import { fetchBullishTokens } from '@/api/token'
import type { TokensDataResponse } from '@/api/token.types'
import { formatCurrency } from '@/lib/utils'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { ApexOptions } from 'apexcharts'
import { Suspense, useMemo } from 'react'
import Chart from 'react-apexcharts'
import { LoadingCard } from '../LoadingCard'
import { Card } from '../ui/card'

const COLORS = ['#6366f1', '#f59e42', '#10b981', '#f43f5e', '#fbbf24']
export const MarketCapChart = () => {
  const { data: tokensData } = useSuspenseQuery<TokensDataResponse>({
    queryKey: ['bullish-tokens'],
    queryFn: () => fetchBullishTokens(),
    refetchInterval: 300000, // Refetch every 5 minutes
  })

  const chartData = useMemo(
    () =>
      Object.entries(tokensData.data).map(([symbol, data]) => ({
        symbol: data.symbol || symbol,
        marketCap: data.marketCap,
      })),
    [tokensData.data]
  )

  const series = useMemo(
    () => chartData.map((item) => item.marketCap),
    [chartData]
  )

  const totalMarketCap = useMemo(
    () => chartData.reduce((acc, item) => acc + item.marketCap, 0),
    [chartData]
  )

  const options: ApexOptions = useMemo(
    () => ({
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
    }),
    [chartData]
  )

  return (
    <Suspense
      fallback={
        <LoadingCard skeletonCount={1} message="Loading market cap data..." />
      }
    >
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
    </Suspense>
  )
}
