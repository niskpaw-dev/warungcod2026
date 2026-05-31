// Render functions for all screens
import { state } from './state.js';
import {
  getSettings,
  getMenu,
  getCategories,
  getCart,
  getOrders,
  getAnalytics
} from './storage.js';
import {
  formatPrice,
  escapeHtml,
  searchMenu,
  getFeaturedItems,
  getBestSellers,
  generateWhatsAppLink
} from './utils.js';
import { getCartItemCount } from './cart.js';
import { HERO_MESSAGES, ADMIN_TABS, ORDER_STATUSES, ADMIN_ACTIONS } from './constants.js';

export function renderSplash() {
  return `
    <div class="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div class="relative mb-8 flex h-32 w-32 items-center justify-center rounded-[42px] bg-gradient-to-br from-orange-500 to-rose-500 shadow-2xl shadow-orange-500/25">
        <span class="text-5xl font-bold text-white">W</span>
      </div>
      <div class="space-y-4 max-w-xl">
        <h1 class="text-4xl font-semibold tracking-tight">WarungCOD</h1>
        <p class="text-slate-300">Modern, premium dan ringan - untuk kedai kecil yang mahu order cepat tanpa kerumitan.</p>
      </div>
      <div class="mt-12 w-full max-w-sm rounded-[32px] bg-white/5 p-5 glass-border glass">
        <div class="h-3 w-full overflow-hidden rounded-full bg-white/10">
          <div class="h-full w-1/2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 shimmer"></div>
        </div>
        <p class="mt-4 text-sm text-slate-400">Memuatkan menu dan troli anda...</p>
      </div>
    </div>
  `;
}

function renderHeroCarousel() {
  const active = HERO_MESSAGES[state.currentHero % HERO_MESSAGES.length];
  return `
    <div class="relative overflow-hidden rounded-[32px] glass-border glass p-6 sm:p-8 soft-shadow">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,122,24,0.25),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(255,76,96,0.22),transparent_35%)]"></div>
      <div class="relative space-y-4">
        <div class="inline-flex items-center gap-2 rounded-3xl bg-white/10 px-4 py-2 text-sm text-orange-100 font-semibold ring-1 ring-white/10">Premium Grab &amp; COD</div>
        <div class="space-y-3">
          <h1 class="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">${active.title}</h1>
          <p class="text-slate-300 max-w-xl">${active.subtitle}</p>
        </div>
        <button data-action="hero" class="mt-2 inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:shadow-xl">${active.action}</button>
      </div>
    </div>
  `;
}

function renderCategorySlider() {
  const categories = getCategories();
  return categories
    .map(category => `
      <button data-action="category" data-id="${category.id}" class="min-w-max rounded-2xl border border-white/10 px-4 py-3 text-left text-sm font-semibold transition ${state.activeCategory === category.id ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/20' : 'bg-white/5 text-slate-200 hover:bg-white/10'}">${escapeHtml(category.label)}</button>
    `)
    .join('');
}

function renderMenuCards() {
  const items = searchMenu(state.searchQuery, state.activeCategory);
  if (!items.length) {
    return `<div class="p-6 rounded-3xl glass-border glass text-center text-slate-300">Tiada menu ditemui. Cuba kata kunci lain.</div>`;
  }
  return items
    .map(item => `
      <article data-food="${item.id}" class="group glass-border glass overflow-hidden rounded-[28px] p-4 sm:p-5 transition hover:-translate-y-1 hover:shadow-xl">
        <div class="flex items-start gap-4">
          <div class="w-24 h-24 rounded-3xl bg-cover bg-center" style="background-image:url('${item.image}')"></div>
          <div class="flex-1">
            <div class="flex items-center justify-between gap-3">
              <h3 class="text-lg font-semibold leading-tight">${escapeHtml(item.name)}</h3>
              ${item.favorite ? '<span class="text-orange-300">★</span>' : ''}
            </div>
            <p class="mt-2 text-sm text-slate-400 leading-relaxed">${escapeHtml(item.description)}</p>
            <div class="mt-4 flex items-center justify-between gap-3">
              <span class="text-orange-200 font-semibold">${formatPrice(item.price)}</span>
              <button data-action="view" data-id="${item.id}" class="rounded-2xl bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/15">Tambah</button>
            </div>
          </div>
        </div>
      </article>
    `)
    .join('');
}

