// Cart operations module
import { getCart, saveCart, getMenu } from './storage.js';
import { state } from './state.js';

export function addToCart(itemId, quantity = 1, notes = '', callbacks) {
  const menu = getMenu();
  const item = menu.find(i => i.id === itemId);

  if (!item || !item.stock) {
    callbacks?.notify?.('Item tidak tersedia');
    return;
  }

  const cart = getCart();
  const existing = cart.find(i => i.id === itemId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: item.id, name: item.name, price: item.price, quantity, notes });
  }

  saveCart(cart);
  callbacks?.notify?.(`${item.name} ditambah ke troli`);
  callbacks?.triggerCartPulse?.();
  callbacks?.render?.();
}

export function updateCartItem(itemId, quantity) {
  const cart = getCart()
    .map(item =>
      item.id === itemId
        ? { ...item, quantity: Math.max(1, quantity) }
        : item
    )
    .filter(item => item.quantity > 0);

  saveCart(cart);
}

export function removeCartItem(itemId, callbacks) {
  const cart = getCart().filter(item => item.id !== itemId);
  saveCart(cart);
  callbacks?.notify?.('Item removed from cart');
  callbacks?.render?.();
}

export function clearCart() {
  saveCart([]);
}

export function getCartItemCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}
