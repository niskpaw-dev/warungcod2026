// Event handler dispatch module
import { state, updateState } from './state.js';
import {
  getSettings,
  getMenu,
  getCategories,
  saveSettings,
  saveMenu,
  saveCategories,
  getOrders,
  getAnalytics,
  getCart
} from './storage.js';
import { generateWhatsAppLink, searchMenu } from './utils.js';
import { addToCart, removeCartItem, updateCartItem, clearCart } from './cart.js';
import { createOrder, updateOrderStatus, getOrderById } from './orders.js';
import { notify, triggerCartPulse } from './notifications.js';

export function handleAction(event, callbacks) {
  const target = event.currentTarget;
  const action = target.dataset.action;
  const id = target.dataset.id;
  const step = Number(target.dataset.step || 0);
  const status = target.dataset.status;
  const tab = target.dataset.tab;

  const handlers = {
    hero: () => {
      updateState({ activeCategory: 'all', searchQuery: '' });
      callbacks?.render?.();
    },

    category: () => {
      updateState({ activeCategory: id || 'all' });
      callbacks?.render?.();
    },

    view: () => {
      updateState({ modalFood: id, modalQty: 1, modalNotes: '' });
      callbacks?.render?.();
    },

    'close-modal': () => {
      updateState({ modalFood: null });
      callbacks?.render?.();
    },

    qty: () => {
      const current = state.modalQty || 1;
      const newQty = Math.max(1, current + step);
      updateState({ modalQty: newQty });
      const item = getMenu().find(i => i.id === id);
      if (item) {
        document.getElementById('modalTotal').textContent =
          `${getSettings().currency}${(item.price * newQty).toFixed(2)}`;
      }
      const qtyEl = document.getElementById('modalQty');
      if (qtyEl) qtyEl.textContent = newQty;
    },

    'add-to-cart': () => {
      const notes = document.getElementById('modalNotes')?.value || '';
      const qty = state.modalQty || 1;
      addToCart(id, qty, notes, { notify, triggerCartPulse, render: callbacks?.render });
      updateState({ modalFood: null });
    },

    checkout: () => {
      updateState({ screen: 'checkout' });
      callbacks?.render?.();
    },

    back: () => {
      updateState({ screen: 'home' });
      callbacks?.render?.();
    },

    'confirm-order': () => {
      if (!navigator.onLine) {
        notify('Tiada internet. Anda perlu sambungan internet untuk meneruskan pesanan melalui WhatsApp.', callbacks?.toastRoot);
        return;
      }

      updateState({
        checkoutDraft: {
          name: document.getElementById('checkoutName')?.value.trim(),
          phone: document.getElementById('checkoutPhone')?.value.trim(),
          address: document.getElementById('checkoutAddress')?.value.trim(),
          notes: document.getElementById('checkoutNotes')?.value.trim()
        }
      });
      const order = createOrder({ notify, render: callbacks?.render });
      if (order) {
        window.open(generateWhatsAppLink(order), '_blank');
        updateState({ screen: 'success' });
        callbacks?.render?.();
      }
    },

    'whatsapp-order': () => {
      if (state.orderPreview) {
        window.open(generateWhatsAppLink(state.orderPreview), '_blank');
      }
    },

    'track-order': () => {
      updateState({ screen: 'tracking', trackingOrderId: state.orderPreview?.id });
      callbacks?.render?.();
    },

    home: () => {
      updateState({ screen: 'home', cartOpen: false });
      callbacks?.render?.();
    },

    cart: () => {
      updateState({ cartOpen: !state.cartOpen });
      callbacks?.render?.();
    },

    'close-cart': () => {
      updateState({ cartOpen: false });
      callbacks?.render?.();
    },

    'cart-update': () => {
      const cart = getCart();
      const cartItem = cart.find(item => item.id === id);
      if (cartItem) {
        updateCartItem(id, cartItem.quantity + step);
        callbacks?.render?.();
      }
    },

    'cart-remove': () => {
      removeCartItem(id, { notify, render: callbacks?.render });
    },

    'track-message': () => {
      const order = getOrderById(state.trackingOrderId) || state.orderPreview;
      if (!order) return;
      const settings = getSettings();
      
      // Terjemahan status ke Bahasa Melayu untuk mesej WhatsApp
      const statusTranslations = {
        'Preparing': 'Sedang Disediakan',
        'Out for Delivery': 'Sedang Dihantar',
        'Delivered': 'Telah Dihantar',
        'Customer Unreachable': 'Pelanggan Gagal Dihubungi'
      };
      const translatedStatus = statusTranslations[status] || status;

      const lines = [
        `Hello ${settings.businessName}!`,
        '',
        `Kemas kini status pesanan ${order.id}: ${translatedStatus}.`,
        '',
        `Pelanggan: ${order.customer.name}`,
        `No. Telefon: ${order.customer.phone}`,
        `Alamat: ${order.customer.address}`,
        '',
        'Harap maklum.'
      ];
      const encoded = encodeURIComponent(lines.join('\n'));
      window.open(
        `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${encoded}`,
        '_blank'
      );
    },

    admin: () => {
      updateState({ screen: 'admin' });
      callbacks?.render?.();
    },

    'admin-login': () => {
      const password = document.getElementById('adminPassword')?.value.trim();
      if (password === getSettings().adminPassword) {
        updateState({ isAdmin: true, screen: 'admin' });
        notify('Admin unlocked', callbacks?.toastRoot);
        callbacks?.render?.();
      } else {
        notify('Kata laluan salah', callbacks?.toastRoot);
      }
    },

    'admin-logout': () => {
      updateState({ isAdmin: false, screen: 'home', adminEditing: null });
      callbacks?.render?.();
    },

    'admin-tab': () => {
      updateState({ adminTab: tab || 'dashboard' });
      callbacks?.render?.();
    },

    'admin-add-menu': () => {
      const categories = getCategories();
      updateState({
        adminEditing: {
          id: '',
          name: '',
          price: '',
          unit: '',
          description: '',
          category: categories[1]?.id || 'main',
          stock: true,
          favorite: false
        }
      });
      callbacks?.render?.();
    },

    'admin-edit-menu': () => {
      const menuItem = getMenu().find(i => i.id === id);
      if (menuItem) {
        updateState({ adminEditing: { ...menuItem } });
        callbacks?.render?.();
      }
    },

    'admin-delete-menu': () => {
      const updated = getMenu().filter(item => item.id !== id);
      saveMenu(updated);
      notify('Menu dihapus', callbacks?.toastRoot);
      callbacks?.render?.();
    },

    'admin-save-menu': () => {
      const name = document.getElementById('adminMenuName')?.value.trim();
      const price = Number(document.getElementById('adminMenuPrice')?.value) || 0;
      const unit = document.getElementById('adminMenuUnit')?.value.trim();
      const description = document.getElementById('adminMenuDescription')?.value.trim();
      const category = document.getElementById('adminMenuCategory')?.value;
      const stock = document.getElementById('adminMenuStock')?.checked;
      const favorite = document.getElementById('adminMenuFavorite')?.checked;

      if (!name || !price || !unit || !category) {
        notify('Sila lengkapkan maklumat menu', callbacks?.toastRoot);
        return;
      }

      const menu = getMenu();
      if (state.adminEditing.id) {
        const updated = menu.map(item =>
          item.id === state.adminEditing.id
            ? { ...item, name, price, unit, description, category, stock, favorite }
            : item
        );
        saveMenu(updated);
      } else {
        const newItem = {
          id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name,
          price,
          unit,
          description,
          category,
          stock,
          favorite,
          image: getMenu()[0]?.image
        };
        saveMenu([newItem, ...menu]);
      }

      updateState({ adminEditing: null });
      notify('Menu disimpan', callbacks?.toastRoot);
      callbacks?.render?.();
    },

    'cancel-admin-modal': () => {
      updateState({ adminEditing: null });
      callbacks?.render?.();
    },

    'admin-add-category': () => {
      const label = prompt('Nama kategori baru');
      if (!label) return;
      const categories = getCategories();
      categories.push({
        id: label.toLowerCase().replace(/\s+/g, '-'),
        label,
        tone: 'bg-indigo-500/12 text-indigo-200'
      });
      saveCategories(categories);
      notify('Kategori ditambah', callbacks?.toastRoot);
      callbacks?.render?.();
    },

    'admin-delete-category': () => {
      const categories = getCategories().filter(cat => cat.id !== id && cat.id !== 'all');
      saveCategories(categories);
      notify('Kategori dibuang', callbacks?.toastRoot);
      callbacks?.render?.();
    },

    'admin-save-settings': () => {
      const businessName = document.getElementById('adminBusinessName')?.value.trim();
      const whatsapp = document.getElementById('adminWhatsapp')?.value.trim();
      const deliveryFee = Number(document.getElementById('adminDeliveryFee')?.value) || 0;
      const adminPassword = document.getElementById('adminAdminPassword')?.value.trim();
      const updated = { ...getSettings(), businessName, whatsapp, deliveryFee, adminPassword };
      saveSettings(updated);
      notify('Tetapan disimpan', callbacks?.toastRoot);
      callbacks?.render?.();
    },

    'admin-update-order': () => {
      updateOrderStatus(id, status, { notify, render: callbacks?.render, toastRoot: callbacks?.toastRoot });
    },

    'admin-export': () => {
      const payload = {
        settings: getSettings(),
        menu: getMenu(),
        categories: getCategories(),
        orders: getOrders(),
        analytics: getAnalytics()
      };
      const encoded = encodeURIComponent(JSON.stringify(payload, null, 2));
      const link = document.createElement('a');
      link.href = 'data:application/json;charset=utf-8,' + encoded;
      link.download = 'warungcod-data.json';
      link.click();
    },

    'admin-reset': () => {
      if (!confirm('Reset semua data aplikasi?')) return;
      localStorage.clear();
      window.location.reload();
    }
  };

  const handler = handlers[action];
  if (handler) {
    handler();
  }
}
