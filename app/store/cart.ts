import type { MenuItem } from '~/types/menu'

interface IState {
  cart: MenuItem[]
}

export const useCartStore = defineStore('cartStore', {
  state: (): IState => ({
    cart: [],
  }),
  actions: {
    addToCart (item: MenuItem) {
      this.cart = [...this.cart, item]
    },
  },
})
