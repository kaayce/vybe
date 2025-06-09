import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  type RenderOptions,
  type RenderResult,
  render,
} from '@testing-library/react'
import type { PropsWithChildren, ReactElement } from 'react'

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
      {children}
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
