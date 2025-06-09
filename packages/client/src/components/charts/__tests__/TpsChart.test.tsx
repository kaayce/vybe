import { fetchTPS } from '@/api/metrics'
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
import { TpsChart } from '../TpsChart'

vi.mock('react-apexcharts', () => ({
  default: () => <div data-testid="mock-chart">Mock Chart</div>,
}))

vi.mock('@/api/metrics', () => ({
  fetchTPS: vi.fn(),
}))

const mockTpsData = {
  data: [
    {
      timestamp: 1749429837492,
      tps: 3975.733333333333,
      blockTime: 60,
      txCount: 238544,
    },
    {
      timestamp: 1749429897492,
      tps: 3819.733333333333,
      blockTime: 60,
      txCount: 229184,
    },
    {
      timestamp: 1749429957492,
      tps: 3838.15,
      blockTime: 60,
      txCount: 230289,
    },
  ],
}

describe('TpsChart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('renders loading state', () => {
    vi.mocked(fetchTPS).mockReturnValueOnce(new Promise(() => {}))
    renderWithClient(<TpsChart />)
    expect(screen.getByText(/loading tps data/i)).toBeInTheDocument()
  })

  it('renders error state', async () => {
    vi.mocked(fetchTPS).mockRejectedValueOnce(new Error('API error'))
    renderWithClient(<TpsChart />)
    await waitFor(() => {
      expect(screen.getByText(/failed to load tps data/i)).toBeInTheDocument()
    })
  })

  it('renders chart with TPS data and average', async () => {
    vi.mocked(fetchTPS).mockResolvedValueOnce(mockTpsData)
    renderWithClient(<TpsChart />)

    await waitFor(() => {
      expect(screen.getByTestId('mock-chart')).toBeInTheDocument()
    })

    expect(screen.getByText('Solana TPS Over Time')).toBeInTheDocument()

    const avgTPS = Math.round(
      mockTpsData.data.reduce((acc, point) => acc + point.tps, 0) /
        mockTpsData.data.length
    )
    expect(
      screen.getByText(`Average TPS: ${avgTPS.toLocaleString()}`)
    ).toBeInTheDocument()
  })

  it('handles empty or malformed data gracefully', async () => {
    const fetchTPSMock = fetchTPS as Mock
    fetchTPSMock.mockResolvedValueOnce({ data: null })
    renderWithClient(<TpsChart />)
    await waitFor(() => {
      expect(screen.getByText(/failed to load tps data/i)).toBeInTheDocument()
    })
  })
})
