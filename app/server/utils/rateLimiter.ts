import { createError } from 'h3'

const requests = new Map<string, number[]>()

interface RateLimitConfig {
  limit: number
  windowMs: number
  errorMessage: string
}

export function assertRateLimit(key: string, { limit, windowMs, errorMessage }: RateLimitConfig) {
  const now = Date.now()
  const existing = requests.get(key) ?? []
  const recent = existing.filter((timestamp) => now - timestamp < windowMs)
  recent.push(now)
  requests.set(key, recent)

  if (recent.length > limit) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      message: errorMessage,
      data: { code: 'rate_limit_exceeded', retryAfter: Math.ceil(windowMs / 1000) }
    })
  }
}

export function resetRateLimit(key: string) {
  requests.delete(key)
}