export function renderHome() {
  const counts = getCartItemCount();
  return `
    <div class="page-shell px-5 pt-6 pb-24">
      <div class="flex items-center justify-between gap-4 mb-6">
        <div>
          <p class="text-sm uppercase tracking-[0.24em] text-orange-300">WarungCOD</p>
          <h2 class="mt-3 text-3xl font-semibold leading-tight">${getSettings().businessName}</h2>
          <p class="mt-2 text-slate-400 max-w-xl">${getSettings().tagLine}</p>
        </div>
        <div class="flex flex-col items-end gap-2">
          <div class="rounded-3xl bg-white/5 px-4 py-3 text-sm text-slate-200">${state.offline ? 'Offline' : 'Online'}</div>
          <button data-action="admin" class="rounded-3xl bg-white/5 px-4 py-3 text-sm text-slate-200 hover:bg-white/10">Admin</button>
        </div>
      </div>
      ${renderHeroCarousel()}
      <div class="mt-7 space-y-4">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-sm text-slate-400">Cari Menu</p>
            <h3 class="text-xl font-semibold">Pilih apa yang anda suka</h3>
          </div>
          <span class="rounded-3xl bg-white/5 px-3 py-2 text-sm text-slate-300">${getMenu().length} Items</span>
        </div>
        <div class="relative">
          <input id="searchInput" value="${escapeHtml(state.searchQuery)}" placeholder="Cari nasi lemak, minuman, dessert..." class="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 text-sm text-white placeholder:text-slate-500 outline-none input-glow" />
          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">🔎</span>
        </div>
      </div>
      <div class="mt-6 overflow-x-auto pb-2 hide-scrollbar">
        <div class="flex gap-3 min-w-max">${renderCategorySlider()}</div>
      </div>
      <section class="mt-6 space-y-4">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-sm text-slate-400">Semua Menu</p>
            <h3 class="text-xl font-semibold">Cari &amp; temui makanan</h3>
          </div>
        </div>
        <div class="grid gap-4">${renderMenuCards()}</div>
      </section>
      <section class="mt-6 space-y-4">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-sm text-slate-400">Disyorkan</p>
            <h3 class="text-xl font-semibold">Popular hari ini</h3>
          </div>
        </div>
        <div class="grid gap-4">${getFeaturedItems().map(item => `
          <article data-food="${item.id}" class="group relative rounded-[28px] p-5 glass-border glass overflow-hidden cursor-pointer transition hover:-translate-y-1">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,122,24,0.12),transparent_30%)]"></div>
            <div class="relative flex items-center gap-4">
              <div class="w-24 h-24 rounded-3xl bg-cover bg-center" style="background-image:url('${item.image}')"></div>
              <div class="flex-1">
                <p class="text-sm text-orange-200 font-semibold">${item.category.toUpperCase()}</p>
                <h4 class="mt-2 text-lg font-semibold">${escapeHtml(item.name)}</h4>
                <p class="mt-2 text-sm text-slate-300">${escapeHtml(item.description)}</p>
              </div>
            </div>
            <div class="mt-5 flex items-center justify-between">
              <span class="text-orange-200 font-semibold">${formatPrice(item.price)}</span>
              <button data-action="view" data-id="${item.id}" class="rounded-3xl bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15">Tambah</button>
            </div>
          </article>
        `).join('')}</div>
      </section>
      <section class="mt-7 rounded-[32px] glass-border glass p-5 soft-shadow">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-sm text-slate-400">Promosi Eksklusif</p>
            <h3 class="text-xl font-semibold">Bayar COD, nikmati diskaun</h3>
          </div>
          <span class="status-pill bg-white/5 text-amber-200">COD Friendly</span>
        </div>
        <p class="mt-4 text-slate-300">Pesan sekarang dan gunakan nombor WhatsApp anda untuk mendapatkan pengalaman checkout tanpa aplikasi tambahan.</p>
      </section>
      <section class="mt-7 grid gap-4">
        ${getBestSellers().map(item => `
          <div class="rounded-3xl glass-border glass p-4 flex items-center gap-4">
            <div class="w-20 h-20 rounded-3xl bg-cover bg-center" style="background-image:url('${item.image}')"></div>
            <div class="flex-1">
              <p class="text-sm text-slate-400">Best Seller</p>
              <h4 class="mt-1 text-lg font-semibold">${escapeHtml(item.name)}</h4>
              <p class="mt-2 text-sm text-slate-300">${item.price ? formatPrice(item.price) : ''}</p>
            </div>
          </div>
        `).join('')}
      </section>
    </div>
    <button id="cartButton" data-action="cart" class="fixed bottom-6 right-5 z-50 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 p-4 text-white shadow-2xl shadow-orange-500/30 transition hover:scale-105 focus:outline-none">
      <div class="relative">
        <span class="absolute -right-2 -top-2 inline-flex h-8 min-w-[32px] items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white ring-1 ring-white/10">${counts}</span>
        🛒
      </div>
    </button>
  `;
}

