// Global state management
export const state = {
  screen: 'splash',
  activeCategory: 'all',
  searchQuery: '',
  modalFood: null,
  modalQty: 1,
  modalNotes: '',
  cartOpen: false,
  checkoutDraft: { name: '', phone: '', address: '', notes: '' },
  orderPreview: null,
  trackingOrderId: null,
  isAdmin: false,
  adminTab: 'dashboard',
  adminEditing: null,
  adminUnlock: false,
  installPromptEvent: null,
  offline: !navigator.onLine,
  showInstall: false,
  splashComplete: false,
  currentHero: 0
};

export function resetState() {
  state.screen = 'splash';
  state.activeCategory = 'all';
  state.searchQuery = '';
  state.modalFood = null;
  state.modalQty = 1;
  state.modalNotes = '';
  state.cartOpen = false;
  state.checkoutDraft = { name: '', phone: '', address: '', notes: '' };
  state.orderPreview = null;
  state.trackingOrderId = null;
  state.isAdmin = false;
  state.adminTab = 'dashboard';
  state.adminEditing = null;
}

export function updateState(updates) {
  Object.assign(state, updates);
}
