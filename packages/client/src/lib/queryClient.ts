import { QueryCache, QueryClient } from '@tanstack/react-query'

export const createQueryClient = () =>
  new QueryClient({
    queryCache: new QueryCache({
      onError: () => console.error('Something went wrong'),
    }),
    defaultOptions: {
      queries: {
        placeholderData: (prev: unknown) => prev,
        notifyOnChangeProps: ['data', 'error'],
        retry: (failureCount, error: Error) => {
          if (
            error.message.includes('401') ||
            error.message.includes('Unauthorized')
          ) {
            return false
          }

          return failureCount < 3
        },
      },
    },
  })

export const queryClient = createQueryClient()
