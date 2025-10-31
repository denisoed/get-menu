import { describe, expect, it } from 'vitest'

import {
  assertSubdomainAvailable,
  createAdminMenu,
  getAdminMenu,
  isSubdomainReserved,
  listReservedSubdomains,
  updateAdminMenu
} from '~/server/services/adminMenus'

describe('adminMenus service', () => {
  it('knows about seeded subdomains', () => {
    expect(isSubdomainReserved('main-menu')).toBe(true)
    expect(() => assertSubdomainAvailable('main-menu')).toThrowError(/Subdomain already exists/)
  })

  it('creates menus with normalized subdomains and registers them', () => {
    const menu = createAdminMenu({
      subdomain: 'fresh-menu',
      slug: 'fresh-menu',
      title: 'Новое меню',
      description: '',
      isPublished: false,
      cafe: {
        cafeName: 'Тестовое кафе',
        phone: '+996 555 000 111',
        whatsapp: '+996555000111',
        minOrder: 0,
        deliveryFee: 0,
        address: 'г. Бишкек, ул. Тестовая, 1',
        announcement: '',
        bannerImage: '',
        bannerTitle: '',
        bannerSubtitle: '',
        openHours: '',
        scheduleDetails: ''
      },
      items: []
    })

    expect(menu.subdomain).toBe('fresh-menu')
    expect(isSubdomainReserved('fresh-menu')).toBe(true)
    expect(listReservedSubdomains()).toContain('fresh-menu')
  })

  it('updates menu data and keeps subdomain reservation', () => {
    const menu = createAdminMenu({
      subdomain: 'update-check',
      slug: 'update-check',
      title: 'Меню для обновления',
      description: '',
      isPublished: false,
      cafe: {
        cafeName: 'Обновляемое кафе',
        phone: '+996 777 999 333',
        whatsapp: '+996777999333',
        minOrder: 0,
        deliveryFee: 0,
        address: 'г. Бишкек, ул. Короткая, 2',
        announcement: '',
        bannerImage: '',
        bannerTitle: '',
        bannerSubtitle: '',
        openHours: '',
        scheduleDetails: ''
      },
      items: []
    })

    const updated = updateAdminMenu(menu.id, {
      ...menu,
      isPublished: true,
      cafe: {
        ...menu.cafe,
        announcement: 'Мы обновились'
      }
    })

    expect(updated.isPublished).toBe(true)
    expect(updated.cafe.announcement).toBe('Мы обновились')
    expect(isSubdomainReserved('update-check')).toBe(true)
  })

  it('throws on subdomain conflict while updating', () => {
    const existing = listReservedSubdomains()[0]
    const menu = createAdminMenu({
      subdomain: 'reassign-test',
      slug: 'reassign-test',
      title: 'Проверка конфликта',
      description: '',
      isPublished: false,
      cafe: {
        cafeName: 'Конфликтное кафе',
        phone: '+996 500 123 321',
        whatsapp: '+996500123321',
        minOrder: 0,
        deliveryFee: 0,
        address: 'г. Бишкек, пр. Мира, 5',
        announcement: '',
        bannerImage: '',
        bannerTitle: '',
        bannerSubtitle: '',
        openHours: '',
        scheduleDetails: ''
      },
      items: []
    })

    expect(() => updateAdminMenu(menu.id, { ...menu, subdomain: existing })).toThrowError(/Subdomain already exists/)
  })

  it('returns stored menu by id', () => {
    const target = createAdminMenu({
      subdomain: 'lookup-test',
      slug: 'lookup-test',
      title: 'Меню поиска',
      description: 'Проверяем выборку',
      isPublished: true,
      cafe: {
        cafeName: 'Кафе поиска',
        phone: '+996 777 111 222',
        whatsapp: '+996777111222',
        minOrder: 0,
        deliveryFee: 0,
        address: 'г. Бишкек, ул. Найденная, 7',
        announcement: '',
        bannerImage: '',
        bannerTitle: '',
        bannerSubtitle: '',
        openHours: '',
        scheduleDetails: ''
      },
      items: []
    })

    const stored = getAdminMenu(target.id)

    expect(stored).not.toBeNull()
    expect(stored?.title).toBe('Меню поиска')
    expect(stored?.subdomain).toBe('lookup-test')
  })
})
