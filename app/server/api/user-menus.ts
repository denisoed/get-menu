import { listUserMenus } from '~/server/data/menuStore'

export default defineEventHandler(() => {
  const menus = listUserMenus()

  console.info('[menu-store] user menus requested', {
    count: menus.length,
  })

  return menus
})
