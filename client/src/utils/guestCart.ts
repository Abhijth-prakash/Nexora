export type GuestCartItem = {
  itemId: string
  productId: string
  variantId: string | null
  size: string | null
  quantity: number
  name: string
  image: string
  price: number
  brand?: string
  stock: number
}

// 1. Read the cart from localStorage
export const getGuestCart = (): GuestCartItem[] => {
  const data = localStorage.getItem('guest_cart')
  return data ? JSON.parse(data) : []
}

// 2. Save the cart to localStorage
const saveGuestCart = (items: GuestCartItem[]) => {
  localStorage.setItem('guest_cart', JSON.stringify(items))
}

// 3. Add an item
export const addToGuestCart = (newItem: Omit<GuestCartItem, 'itemId'>) => {
  const items = getGuestCart()

  // is this same product + variant + size already in the cart?
  const found = items.find(
    i =>
      i.productId === newItem.productId &&
      i.variantId === newItem.variantId &&
      i.size === newItem.size
  )

  if (found) {
    found.quantity = Math.min(found.quantity + newItem.quantity, found.stock)
  } else {
    items.push({ ...newItem, itemId: String(Date.now()) })
  }

  saveGuestCart(items)
  return items
}

// 4. Remove one item
export const removeFromGuestCart = (itemId: string) => {
  const items = getGuestCart().filter(i => i.itemId !== itemId)
  saveGuestCart(items)
  return items
}

// 5. Empty the cart (used after login)
export const clearGuestCart = () => {
  localStorage.removeItem('guest_cart')
}

export const updateGuestQuantity = (itemId: string, quantity: number) => {
  const items = getGuestCart().map(i =>
    i.itemId === itemId
      ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
      : i
  )
  saveGuestCart(items)
  return items
}