import { logger } from './logger.js'

interface RequestOptions extends RequestInit {
  timeout?: number
  retries?: number
}

const log = logger.child({ module: 'request' })

export const request = async <T>(
  input: RequestInfo | URL,
  init?: RequestOptions
): Promise<T> => {
  const options: RequestOptions = {
    timeout: 5000,
    retries: 2,
    ...init,
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate, br',
      ...init?.headers,
    },
  }

  let attempts = 0

  while (attempts < (options.retries ?? 2)) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), options.timeout)

      const res = await fetch(input, {
        ...options,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!res.ok) {
        const errorData = await res.json()
        log.error(
          {
            status: res.status,
            url: input.toString(),
            error: errorData,
          },
          'API request failed'
        )

        throw new Error(
          `API Error ${res.status}: ${errorData.message ?? 'Unknown error'}`
        )
      }

      const data = (await res.json()) as T
      return data
    } catch (error) {
      attempts++
      const isLastAttempt = attempts === options.retries

      log.warn(
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          attempt: attempts,
          url: input.toString(),
        },
        'API request failed, retrying...'
      )

      if (isLastAttempt) {
        throw error
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  throw new Error('Request failed after all retry attempts')
}
