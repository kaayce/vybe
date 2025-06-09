import { fetchTrackedWalletsBalance } from '@/api/walletBalance'
import { useQuery } from '@tanstack/react-query'
import type { ApexOptions } from 'apexcharts'
import Chart from 'react-apexcharts'
import { Card } from '../ui/card'

interface WalletBalanceResponse {
  data: {
    address: string
    balance: number
  }[]
}

export const WalletBalancesChart = () => {
  const { data, isLoading, error } = useQuery<WalletBalanceResponse>({
    queryKey: ['wallet-balances'],
    queryFn: fetchTrackedWalletsBalance,
    refetchInterval: 300000, // Refresh every 5 minutes
  })

  if (isLoading) {
    return (
      <Card className="w-full h-full flex items-center justify-center min-h-[500px]">
        <div className="text-gray-500">Loading wallet balances...</div>
      </Card>
    )
  }

  if (error || !data?.data) {
    return (
      <Card className="w-full h-full flex items-center justify-center min-h-[500px]">
        <div className="text-red-500">Failed to load wallet balances</div>
      </Card>
    )
  }

  const series = [
    {
      name: 'SOL Balance',
      data: data.data.map((wallet) => ({
        x: `${wallet.address.slice(0, 4)}...${wallet.address.slice(-4)}`,
        y: Math.round(wallet.balance * 100) / 100,
      })),
    },
  ]

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 400,
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 350 },
      },
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: '70%',
        dataLabels: {
          position: 'center',
          orientation: 'vertical',
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (value) => `${value.toLocaleString()} SOL`,
      style: {
        fontSize: '8px',
        colors: ['#000000'],
      },
      offsetY: 20,
    },
    xaxis: {
      type: 'category',
      labels: {
        style: {
          fontSize: '12px',
        },
        rotate: -45,
        offsetY: 10,
      },
      title: {
        text: 'Wallet Address',
        style: {
          fontSize: '12px',
        },
        offsetY: -20,
      },
    },
    yaxis: {
      title: {
        text: 'Balance (SOL)',
        style: {
          fontSize: '12px',
        },
        offsetX: -5,
      },
      labels: {
        formatter: (value) => value.toLocaleString(),
      },
    },
    colors: ['#6366f1'],
    tooltip: {
      y: {
        formatter: (value) => `${value.toLocaleString()} SOL`,
      },
    },
  }

  const totalBalance = data.data.reduce(
    (acc, wallet) => acc + wallet.balance,
    0
  )

  return (
    <Card className="w-full h-full p-4 mt-4 min-h-[500px]">
      <div className="space-y-2 mb-4">
        <div className="text-lg font-medium">Top Wallet Balances</div>
        <div className="text-sm text-gray-500">
          Total Balance: {Math.round(totalBalance).toLocaleString()} SOL
        </div>
      </div>
      <div className="w-full h-[400px]">
        <Chart
          options={options}
          series={series}
          type="bar"
          height="100%"
          width="100%"
        />
      </div>
    </Card>
  )
}
