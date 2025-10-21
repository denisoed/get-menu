import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '~/server/services/categories'

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

describe('Supabase categories service', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.clearAllMocks()
    consoleErrorSpy.mockRestore()
  })

  it('fetches categories ordered by position and name', async () => {
    const sampleRows = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Бургеры',
        description: null,
        position: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z'
      }
    ]

    const builderResult = { data: sampleRows, error: null }
    const orderMock = vi.fn().mockImplementation(function (this: unknown) {
      return this
    })

    const selectBuilder = {
      order: orderMock,
      then: (onFulfilled: (value: typeof builderResult) => any, onRejected?: (reason: unknown) => any) =>
        Promise.resolve(builderResult).then(onFulfilled, onRejected)
    }

    const selectMock = vi.fn().mockReturnValue(selectBuilder)
    const fromMock = vi.fn().mockReturnValue({ select: selectMock })

    mockedSupabaseFactory.mockReturnValue({ from: fromMock })

    const categories = await fetchCategories()

    expect(fromMock).toHaveBeenCalledWith('categories')
    expect(selectMock).toHaveBeenCalledWith('id, name, description, position, created_at, updated_at')
    expect(orderMock).toHaveBeenNthCalledWith(1, 'position', { ascending: true, nullsLast: true })
    expect(orderMock).toHaveBeenNthCalledWith(2, 'name', { ascending: true })
    expect(categories).toEqual([
      {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Бургеры',
        description: null,
        position: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z'
      }
    ])
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  it('throws a parse error when Supabase returns unexpected payload', async () => {
    const invalidRows = [
      {
        id: '33333333-3333-3333-3333-333333333333',
        name: null,
        description: null,
        position: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z'
      }
    ]

    const builderResult = { data: invalidRows, error: null }
    const orderMock = vi.fn().mockImplementation(function (this: unknown) {
      return this
    })

    const selectBuilder = {
      order: orderMock,
      then: (onFulfilled: (value: typeof builderResult) => any, onRejected?: (reason: unknown) => any) =>
        Promise.resolve(builderResult).then(onFulfilled, onRejected)
    }

    const selectMock = vi.fn().mockReturnValue(selectBuilder)
    const fromMock = vi.fn().mockReturnValue({ select: selectMock })

    mockedSupabaseFactory.mockReturnValue({ from: fromMock })

    await expect(fetchCategories()).rejects.toMatchObject({
      statusCode: 500,
      data: { code: 'supabase_category_parse_failed' }
    })

    expect(consoleErrorSpy).toHaveBeenCalled()
  })

  it('creates a category and returns normalized data', async () => {
    const singleMock = vi.fn().mockResolvedValue({
      data: {
        id: '44444444-4444-4444-4444-444444444444',
        name: 'Напитки',
        description: null,
        position: 2,
        created_at: '2024-02-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z'
      },
      error: null
    })

    const selectMock = vi.fn().mockReturnValue({ single: singleMock })
    const insertMock = vi.fn().mockReturnValue({ select: selectMock })
    const fromMock = vi.fn().mockReturnValue({ insert: insertMock })

    mockedSupabaseFactory.mockReturnValue({ from: fromMock })

    const created = await createCategory({ name: 'Напитки' })

    expect(insertMock).toHaveBeenCalledWith({ name: 'Напитки', description: null, position: null })
    expect(selectMock).toHaveBeenCalledWith('id, name, description, position, created_at, updated_at')
    expect(created).toEqual({
      id: '44444444-4444-4444-4444-444444444444',
      name: 'Напитки',
      description: null,
      position: 2,
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-02-01T00:00:00Z'
    })
  })

  it('translates unique violation errors on create', async () => {
    const singleMock = vi.fn().mockResolvedValue({
      data: null,
      error: { code: '23505', message: 'duplicate', details: 'duplicate key value violates unique constraint', hint: null }
    })

    const selectMock = vi.fn().mockReturnValue({ single: singleMock })
    const insertMock = vi.fn().mockReturnValue({ select: selectMock })
    const fromMock = vi.fn().mockReturnValue({ insert: insertMock })

    mockedSupabaseFactory.mockReturnValue({ from: fromMock })

    await expect(createCategory({ name: 'Напитки' })).rejects.toMatchObject({
      statusCode: 409,
      data: { code: 'supabase_category_unique_violation' }
    })
  })

  it('throws a conflict error when update target has been modified', async () => {
    const maybeSingleMock = vi.fn().mockResolvedValue({ data: null, error: null })
    const selectMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock })
    const eqMock = vi.fn().mockImplementation(function (this: unknown) {
      return this
    })
    const updateBuilder = {
      eq: eqMock,
      select: selectMock
    }
    const updateMock = vi.fn().mockReturnValue(updateBuilder)
    const fromMock = vi.fn().mockReturnValue({ update: updateMock })

    mockedSupabaseFactory.mockReturnValue({ from: fromMock })

    await expect(updateCategory('55555555-5555-5555-5555-555555555555', { name: 'Новое имя', updatedAt: '2024-02-01T00:00:00Z' })).rejects.toMatchObject({
      statusCode: 409,
      data: { code: 'supabase_category_conflict' }
    })
  })

  it('maps foreign key errors on delete to conflict', async () => {
    const maybeSingleMock = vi.fn().mockResolvedValue({
      data: null,
      error: { code: '23503', message: 'fk violation', details: 'in use', hint: null }
    })

    const selectMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock })
    const eqMock = vi.fn().mockImplementation(function (this: unknown) {
      return this
    })
    const deleteBuilder = {
      eq: eqMock,
      select: selectMock
    }
    const deleteMock = vi.fn().mockReturnValue(deleteBuilder)
    const fromMock = vi.fn().mockReturnValue({ delete: deleteMock })

    mockedSupabaseFactory.mockReturnValue({ from: fromMock })

    await expect(deleteCategory('66666666-6666-6666-6666-666666666666')).rejects.toMatchObject({
      statusCode: 409,
      data: { code: 'supabase_category_in_use' }
    })
  })
})
