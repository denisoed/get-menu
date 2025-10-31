import { defineEventHandler } from 'h3'
import { MENU_DETAILS } from '~/server/data/admin-menu-details'

const RESERVED_SUBDOMAINS = new Set(
  Object.values(MENU_DETAILS).map((menu) => menu.subdomain.toLowerCase())
)

const SUBDOMAIN_PATTERN = /^[a-z0-9-]+$/

interface AvailabilityResponse {
  available: boolean
  message?: string
}

export default defineEventHandler((event): AvailabilityResponse => {
  const nameParam = event.context.params?.name
  const candidate = typeof nameParam === 'string' ? nameParam.toLowerCase() : ''

  if (!candidate) {
    return {
      available: false,
      message: 'Укажите имя сабдомена.',
    }
  }

  const validationError = validateSubdomain(candidate)
  if (validationError) {
    return {
      available: false,
      message: validationError,
    }
  }

  if (RESERVED_SUBDOMAINS.has(candidate)) {
    return {
      available: false,
      message: 'Этот адрес уже занят. Попробуйте другое имя.',
    }
  }

  return {
    available: true,
  }
})

function validateSubdomain (value: string): string | null {
  if (value.length < 3 || value.length > 30) {
    return 'Длина адреса — от 3 до 30 символов.'
  }

  if (!/^[a-z]/.test(value)) {
    return 'Адрес должен начинаться с латинской буквы.'
  }

  if (!SUBDOMAIN_PATTERN.test(value)) {
    return 'Используйте только латинские буквы, цифры и дефис.'
  }

  if (value.endsWith('-')) {
    return 'Адрес не может заканчиваться дефисом.'
  }

  return null
}