export function renderFoodModal(foodId) {
  const item = getMenu().find(item => item.id === foodId);
  if (!item) return '';

  return `
    <div class="fixed inset-0 z-50 backdrop backdrop-blur-sm flex items-end sm:items-center justify-center px-4 py-6">
      <div class="absolute inset-0 bg-slate-950/70" data-action="close-modal"></div>
      <div class="relative w-full max-w-xl rounded-[32px] glass-border glass p-5 sm:p-7 overflow-hidden soft-shadow slide-up">
        <button data-action="close-modal" class="absolute right-4 top-4 text-slate-300 text-xl">✕</button>
        <div class="space-y-5">
          <div class="template-image h-64" style="background-image:url('${item.image}')"></div>
          <div class="space-y-2">
            <h2 class="text-2xl font-semibold">${escapeHtml(item.name)}</h2>
            <p class="text-slate-400">${escapeHtml(item.description)}</p>
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div class="rounded-3xl bg-white/5 p-4 text-center">
              <p class="text-sm text-slate-400">Harga</p>
              <p class="mt-2 text-lg font-semibold text-orange-200">${formatPrice(item.price)}</p>
            </div>
            <div class="rounded-3xl bg-white/5 p-4 text-center">
              <p class="text-sm text-slate-400">Unit</p>
              <p class="mt-2 text-lg font-semibold">${item.unit}</p>
            </div>
            <div class="rounded-3xl bg-white/5 p-4 text-center">
              <p class="text-sm text-slate-400">Stok</p>
              <p class="mt-2 text-lg font-semibold">${item.stock ? 'Ready' : 'Habis'}</p>
            </div>
          </div>
          <div class="rounded-3xl bg-slate-950/80 p-4 space-y-4">
            <div class="flex items-center justify-between gap-4">
              <span class="text-sm text-slate-400">Kuantiti</span>
              <div class="inline-flex items-center gap-2 rounded-3xl bg-white/5 p-2">
                <button data-action="qty" data-id="${item.id}" data-step="-1" class="icon-button">−</button>
                <span id="modalQty" class="min-w-[30px] text-center text-base font-semibold">${state.modalQty}</span>
                <button data-action="qty" data-id="${item.id}" data-step="1" class="icon-button">+</button>
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-sm text-slate-400">Arahan khas</label>
              <textarea id="modalNotes" class="w-full min-h-[108px] rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-sm text-white placeholder:text-slate-500 resize-none input-glow" placeholder="Contoh: kurang pedas, lebih sambal...">${escapeHtml(state.modalNotes)}</textarea>
            </div>
          </div>
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-sm text-slate-400">Jumlah</p>
              <p id="modalTotal" class="mt-1 text-2xl font-semibold">${formatPrice(item.price * state.modalQty)}</p>
            </div>
            <button data-action="add-to-cart" data-id="${item.id}" class="rounded-3xl bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-orange-500/20">Tambah ke Troli</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderCartDrawer() {
  const cart = getCart();
  const summary = { subtotal: 0, delivery: 0, total: 0 };
  cart.forEach(item => (summary.subtotal += item.price * item.quantity));
  summary.delivery = getSettings().deliveryFee;
  summary.total = summary.subtotal + summary.delivery;

  return `
    <div class="bottom-sheet ${state.cartOpen ? 'open' : ''} glass-border glass p-5 rounded-t-[32px] soft-shadow">
      <div class="mx-auto mb-4 h-1.5 w-16 rounded-full bg-white/10"></div>
      <div class="flex items-center justify-between gap-4 mb-5">
        <div>
          <p class="text-lg font-semibold">Troli Saya</p>
          <p class="text-sm text-slate-400">${cart.length} item dalam troli</p>
        </div>
        <button data-action="close-cart" class="rounded-2xl bg-white/5 px-4 py-2 text-sm text-slate-200">Tutup</button>
      </div>
      <div class="space-y-4 max-h-[52vh] overflow-y-auto pr-2">
        ${cart.length ? cart.map(item => `
          <div class="rounded-3xl bg-slate-950/85 p-4 grid gap-3 sm:grid-cols-[1fr_auto]">
            <div>
              <p class="font-semibold">${escapeHtml(item.name)}</p>
              <p class="mt-1 text-sm text-slate-400">${formatPrice(item.price)} x ${item.quantity}</p>
            </div>
            <div class="flex items-center gap-2">
              <button data-action="cart-update" data-id="${item.id}" data-step="-1" class="icon-button">−</button>
              <span class="min-w-[28px] text-center font-semibold">${item.quantity}</span>
              <button data-action="cart-update" data-id="${item.id}" data-step="1" class="icon-button">+</button>
            </div>
            <button data-action="cart-remove" data-id="${item.id}" class="rounded-3xl bg-white/5 px-4 py-3 text-sm text-slate-200">Buang</button>
          </div>
        `).join('') : '<div class="rounded-3xl bg-white/5 p-6 text-center text-slate-300">Troli kosong. Tambah menu kegemaran anda.</div>'}
      </div>
      <div class="section-divider"></div>
      <div class="space-y-4">
        <div class="flex items-center justify-between text-sm text-slate-400"><span>Subtotal</span><span>${formatPrice(summary.subtotal)}</span></div>
        <div class="flex items-center justify-between text-sm text-slate-400"><span>Delivery</span><span>${formatPrice(summary.delivery)}</span></div>
        <div class="flex items-center justify-between text-lg font-semibold"><span>Total</span><span>${formatPrice(summary.total)}</span></div>
        <button data-action="checkout" class="w-full rounded-3xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-4 text-sm font-semibold text-white">Checkout via WhatsApp</button>
        <div class="rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-300">COD tersedia. Selesaikan order dalam 30 saat untuk pengalaman paling pantas.</div>
      </div>
    </div>
  `;
}
