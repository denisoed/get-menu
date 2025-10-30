import type { CartEntry } from '~/types/cart'

interface IState {
  cart: CartEntry[]
}

export const useCartStore = defineStore('cartStore', {
  state: (): IState => ({
    cart: [],
  }),
  actions: {
    addToCart (item: CartEntry, quantity = 1) {
      const safeQuantity = Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1
      const clones = Array.from({ length: safeQuantity }, () => ({
        ...item,
        extrasLabels: item.extrasLabels ? [...item.extrasLabels] : undefined,
      }))
      this.cart = [...this.cart, ...clones]
    },
  },
})
