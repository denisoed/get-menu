import { describe, expect, it, beforeEach } from 'vitest'

import { MENU_DETAILS } from '~/server/data/admin-menu-details'
import { buildQuickEditDiff, applyQuickEditChanges } from '~/server/utils/menuQuickEdit'

const MENU_ID = 'main-menu'
const DISH_ID = 'dish-1'

describe('menu quick edit utils', () => {
  beforeEach(() => {
    const burger = MENU_DETAILS[MENU_ID].items.find((item) => item.id === DISH_ID)
    if (burger) {
      burger.price = 290
      burger.tagIds = ['tag-hit']
      burger.tags = ['Хит']
      burger.description = 'Сочное мясо, маринованные огурцы и фирменный соус.'
    }
  })

  it('extracts price and tags from free-text instructions', () => {
    const diff = buildQuickEditDiff(
      MENU_ID,
      'Для блюда Бургер «Классик» подними цену до 350 и добавь тег хит продаж'
    )

    const burgerDiff = diff.items.find((item) => item.itemId === DISH_ID)
    expect(burgerDiff).toBeDefined()
    expect(burgerDiff?.canApply).toBe(true)
    expect(burgerDiff?.changes.some((change) => change.field === 'price' && change.nextValue === 350)).toBe(true)
    expect(burgerDiff?.changes.some((change) => change.field === 'tags' && change.nextValue === 'хит продаж')).toBe(true)
  })

  it('applies diff payload to menu data', () => {
    const response = applyQuickEditChanges(MENU_ID, 'req-test', 'audit-test', [
      {
        itemId: DISH_ID,
        changes: [
          { field: 'price', value: 315 },
          { field: 'tags', value: 'Хит, Новинка' },
          { field: 'description', value: 'Обновлённый бургер с фирменным соусом.' }
        ]
      }
    ])

    expect(response.appliedCount).toBe(1)
    expect(response.updatedItems[0]?.price).toBe(315)
    expect(response.updatedItems[0]?.tagIds).toHaveLength(2)
    expect(response.updatedItems[0]?.tags).toEqual(['Хит', 'Новинка'])

    const burger = MENU_DETAILS[MENU_ID].items.find((item) => item.id === DISH_ID)
    expect(burger?.price).toBe(315)
    expect(burger?.tagIds).toHaveLength(2)
    expect(burger?.tags).toEqual(['Хит', 'Новинка'])
    expect(burger?.description).toBe('Обновлённый бургер с фирменным соусом.')
  })
})
