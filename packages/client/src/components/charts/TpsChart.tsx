import { fetchTPS } from '@/api/metrics'
import type { TPSData } from '@/api/metrics.types'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { ApexOptions } from 'apexcharts'
import { Suspense, useMemo } from 'react'
import Chart from 'react-apexcharts'
import { LoadingCard } from '../LoadingCard'
import { Card } from '../ui/card'

export const TpsChart = () => {
  const { data } = useSuspenseQuery<TPSData>({
    queryKey: ['tps-data'],
    queryFn: fetchTPS,
    refetchInterval: 60000, // Refresh every minute
  })

  const series = useMemo(() => {
    return [
      {
        name: 'Transactions Per Second',
        data: data.data.map((point) => ({
          x: point.timestamp,
          y: Math.round(point.tps * 100) / 100,
        })),
      },
    ]
  }, [data])

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'area',

        animations: {
          enabled: true,
          speed: 800,
          animateGradually: { enabled: true, delay: 150 },
          dynamicAnimation: { enabled: true, speed: 350 },
        },
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [50, 100, 100],
        },
      },
      colors: ['#6366f1'],
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeUTC: true,
          format: 'HH:mm',
        },
        title: {
          text: 'Time',
          style: {
            fontSize: '12px',
          },
          offsetY: 5,
        },
      },
      yaxis: {
        title: {
          text: 'Transactions Per Second',
          style: {
            fontSize: '12px',
          },
        },
        labels: {
          formatter: (value) => Math.round(value).toString(),
        },
      },
      tooltip: {
        x: {
          format: 'HH:mm',
        },
        y: {
          formatter: (value) => `${value.toLocaleString()} TPS`,
        },
      },
      grid: {
        borderColor: '#e5e7eb',
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: true,
          },
        },
      },
    }),
    []
  )

  const avgTPS = Math.round(
    data.data.reduce((acc, point) => acc + point.tps, 0) / data.data.length
  )

  return (
    <Suspense
      fallback={<LoadingCard skeletonCount={1} message="Loading TPS data..." />}
    >
      <Card className="w-full h-full p-4 mt-4 min-h-[500px]">
        <div className="space-y-2 mb-4">
          <div className="text-lg font-medium">Solana TPS Over Time</div>
          <div className="text-sm text-gray-500">
            Average TPS: {avgTPS.toLocaleString()}
          </div>
        </div>
        <div className="w-full h-[400px]">
          <Chart
            options={options}
            series={series}
            type="area"
            height="100%"
            width="100%"
          />
        </div>
      </Card>
    </Suspense>
  )
}
