// Utility functions
import { getSettings, getMenu, getOrders, getCart, getAnalytics, saveAnalytics } from './storage.js';

export function formatPrice(value) {
  return `${getSettings().currency}${value.toFixed(2)}`;
}

export function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return String(text || '').replace(/[&<>"']/g, char => map[char]);
}

export function toTitleCase(text) {
  return String(text || '').replace(/\b\w/g, char => char.toUpperCase());
}

export function getCartSummary() {
  const cart = getCart();
  const menu = getMenu();
  const subtotal = cart.reduce((sum, item) => {
    const menuItem = menu.find(m => m.id === item.id);
    const actualPrice = menuItem ? menuItem.price : item.price;
    return sum + actualPrice * item.quantity;
  }, 0);
  const delivery = getSettings().deliveryFee;
  return { subtotal, delivery, total: subtotal + delivery };
}

export function generateOrderId() {
  const orders = getOrders();
  const next = String(orders.length + 1).padStart(5, '0');
  return `WC-2026-${next}`;
}

export function createTrackingToken() {
  return `TRK${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

export function searchMenu(query, category) {
  const queryLower = query.trim().toLowerCase();
  return getMenu().filter(item => {
    const matchesText =
      item.name.toLowerCase().includes(queryLower) ||
      item.description.toLowerCase().includes(queryLower);
    const matchesCategory = category === 'all' || item.category === category;
    return matchesText && matchesCategory;
  });
}

export function getFeaturedItems() {
  const all = getMenu();
  return all.filter(item => item.favorite).slice(0, 4);
}

export function getBestSellers() {
  const items = getMenu();
  return items.slice(0, 3);
}

export function generateWhatsAppLink(order) {
  const settings = getSettings();
  const lines = [
    `Hello ${settings.businessName}!`,
    '',
    'PESANAN BARU DITERIMA',
    '',
    `ID Pesanan: ${order.id}`,
    `Pelanggan: ${order.customer.name}`,
    `No. Telefon: ${order.customer.phone}`,
    `Alamat Penghantaran: ${order.customer.address}`,
    '',
    'BUTIRAN PESANAN:'
  ];

  order.items.forEach(item => {
    lines.push(`${item.quantity}x ${item.name}`);
  });

  lines.push(
    '',
    `Subtotal: ${settings.currency}${order.subtotal.toFixed(2)}`,
    `Caj Penghantaran: ${settings.currency}${order.delivery.toFixed(2)}`,
    `JUMLAH: ${settings.currency}${order.total.toFixed(2)}`,
    '',
    `Nota: ${order.customer.notes || 'Tiada'}`,
    '',
    'Kaedah Pembayaran: Tunai Semasa Terima (COD)',
    '',
    'Terima kasih.'
  );

  const encoded = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${encoded}`;
}

export function updateAnalyticsForOrder(order) {
  const analytics = getAnalytics();
  analytics.dailySales = (analytics.dailySales || 0) + order.total;
  analytics.orders = (analytics.orders || 0) + 1;
  analytics.repeatCustomer = Math.min(
    analytics.orders,
    analytics.repeatCustomer + (Math.random() > 0.6 ? 1 : 0)
  );

  const counts = {};
  getOrders()
    .concat(order)
    .forEach(o =>
      o.items.forEach(i => {
        counts[i.id] = (counts[i.id] || 0) + i.quantity;
      })
    );

  const bestItem = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  analytics.bestSeller = bestItem
    ? getMenu().find(i => i.id === bestItem[0])?.name || ''
    : analytics.bestSeller;

  saveAnalytics(analytics);
}
