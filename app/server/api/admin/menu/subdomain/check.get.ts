import { createError, defineEventHandler, getQuery } from 'h3'

import { isSubdomainReserved } from '~/server/services/adminMenus'

function normalize(value: string) {
  return value.trim().toLowerCase()
}

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const rawValue = query.value

  if (typeof rawValue !== 'string' || !rawValue.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Укажите сабдомен для проверки'
    })
  }

  const value = normalize(rawValue)

  const ignore = query.ignore
  const ignoreList = Array.isArray(ignore) ? ignore : ignore ? [ignore] : []

  const isReserved = isSubdomainReserved(value, { ignore: ignoreList })

  if (isReserved) {
    console.info('[api][menu] subdomain check: taken', { subdomain: value })
  }

  return {
    subdomain: value,
    isAvailable: !isReserved
  }
})
