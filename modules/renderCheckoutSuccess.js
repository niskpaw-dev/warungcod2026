// Render functions for checkout, success, and tracking screens
import { state } from './state.js';
import { getSettings, getCart, getOrders } from './storage.js';
import { formatPrice, escapeHtml, generateWhatsAppLink } from './utils.js';
import { ORDER_STATUSES, ADMIN_ACTIONS } from './constants.js';

export function renderCheckout() {
  const cart = getCart();
  const summary = { subtotal: 0, delivery: 0, total: 0 };
  cart.forEach(item => (summary.subtotal += item.price * item.quantity));
  summary.delivery = getSettings().deliveryFee;
  summary.total = summary.subtotal + summary.delivery;

  return `
    <div class="page-shell p-5 pt-8">
      <div class="flex items-center justify-between gap-4 mb-6">
        <button data-action="back" class="icon-button">←</button>
        <div class="text-center flex-1">
          <p class="text-sm text-slate-400">Checkout</p>
          <h2 class="text-2xl font-semibold">Sahkan Pesanan</h2>
        </div>
        <div class="w-10"></div>
      </div>
      <div class="space-y-5">
        <div class="rounded-[32px] glass-border glass p-5 space-y-4">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-sm text-slate-400">Ringkasan Penghantaran</p>
              <p class="text-lg font-semibold">${getSettings().deliveryEta}</p>
            </div>
            <span class="status-pill bg-white/5 text-amber-200">COD</span>
          </div>
          <div class="grid gap-4">
            <input id="checkoutName" placeholder="Nama penuh" value="${escapeHtml(state.checkoutDraft.name)}" class="input-glow w-full rounded-3xl px-4 py-4 text-white placeholder:text-slate-500" />
            <input id="checkoutPhone" placeholder="No. telefon" value="${escapeHtml(state.checkoutDraft.phone)}" class="input-glow w-full rounded-3xl px-4 py-4 text-white placeholder:text-slate-500" />
            <textarea id="checkoutAddress" placeholder="Alamat penghantaran" class="input-glow w-full min-h-[120px] rounded-3xl px-4 py-4 text-white placeholder:text-slate-500 resize-none">${escapeHtml(state.checkoutDraft.address)}</textarea>
            <textarea id="checkoutNotes" placeholder="Arahan penghantaran / catatan" class="input-glow w-full min-h-[96px] rounded-3xl px-4 py-4 text-white placeholder:text-slate-500 resize-none">${escapeHtml(state.checkoutDraft.notes)}</textarea>
          </div>
        </div>
        <div class="rounded-[32px] glass-border glass p-5 space-y-4">
          <div class="flex items-center justify-between"><span class="text-slate-400">Subtotal</span><span>${formatPrice(summary.subtotal)}</span></div>
          <div class="flex items-center justify-between"><span class="text-slate-400">Delivery Fee</span><span>${formatPrice(summary.delivery)}</span></div>
          <div class="flex items-center justify-between text-lg font-semibold"><span>Total</span><span>${formatPrice(summary.total)}</span></div>
        </div>
        <button data-action="confirm-order" class="w-full rounded-3xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-4 text-sm font-semibold text-white shadow-xl shadow-orange-500/20">Hantar ke WhatsApp</button>
        <div class="rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-300">Pastikan semua maklumat lengkap. Anda akan dibawa ke WhatsApp untuk mengesahkan order.</div>
      </div>
    </div>
  `;
}

