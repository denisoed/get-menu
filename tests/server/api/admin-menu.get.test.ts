import { describe, expect, it, beforeEach, afterEach, vi, type Mock } from 'vitest'
import type { H3Event } from 'h3'

import { handleAdminMenuRequest } from '~/server/api/admin/menu.get'
import type { MenuRecord } from '~/server/types/menu'

vi.mock('~/server/utils/supabaseClient', () => {
  const getSupabaseServiceClient = vi.fn()
  const clearSupabaseServiceClientCache = vi.fn()

  return {
    getSupabaseServiceClient,
    clearSupabaseServiceClientCache
  }
})

const supabaseModule = await import('~/server/utils/supabaseClient')
const mockedSupabaseFactory = supabaseModule.getSupabaseServiceClient as unknown as Mock
const mockedClearCache = supabaseModule.clearSupabaseServiceClientCache as unknown as Mock

describe('GET /api/admin/menu', () => {
  const mockEvent = {} as H3Event
  const sampleMenus: MenuRecord[] = [
    {
      id: '1',
      name: 'Летнее меню',
      slug: 'summer-menu',
      description: 'Меню с сезонными блюдами',
      is_active: true,
      position: 1
    }
  ]

  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
    mockedSupabaseFactory.mockReset()
    mockedClearCache.mockReset()
    vi.clearAllMocks()
  })

  it('returns active menus when Supabase responds successfully', async () => {
    const builderResult = { data: sampleMenus, error: null }

    const eqMock = vi.fn().mockReturnThis()
    const orderMock = vi.fn().mockImplementation(function (this: unknown) {
      return this
    })

    const builder = {
      eq: eqMock,
      order: orderMock,
      then: (onFulfilled: (value: typeof builderResult) => any, onRejected?: (reason: unknown) => any) =>
        Promise.resolve(builderResult).then(onFulfilled, onRejected)
    }

    const selectMock = vi.fn().mockReturnValue(builder)
    const fromMock = vi.fn().mockReturnValue({ select: selectMock })

    mockedSupabaseFactory.mockReturnValue({ from: fromMock })

    const response = await handleAdminMenuRequest(mockEvent)

    expect(fromMock).toHaveBeenCalledWith('menus')
    expect(selectMock).toHaveBeenCalledWith(
      'id, name, slug, description, is_active, position, valid_from, valid_to, created_at, updated_at'
    )
    expect(eqMock).toHaveBeenCalledWith('is_active', true)
    expect(orderMock).toHaveBeenNthCalledWith(1, 'position', { ascending: true, nullsLast: false })
    expect(orderMock).toHaveBeenNthCalledWith(2, 'created_at', { ascending: true })
    expect(response.menus).toEqual(sampleMenus)
    expect(response.error).toBeNull()
  })

  it('throws an HTTP error when Supabase returns an error', async () => {
    const builderResult = { data: null, error: { message: 'Boom', details: 'failure', hint: null } }

    const eqMock = vi.fn().mockReturnThis()
    const orderMock = vi.fn().mockImplementation(function (this: unknown) {
      return this
    })

    const builder = {
      eq: eqMock,
      order: orderMock,
      then: (onFulfilled: (value: typeof builderResult) => any, onRejected?: (reason: unknown) => any) =>
        Promise.resolve(builderResult).then(onFulfilled, onRejected)
    }

    const selectMock = vi.fn().mockReturnValue(builder)
    const fromMock = vi.fn().mockReturnValue({ select: selectMock })

    mockedSupabaseFactory.mockReturnValue({ from: fromMock })

    await expect(handleAdminMenuRequest(mockEvent)).rejects.toMatchObject({
      statusCode: 502,
      data: {
        menus: [],
        error: {
          message: expect.stringContaining('Failed to load menus')
        }
      }
    })

    expect(consoleErrorSpy).toHaveBeenCalled()
  })
})
