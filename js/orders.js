// Orders management module
import {
  getCart,
  saveCart,
  getOrders,
  saveOrders,
  getMenu,
  saveAnalytics,
  getAnalytics
} from './storage.js';
import {
  generateOrderId,
  createTrackingToken,
  getCartSummary,
  updateAnalyticsForOrder
} from './utils.js';
import { STORAGE_LIMITS } from './constants.js';
import { state } from './state.js';

export function createOrder(callbacks) {
  const cart = getCart();
  if (!cart.length) return null;

  const draft = state.checkoutDraft;
  if (!draft.name || !draft.phone || !draft.address) {
    callbacks?.notify?.('Sila lengkapkan semua maklumat checkout.');
    return null;
  }

  const summary = getCartSummary();
  const order = {
    id: generateOrderId(),
    tracking: createTrackingToken(),
    createdAt: new Date().toISOString(),
    status: 'Pending',
    customer: {
      name: draft.name.trim(),
      phone: draft.phone.trim(),
      address: draft.address.trim(),
      notes: draft.notes.trim()
    },
    items: cart.map(item => {
      const menuItem = getMenu().find(m => m.id === item.id);
      return {
        id: item.id,
        name: menuItem ? menuItem.name : item.name,
        quantity: item.quantity,
        price: menuItem ? menuItem.price : item.price
      };
    }),
    subtotal: summary.subtotal,
    delivery: summary.delivery,
    total: summary.total,
    history: [{ status: 'Pending', timestamp: new Date().toISOString() }],
    shareHash: `track=${encodeURIComponent(generateOrderId())}`
  };

  const orders = getOrders();
  orders.unshift(order);

  // Pastikan storan tidak melampaui batas (elak QuotaExceededError)
  if (orders.length > STORAGE_LIMITS.maxOrdersStored) {
    orders.length = STORAGE_LIMITS.maxOrdersStored;
  }

  saveOrders(orders);
  updateAnalyticsForOrder(order);
  saveCart([]);

  state.orderPreview = order;
  callbacks?.notify?.('Order created! WhatsApp checkout ready.');

  return order;
}

export function getOrderById(orderId) {
  const orders = getOrders();
  return orders.find(o => o.id === orderId);
}

export function updateOrderStatus(orderId, newStatus, callbacks) {
  const orders = getOrders();
  const updatedOrders = orders.map(order =>
    order.id === orderId
      ? {
          ...order,
          status: newStatus,
          history: [
            ...order.history,
            { status: newStatus, timestamp: new Date().toISOString() }
          ]
        }
      : order
  );

  saveOrders(updatedOrders);
  callbacks?.notify?.(`Order ${newStatus}`);
  callbacks?.render?.();
}

export function getOrdersByStatus(status) {
  return getOrders().filter(order => order.status === status);
}

export function getLatestOrders(limit = 7) {
  return getOrders().slice(0, limit);
}
