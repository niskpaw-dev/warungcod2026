// Admin render functions
import { state } from './state.js';
import { getSettings, getMenu, getCategories, getOrders, getAnalytics } from './storage.js';
import { formatPrice, escapeHtml } from './utils.js';
import { ADMIN_TABS, ADMIN_ACTIONS } from './constants.js';

export function renderAdminLogin() {
  return `
    <div class="page-shell p-5 pt-8">
      <div class="rounded-[32px] glass-border glass p-6 text-center space-y-4">
        <h2 class="text-2xl font-semibold">Admin Login</h2>
        <p class="text-slate-400">Masukkan kata laluan untuk menguruskan menu dan tetapan.</p>
        <input id="adminPassword" type="password" placeholder="Password admin" class="input-glow w-full rounded-3xl px-4 py-4 text-white placeholder:text-slate-500" />
        <button data-action="admin-login" class="w-full rounded-3xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-4 text-sm font-semibold text-white">Buka Papan Pemuka</button>
        <button data-action="home" class="w-full rounded-3xl bg-white/5 px-5 py-4 text-sm font-semibold text-white">Kembali ke Rumah</button>
      </div>
    </div>
  `;
}

export function renderAdminDashboard() {
  const analytics = getAnalytics();

  return `
    <div class="grid gap-4">
      <div class="rounded-3xl bg-slate-950/90 p-5 glass-border glass">
        <p class="text-sm text-slate-400">Daily Sales</p>
        <p class="mt-3 text-3xl font-semibold">${formatPrice(analytics.dailySales || 0)}</p>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="rounded-3xl bg-slate-950/90 p-5 glass-border glass">
          <p class="text-sm text-slate-400">Total Orders</p>
          <p class="mt-3 text-3xl font-semibold">${analytics.orders || 0}</p>
        </div>
        <div class="rounded-3xl bg-slate-950/90 p-5 glass-border glass">
          <p class="text-sm text-slate-400">Best Seller</p>
          <p class="mt-3 text-2xl font-semibold">${analytics.bestSeller || 'N/A'}</p>
        </div>
      </div>
      <div class="rounded-3xl bg-slate-950/90 p-5 glass-border glass">
        <p class="text-sm text-slate-400">Repeat Customer Estimate</p>
        <p class="mt-3 text-3xl font-semibold">${analytics.repeatCustomer || 0}%</p>
      </div>
    </div>
  `;
}

