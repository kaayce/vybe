import { fetchTrackedWalletsBalance } from '@/api/walletBalance'
import { renderWithClient } from '@/test/test-utils'
import { screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { WalletBalancesChart } from '../WalletBalancesChart'

vi.mock('react-apexcharts', () => ({
  default: () => <div data-testid="mock-chart">Mock Chart</div>,
}))

vi.mock('@/api/walletBalance', () => ({
  fetchTrackedWalletsBalance: vi.fn(),
}))

const mockWalletData = {
  data: [
    {
      address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
      balance: 6937137.447298513,
    },
    {
      address: 'AC5RDfQFmDS1deWZos921JfqscXdByf8BKHs5ACWjtW2',
      balance: 694340.556264929,
    },
    {
      address: '59L2oxymiQQ9Hvhh92nt8Y7nDYjsauFkdb3SybdnsG6h',
      balance: 137.331163717,
    },
  ],
}

describe('WalletBalancesChart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('renders loading state', () => {
    vi.mocked(fetchTrackedWalletsBalance).mockReturnValueOnce(
      new Promise(() => {})
    )
    renderWithClient(<WalletBalancesChart />)
    expect(screen.getByText(/loading wallet balances/i)).toBeInTheDocument()
  })

  it('renders error state', async () => {
    vi.mocked(fetchTrackedWalletsBalance).mockRejectedValueOnce(
      new Error('API error')
    )
    renderWithClient(<WalletBalancesChart />)
    await waitFor(() => {
      expect(
        screen.getByText(/failed to load wallet balances/i)
      ).toBeInTheDocument()
    })
  })

  it('renders chart with wallet balances and total', async () => {
    vi.mocked(fetchTrackedWalletsBalance).mockResolvedValueOnce(mockWalletData)
    renderWithClient(<WalletBalancesChart />)

    await waitFor(() => {
      expect(screen.getByTestId('mock-chart')).toBeInTheDocument()
    })

    expect(screen.getByText('Top Wallet Balances')).toBeInTheDocument()

    const totalBalance = Math.round(
      mockWalletData.data.reduce((acc, wallet) => acc + wallet.balance, 0)
    )
    expect(
      screen.getByText(`Total Balance: ${totalBalance.toLocaleString()} SOL`)
    ).toBeInTheDocument()
  })

  it('handles empty data gracefully', async () => {
    vi.mocked(fetchTrackedWalletsBalance).mockResolvedValueOnce({ data: [] })
    renderWithClient(<WalletBalancesChart />)

    await waitFor(() => {
      expect(screen.getByTestId('mock-chart')).toBeInTheDocument()
    })
    expect(screen.getByText('Total Balance: 0 SOL')).toBeInTheDocument()
  })
})
