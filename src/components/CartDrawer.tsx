'use client';

import { useEffect } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, clearCart } = useCartStore();

  useEffect(() => {
    if (!isCartOpen) return;

    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={closeCart}
        aria-hidden="true"
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity cursor-pointer"
      />

      <div
        className="fixed inset-y-0 right-0 max-w-full flex pl-10"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <div className="w-screen max-w-md bg-[#13161A] border-l border-[#8D744E]/30 text-white flex flex-col justify-between shadow-2xl">

          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#8D744E]" aria-hidden="true" />
              <h3 id="cart-drawer-title" className="text-xl font-bold">Your Order</h3>
            </div>
            <button
              onClick={closeCart}
              aria-label="Close cart"
              className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" aria-hidden="true" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.name}
                  className="bg-black/50 border border-gray-800 p-4 rounded-xl flex items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{item.name}</h4>
                    <span className="text-[#8D744E] text-sm font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 bg-black border border-gray-800 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.name, -1)}
                      aria-label={`Decrease quantity of ${item.name}`}
                      disabled={item.quantity <= 1}
                      className="p-1 hover:text-[#8D744E] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <span className="text-xs font-bold px-1" aria-live="polite">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.name, 1)}
                      aria-label={`Increase quantity of ${item.name}`}
                      className="p-1 hover:text-[#8D744E] transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.name)}
                    aria-label={`Remove ${item.name} from cart`}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-800 space-y-4 bg-black/40">
              <div className="flex justify-between text-lg font-bold">
                <span>Subtotal</span>
                <span className="text-[#8D744E]">${totalPrice.toFixed(2)}</span>
              </div>

              <div className="space-y-3">
                <a
                  href="https://phillystyleexpress.foodtecsolutions.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeCart}
                  className="block w-full py-3 bg-[#8D744E] hover:bg-[#735E3F] text-black font-extrabold rounded-xl transition-all cursor-pointer text-center"
                >
                  Checkout (Standard Menu)
                </a>

                <a
                  href="https://order.foodtecsolutions.com/ordering/phillystyleexpress/menu/Catering"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeCart}
                  className="block w-full py-3 border border-[#8D744E] text-[#8D744E] hover:bg-[#8D744E] hover:text-black font-extrabold rounded-xl transition-all cursor-pointer text-center"
                >
                  Checkout (Catering)
                </a>
              </div>

              <button
                onClick={clearCart}
                className="w-full text-xs text-gray-500 hover:text-gray-300 transition-colors py-1 cursor-pointer mt-1"
              >
                Clear Cart
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}