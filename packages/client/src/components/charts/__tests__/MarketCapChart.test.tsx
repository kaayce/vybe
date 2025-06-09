import { fetchBullishTokens } from '@/api/token'
import { formatCurrency } from '@/lib/utils'
import { renderWithClient } from '@/test/test-utils'
import { screen, waitFor } from '@testing-library/react'
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { MarketCapChart } from '../MarketCapChart'

vi.mock('react-apexcharts', () => ({
  default: () => <div data-testid="mock-chart">Mock Chart</div>,
}))

vi.mock('@/api/token', () => ({
  fetchBullishTokens: vi.fn(),
}))

const mockTokensData = {
  data: {
    USDT: {
      address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
      price: 1,
      supply: 2389928498.867865,
      marketCap: 2389928498.867865,
      lastUpdated: 1749437342552,
    },
    USDC: {
      address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      price: 0.999798,
      supply: 8660974590.3005,
      marketCap: 8659225073.43326,
      lastUpdated: 1749437342552,
    },
  },
}
describe('MarketCapChart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('renders loading state', () => {
    vi.mocked(fetchBullishTokens).mockReturnValueOnce(new Promise(() => {}))
    renderWithClient(<MarketCapChart />)
    expect(screen.getByText(/loading market cap data/i)).toBeInTheDocument()
  })

  it('renders error state', async () => {
    vi.mocked(fetchBullishTokens).mockRejectedValueOnce(new Error('API error'))
    renderWithClient(<MarketCapChart />)
    await waitFor(() => {
      expect(
        screen.getByText(/failed to load market cap data/i)
      ).toBeInTheDocument()
    })
  })

  it('renders chart and total market cap', async () => {
    const fetchBullishTokensMock = fetchBullishTokens as Mock
    fetchBullishTokensMock.mockResolvedValueOnce(mockTokensData)
    renderWithClient(<MarketCapChart />)

    await waitFor(() => {
      expect(screen.getByTestId('mock-chart')).toBeInTheDocument()
    })

    const totalMarketCap = Object.values(mockTokensData.data).reduce(
      (acc, token) => acc + token.marketCap,
      0
    )

    await waitFor(() => {
      expect(
        screen.getByText((content) => {
          return (
            content.startsWith('Total Market Cap:') &&
            content.includes(formatCurrency(totalMarketCap))
          )
        })
      ).toBeInTheDocument()
    })
  })
})
