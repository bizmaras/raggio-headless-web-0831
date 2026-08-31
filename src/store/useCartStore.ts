import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  isCartOpen: boolean;
  addToCart: (item: { name: string; price: number }) => void;
  removeFromCart: (name: string) => void;
  updateQuantity: (name: string, delta: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      isCartOpen: false,
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find((i) => i.name === item.name);
          if (existingItem) {
            return {
              cart: state.cart.map((i) =>
                i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
              ),
              isCartOpen: true,
            };
          }
          return { cart: [...state.cart, { ...item, quantity: 1 }], isCartOpen: true };
        }),
      removeFromCart: (name) =>
        set((state) => ({
          cart: state.cart.filter((i) => i.name !== name),
        })),
      updateQuantity: (name, delta) =>
        set((state) => ({
          cart: state.cart
            .map((i) => (i.name === name ? { ...i, quantity: i.quantity + delta } : i))
            .filter((i) => i.quantity > 0),
        })),
      clearCart: () => set({ cart: [] }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      closeCart: () => set({ isCartOpen: false }),
    }),
    {
      name: 'raggio-cart-storage', // localStorage'da bu isimle kaydedilecek
      partialize: (state) => ({ cart: state.cart }), // Sadece sepet içindekileri kaydet, çekmecenin açık/kapalı durumunu kaydetme
    }
  )
);