// Main application initialization and orchestration
import { state, updateState } from './state.js';
import { initStorage } from './storage.js';
import { createManifest, registerServiceWorker } from './pwa.js';
import { notify } from './notifications.js';
import { handleAction } from './events.js';
import { renderSplash, renderHome, renderFoodModal, renderCartDrawer } from '../modules/renderHome.js';
import { renderCheckout, renderSuccess, renderTracking } from '../modules/renderCheckoutSuccess.js';
import { renderAdmin, renderAdminLogin, renderAdminModal } from '../modules/renderAdmin.js';

class WarungCOD {
  constructor() {
    this.app = document.getElementById('app');
    this.toastRoot = document.getElementById('toast');
    this.installCard = document.getElementById('installPrompt');
    this.installButton = document.getElementById('installButton');
    this.manifestLink = document.querySelector('link[rel="manifest"]');
    this.heroInterval = null;
    this.searchTimeout = null;
  }

  init() {
    // Initialize storage
    initStorage();

    // Setup PWA
    createManifest(this.manifestLink);
    registerServiceWorker();

    // Show splash screen
    setTimeout(() => {
      updateState({ splashComplete: true });
      this.render();
    }, 1600);

    // Hero carousel rotation
    this.heroInterval = setInterval(() => {
      updateState({ currentHero: (state.currentHero + 1) % 3 });
      if (state.screen === 'home' && !state.modalFood && !state.cartOpen) {
        this.render();
      }
    }, 7000);

    // Event listeners
    window.addEventListener('hashchange', () => this.handleHashChange());
    window.addEventListener('online', () => {
      updateState({ offline: false });
      notify('Sambungan kembali', this.toastRoot);
      this.render();
    });
    window.addEventListener('offline', () => {
      updateState({ offline: true });
      notify('Anda kini offline', this.toastRoot);
      this.render();
    });

    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      updateState({ installPromptEvent: event, showInstall: true });
      this.installCard.classList.remove('hidden');
    });

    this.installButton.addEventListener('click', () => {
      if (!state.installPromptEvent) return;
      state.installPromptEvent.prompt();
      state.installPromptEvent.userChoice.then(choice => {
        if (choice.outcome === 'accepted') {
          notify('Aplikasi ditambah ke Home Screen', this.toastRoot);
        }
      });
    });

    // Search input listener
    this.setupSearchListener();

    // Initial route
    this.handleHashChange();
  }

  handleHashChange() {
    const raw = location.hash.replace('#', '');
    const [page, param] = raw.split('=');

    if (page === 'track' && param) {
      updateState({ screen: 'tracking', trackingOrderId: param });
    } else if (raw === 'admin') {
      updateState({ screen: 'admin' });
    } else if (raw === 'cart') {
      updateState({ cartOpen: true, screen: 'home' });
    } else {
      updateState({ screen: 'home' });
    }

    this.render();
  }

  setupSearchListener() {
    // This will be reattached on each render
  }

  attachSearchListener() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', event => {
        const val = event.target.value;
        updateState({ searchQuery: val });

        // Debouncing: Hanya render DOM selepas 300ms pengguna berhenti menaip
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
          this.render();
          
          const newSearchInput = document.getElementById('searchInput');
          if (newSearchInput) {
            newSearchInput.focus();
            newSearchInput.setSelectionRange(val.length, val.length);
          }
        }, 300);
      });
    }
  }

  attachEventHandlers() {
    document.querySelectorAll('[data-action]').forEach(el => {
      el.addEventListener('click', event => {
        handleAction(event, {
          render: () => this.render(),
          notify: (msg) => notify(msg, this.toastRoot),
          toastRoot: this.toastRoot
        });
      });
    });

    this.attachSearchListener();

    // Update modal quantity display
    const qtyDisplay = document.getElementById('modalQty');
    if (qtyDisplay && state.modalFood) {
      state.modalQty = Number(qtyDisplay.textContent) || 1;
    }

    // Update modal notes field
    const notesField = document.getElementById('modalNotes');
    if (notesField) {
      notesField.value = state.modalNotes || '';
    }
  }

  render() {
    let html = '';

    if (!state.splashComplete) {
      html = renderSplash();
    } else if (state.screen === 'admin') {
      html = state.isAdmin ? renderAdmin() : renderAdminLogin();
    } else if (state.screen === 'checkout') {
      html = renderCheckout();
    } else if (state.screen === 'success') {
      html = renderSuccess();
    } else if (state.screen === 'tracking') {
      html = renderTracking();
    } else {
      html = renderHome();
    }

    // Add overlays
    if (state.modalFood) {
      html += renderFoodModal(state.modalFood);
    }

    if (state.cartOpen) {
      html += renderCartDrawer();
    }

    if (state.isAdmin && state.adminEditing) {
      html += renderAdminModal();
    }

    this.app.innerHTML = html;
    this.attachEventHandlers();
  }

  destroy() {
    if (this.heroInterval) {
      clearInterval(this.heroInterval);
    }
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new WarungCOD();
  app.init();

  // Store app instance for debugging
  window.warungCOD = app;
});