export function renderAdminMenu() {
  const menu = getMenu();

  return `
    <div class="space-y-4">
      <button data-action="admin-add-menu" class="rounded-3xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white">Tambah menu baru</button>
      <div class="grid gap-3">
        ${menu.map(item => `
          <div class="rounded-3xl bg-slate-950/90 p-4 glass-border glass flex flex-col gap-3">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-sm text-slate-400">${escapeHtml(item.category)}</p>
                <h3 class="text-lg font-semibold">${escapeHtml(item.name)}</h3>
              </div>
              <span class="status-pill bg-white/5 text-amber-200">${item.stock ? 'Active' : 'Off'}</span>
            </div>
            <div class="grid gap-3 sm:grid-cols-2">
              <span class="text-slate-300">${formatPrice(item.price)}</span>
              <span class="text-slate-300">${item.unit}</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <button data-action="admin-edit-menu" data-id="${item.id}" class="rounded-2xl bg-white/5 px-4 py-2 text-sm text-white">Edit</button>
              <button data-action="admin-delete-menu" data-id="${item.id}" class="rounded-2xl bg-red-500/10 px-4 py-2 text-sm text-red-200">Delete</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function renderAdminCategories() {
  const categories = getCategories();

  return `
    <div class="space-y-4">
      <div class="rounded-3xl bg-slate-950/90 p-5 glass-border glass">
        <p class="text-sm text-slate-400">Urus kategori menu anda</p>
        <div class="mt-4 grid gap-3">
          ${categories.map(category => `
            <div class="rounded-3xl bg-white/5 p-4 flex items-center justify-between gap-4">
              <div>
                <p class="font-semibold">${escapeHtml(category.label)}</p>
                <p class="text-slate-400 text-sm">ID: ${category.id}</p>
              </div>
              <button data-action="admin-delete-category" data-id="${category.id}" class="rounded-2xl bg-red-500/10 px-4 py-2 text-sm text-red-200">Buang</button>
            </div>
          `).join('')}
          <button data-action="admin-add-category" class="rounded-3xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white">Tambah kategori baru</button>
        </div>
      </div>
    </div>
  `;
}

export function renderAdminSettings() {
  const settings = getSettings();

  return `
    <div class="space-y-4">
      <div class="rounded-3xl bg-slate-950/90 p-5 glass-border glass space-y-4">
        <div class="grid gap-3">
          <input id="adminBusinessName" value="${escapeHtml(settings.businessName)}" placeholder="Nama kedai" class="input-glow w-full rounded-3xl px-4 py-4 text-white" />
          <input id="adminWhatsapp" value="${escapeHtml(settings.whatsapp)}" placeholder="Nombor WhatsApp" class="input-glow w-full rounded-3xl px-4 py-4 text-white" />
          <input id="adminDeliveryFee" value="${escapeHtml(settings.deliveryFee)}" type="number" placeholder="Delivery fee" class="input-glow w-full rounded-3xl px-4 py-4 text-white" />
          <input id="adminAdminPassword" value="${escapeHtml(settings.adminPassword)}" type="password" placeholder="Admin password" class="input-glow w-full rounded-3xl px-4 py-4 text-white" />
        </div>
        <button data-action="admin-save-settings" class="w-full rounded-3xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-4 text-sm font-semibold text-white">Simpan Tetapan</button>
      </div>
    </div>
  `;
}

export function renderAdminOrders() {
  const orders = getOrders().slice(0, 7);

  return `
    <div class="space-y-4">
      ${orders.map(order => `
        <div class="rounded-3xl bg-slate-950/90 p-5 glass-border glass space-y-3">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-sm text-slate-400">${order.id}</p>
              <h3 class="text-lg font-semibold">${order.customer.name}</h3>
            </div>
            <span class="status-pill bg-white/5 text-amber-200">${order.status}</span>
          </div>
          <p class="text-slate-400 text-sm">${order.items.map(item => `${item.quantity}x ${escapeHtml(item.name)}`).join(', ')}</p>
          <div class="flex items-center gap-2 flex-wrap">
            ${['Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(status => `<button data-action="admin-update-order" data-id="${order.id}" data-status="${status}" class="rounded-2xl bg-white/5 px-3 py-2 text-xs text-white">${status}</button>`).join('')}
          </div>
        </div>
      `).join('')}
      <button data-action="admin-export" class="w-full rounded-3xl bg-white/10 px-5 py-4 text-sm font-semibold text-white">Export Data JSON</button>
      <button data-action="admin-reset" class="w-full rounded-3xl bg-red-500/10 px-5 py-4 text-sm font-semibold text-red-200">Reset Database</button>
    </div>
  `;
}

export function renderAdmin() {
  const settings = getSettings();

  const tabContent = {
    dashboard: renderAdminDashboard(),
    menu: renderAdminMenu(),
    categories: renderAdminCategories(),
    settings: renderAdminSettings(),
    orders: renderAdminOrders()
  };

  return `
    <div class="page-shell p-5 pb-24">
      <div class="flex items-center justify-between gap-4 mb-6">
        <button data-action="home" class="icon-button">←</button>
        <div class="text-center flex-1">
          <p class="text-sm text-slate-400">Admin Panel</p>
          <h2 class="text-2xl font-semibold">${settings.businessName}</h2>
        </div>
        <button data-action="admin-logout" class="icon-button">⏻</button>
      </div>
      <div class="rounded-[32px] glass-border glass p-4 grid gap-3 overflow-x-auto whitespace-nowrap hide-scrollbar">
        ${ADMIN_TABS.map(tab => `<button data-action="admin-tab" data-tab="${tab}" class="rounded-3xl px-4 py-3 text-sm font-semibold ${state.adminTab === tab ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white' : 'bg-white/5 text-slate-200 hover:bg-white/10'}">${tab.charAt(0).toUpperCase() + tab.slice(1)}</button>`).join('')}
      </div>
      <div class="mt-6 space-y-5">${tabContent[state.adminTab] || tabContent.dashboard}</div>
    </div>
  `;
}

export function renderAdminModal() {
  if (!state.adminEditing) return '';
  const item = state.adminEditing;
  const categories = getCategories();

  return `
    <div class="fixed inset-0 z-60 backdrop backdrop-blur-sm flex items-center justify-center px-4 py-6">
      <div class="absolute inset-0 bg-slate-950/80" data-action="cancel-admin-modal"></div>
      <div class="relative w-full max-w-2xl rounded-[32px] glass-border glass p-6 soft-shadow slide-up overflow-y-auto max-h-[86vh]">
        <button data-action="cancel-admin-modal" class="absolute right-4 top-4 text-slate-300">✕</button>
        <div class="space-y-4">
          <h2 class="text-2xl font-semibold">${item.id ? 'Edit Menu' : 'Tambah Menu'}</h2>
          <div class="grid gap-4">
            <input id="adminMenuName" value="${escapeHtml(item.name || '')}" placeholder="Nama menu" class="input-glow w-full rounded-3xl px-4 py-4 text-white" />
            <input id="adminMenuPrice" type="number" value="${escapeHtml(item.price || '')}" placeholder="Harga" class="input-glow w-full rounded-3xl px-4 py-4 text-white" />
            <input id="adminMenuUnit" value="${escapeHtml(item.unit || '')}" placeholder="Unit (plate, cup, pcs)" class="input-glow w-full rounded-3xl px-4 py-4 text-white" />
            <select id="adminMenuCategory" class="input-glow w-full rounded-3xl px-4 py-4 text-white">
              ${categories.map(cat => `<option value="${cat.id}" ${cat.id === item.category ? 'selected' : ''}>${escapeHtml(cat.label)}</option>`).join('')}
            </select>
            <textarea id="adminMenuDescription" placeholder="Deskripsi" class="input-glow w-full min-h-[120px] rounded-3xl px-4 py-4 text-white resize-none">${escapeHtml(item.description || '')}</textarea>
            <div class="grid sm:grid-cols-2 gap-4">
              <label class="flex items-center gap-3 rounded-3xl bg-white/5 px-4 py-3">
                <input id="adminMenuStock" type="checkbox" ${item.stock !== false ? 'checked' : ''} class="h-5 w-5 accent-orange-500" />
                <span>Stok aktif</span>
              </label>
              <label class="flex items-center gap-3 rounded-3xl bg-white/5 px-4 py-3">
                <input id="adminMenuFavorite" type="checkbox" ${item.favorite ? 'checked' : ''} class="h-5 w-5 accent-rose-500" />
                <span>Promosikan sebagai favorite</span>
              </label>
            </div>
          </div>
          <button data-action="admin-save-menu" class="w-full rounded-3xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-4 text-sm font-semibold text-white">Simpan Menu</button>
        </div>
      </div>
    </div>
  `;
}
