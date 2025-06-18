import { LoadingCard } from '@/components/LoadingCard'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  type RenderOptions,
  type RenderResult,
  render,
} from '@testing-library/react'
import { type PropsWithChildren, type ReactElement, Suspense } from 'react'

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

type WrapperProps = PropsWithChildren<unknown>

function Wrapper({ children }: WrapperProps) {
  const testQueryClient = createTestQueryClient()
  return (
    <QueryClientProvider client={testQueryClient}>
      {/* TODO: make message a prop */}
      <Suspense fallback={<LoadingCard skeletonCount={1} message="Loading" />}>
        {children}
      </Suspense>
    </QueryClientProvider>
  )
}

export function renderWithClient(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  return render(ui, {
    wrapper: Wrapper,
    ...options,
  })
}