export function renderSuccess() {
  const order = state.orderPreview || getOrders()[0] || null;
  if (!order) {
    state.screen = 'home';
    return '';
  }

  return `
    <div class="page-shell p-5 pt-8">
      <div class="text-center space-y-5">
        <div class="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-rose-500 shadow-2xl shadow-orange-500/25">
          <span class="text-5xl">✓</span>
        </div>
        <h2 class="text-3xl font-semibold">Pesanan Terkini Disimpan</h2>
        <p class="text-slate-300">Order ID <span class="font-semibold text-white">${order.id}</span> telah disediakan. Sila terus ke WhatsApp untuk penghantaran.</p>
      </div>
      <div class="mt-8 rounded-[32px] glass-border glass p-5 space-y-4">
        <div class="flex items-center justify-between text-slate-400"><span>Status pesanan</span><span class="status-pill bg-white/5 text-amber-200">${order.status}</span></div>
        <div class="space-y-3">
          ${order.items.map(item => `<div class="flex items-center justify-between"><span>${item.quantity}x ${escapeHtml(item.name)}</span><span>${formatPrice(item.price * item.quantity)}</span></div>`).join('')}
        </div>
        <div class="flex items-center justify-between text-white"><span>Jumlah</span><span class="font-semibold">${formatPrice(order.total)}</span></div>
      </div>
      <div class="mt-6 grid gap-3">
        <button data-action="whatsapp-order" class="rounded-3xl bg-gradient-to-r from-green-500 to-emerald-500 px-5 py-4 text-sm font-semibold text-white">Buka WhatsApp</button>
        <button data-action="track-order" class="rounded-3xl bg-white/10 px-5 py-4 text-sm font-semibold text-white">Lihat Tracking</button>
        <button data-action="home" class="rounded-3xl bg-slate-950/80 px-5 py-4 text-sm font-semibold text-white">Kembali ke Rumah</button>
      </div>
    </div>
  `;
}

export function renderTracking() {
  const orders = getOrders();
  const id = state.trackingOrderId || (state.orderPreview && state.orderPreview.id);
  const order = orders.find(o => o.id === id) || state.orderPreview;

  if (!order) {
    return `
      <div class="page-shell p-5 pt-8">
        <div class="rounded-[32px] glass-border glass p-6 text-center">
          <p class="text-slate-300">Order tidak ditemui. Semak semula link tracking anda.</p>
          <button data-action="home" class="mt-5 rounded-3xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white">Kembali</button>
        </div>
      </div>
    `;
  }

  const currentIndex = ORDER_STATUSES.indexOf(order.status);

  return `
    <div class="page-shell p-5 pt-8">
      <div class="flex items-center justify-between gap-4 mb-6">
        <button data-action="home" class="icon-button">←</button>
        <div class="text-center flex-1">
          <p class="text-sm text-slate-400">Tracking Order</p>
          <h2 class="text-2xl font-semibold">${order.id}</h2>
        </div>
        <div class="w-10"></div>
      </div>
      <div class="rounded-[32px] glass-border glass p-5 space-y-5">
        <div class="space-y-2">
          <p class="text-sm text-slate-400">Customer</p>
          <p class="text-lg font-semibold">${escapeHtml(order.customer.name)}</p>
        </div>
        <div class="h-2 rounded-full overflow-hidden bg-white/10">
          <div class="status-line-fill" style="width:${Math.max(8, ((currentIndex + 1) / ORDER_STATUSES.length) * 100)}%"></div>
        </div>
        <div class="grid gap-4">
          ${ORDER_STATUSES.map((status, index) => `
            <div class="flex items-center gap-3 ${index <= currentIndex ? 'text-white' : 'text-slate-500'}">
              <span class="tracking-dot ${index <= currentIndex ? 'bg-amber-300' : 'bg-slate-600'}"></span>
              <div>
                <p class="font-semibold">${status}</p>
                <p class="text-sm text-slate-400">${index === currentIndex ? 'Current stage' : index < currentIndex ? 'Completed' : 'Upcoming'}</p>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-300">
          <p class="font-semibold">Alamat:</p>
          <p>${escapeHtml(order.customer.address)}</p>
        </div>
        <div class="space-y-3">
          <div class="flex items-center justify-between text-slate-400"><span>Estimated Delivery</span><span>${getSettings().deliveryEta}</span></div>
          <div class="flex items-center justify-between text-slate-400"><span>Payment</span><span>Cash on Delivery</span></div>
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          ${ADMIN_ACTIONS.map(action => `
            <button data-action="track-message" data-status="${action}" class="rounded-3xl bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10">${action}</button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
