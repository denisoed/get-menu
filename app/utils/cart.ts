import type { CartEntry, GroupedCartItem } from '~/types/cart'

export function groupCartItems (cart: CartEntry[]): GroupedCartItem[] {
  const groups = new Map<string, { item: CartEntry; quantity: number }>()

  cart.forEach((item) => {
    const key = item.cartKey || item.id
    const group = groups.get(key)

    if (group) {
      group.quantity += 1
      return
    }

    groups.set(key, { item, quantity: 1 })
  })

  return Array.from(groups.entries()).map(([key, value]) => ({
    key,
    item: value.item,
    quantity: value.quantity,
    lineTotal: value.item.price * value.quantity,
  }))
}

export function calculateCartTotals (
  grouped: GroupedCartItem[],
  deliveryFee: number,
) {
  const subtotal = grouped.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0)
  const delivery = grouped.length ? deliveryFee : 0
  const total = subtotal + delivery

  return {
    subtotal,
    delivery,
    total,
  }
}

export function cartEntryDescription (entry: GroupedCartItem) {
  const details = [] as string[]
  if (entry.item.sizeLabel) details.push(entry.item.sizeLabel)
  if (entry.item.extrasLabels?.length) details.push(entry.item.extrasLabels.join(', '))
  return details.join(', ')
}

export function buildCartLines (
  grouped: GroupedCartItem[],
  fmt: (value: number) => string,
  totals: { delivery: number; total: number },
) {
  const lines = grouped.map((entry) => {
    const details = cartEntryDescription(entry)
    const title = details ? `${entry.item.name} (${details})` : entry.item.name
    const sum = fmt(entry.lineTotal)
    return `• ${title} — ${entry.quantity} шт. = ${sum}`
  })

  if (totals.delivery) {
    lines.push(`Доставка: ${fmt(totals.delivery)}`)
  }
  lines.push(`Итого: ${fmt(totals.total)}`)

  return lines
}

interface OrderMessageOptions {
  customer?: {
    name?: string
    phone?: string
    type?: string
    address?: string
    time?: string
    comment?: string
  }
}

export function composeOrderMessage (
  cafeName: string,
  lines: string[],
  options: OrderMessageOptions = {},
) {
  const header = `Заказ из ${cafeName}`
  const { customer } = options
  let customerInfo = ''

  if (customer) {
    const parts = [
      customer.name ? `Имя: ${customer.name}` : '',
      customer.phone ? `Телефон: ${customer.phone}` : '',
      customer.type ? `Тип: ${customer.type}` : '',
      customer.type === 'delivery' && customer.address ? `Адрес: ${customer.address}` : '',
      customer.time ? `Время: ${customer.time}` : '',
      customer.comment ? `Комментарий: ${customer.comment}` : '',
    ].filter(Boolean)

    if (parts.length) {
      customerInfo = `\n${parts.join('\n')}`
    }
  }

  return `${header}\n${lines.join('\n')}${customerInfo}`
}
