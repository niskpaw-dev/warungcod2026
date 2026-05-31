# WarungCOD - Modular Refactoring Guide

## Project Structure

Kami telah merefaktor aplikasi monolitik menjadi struktur modular yang lebih terkelola dan maintainable.

```
WEB APP COD 2026/
├── index-modular.html          # Entry point (ganti dari index.html)
├── js/                         # JavaScript modules
│   ├── app.js                 # Main app orchestration
│   ├── constants.js           # Constants & defaults
│   ├── storage.js             # LocalStorage abstraction
│   ├── state.js               # Global state management
│   ├── utils.js               # Utility functions
│   ├── cart.js                # Cart operations
│   ├── orders.js              # Orders management
│   ├── notifications.js       # Toast notifications
│   ├── pwa.js                 # PWA setup (manifest & SW)
│   └── events.js              # Event handler dispatch
├── modules/                   # Render modules
│   ├── renderHome.js          # Home page render
│   ├── renderCheckoutSuccess.js # Checkout, Success, Tracking
│   └── renderAdmin.js         # Admin panel render
├── css/                       # Stylesheets
│   ├── base.css              # Base styles & utilities
│   └── animations.css        # Animations & keyframes
└── README.md                 # Documentation
```

## Key Improvements

### 1. **Separation of Concerns**

- **Constants**: Semua default values dan config terpusat
- **Storage**: Abstraksi untuk localStorage operations
- **State**: Centralized state management
- **Utils**: Reusable functions (formatting, validation, dll)
- **Cart**: Semua operasi cart terisolasi
- **Orders**: Order management logic terpisah
- **Events**: Semua event handlers dalam satu modul
- **Render**: Setiap halaman dalam modul render terpisah

### 2. **CSS Organization**

- **base.css**: Styles dasar, utilities, glass effects
- **animations.css**: Semua keyframes dan animations
- Lebih mudah untuk maintenance dan tweaking

### 3. **Module Communication**

Modules berkomunikasi melalui:

- **Imports/Exports**: Static dependencies
- **Callbacks**: Dynamic behavior passing
- **State Updates**: Centralized state changes

## File Descriptions

### Core Modules (js/)

#### constants.js

```javascript
// Exports:
-VERSION -
  STORAGE_KEYS -
  DEFAULT_SETTINGS -
  DEFAULT_CATEGORIES -
  DEFAULT_MENU -
  DEFAULT_ANALYTICS -
  ORDER_STATUSES -
  ADMIN_ACTIONS -
  ADMIN_TABS -
  HERO_MESSAGES;
```

#### storage.js

```javascript
// Exports storage functions:
initStorage(); // Initialize all storage
getSettings(); // Get app settings
getMenu(); // Get menu items
getCategories(); // Get categories
getCart(); // Get cart items
getOrders(); // Get orders
getAnalytics(); // Get analytics data
saveSettings(data); // Save settings
saveMenu(data); // Save menu
// ... dan semua save functions lainnya
clearAllStorage(); // Clear all localStorage
```

#### state.js

```javascript
// Exports:
state = {
  // Global state object
  screen,
  activeCategory,
  searchQuery,
  modalFood,
  cartOpen,
  isAdmin,
  // ... dll
};
resetState(); // Reset state to defaults
updateState(updates); // Partial state update
```

#### utils.js

```javascript
// Exports utility functions:
formatPrice(value); // Format currency
escapeHtml(text); // HTML escape
searchMenu(query, category); // Filter menu items
getFeaturedItems(); // Get featured items
getBestSellers(); // Get best sellers
generateWhatsAppLink(order); // Generate WA link
generateOrderId(); // Generate unique order ID
createTrackingToken(); // Create tracking token
updateAnalyticsForOrder(order); // Update analytics
```

#### cart.js

```javascript
// Exports cart functions:
addToCart(itemId, qty, notes, callbacks);
updateCartItem(itemId, quantity);
removeCartItem(itemId, callbacks);
clearCart();
getCartItemCount();
```

#### orders.js

```javascript
// Exports order functions:
createOrder(callbacks); // Create new order
getOrderById(orderId); // Get order by ID
updateOrderStatus(id, status, cb); // Update order status
getOrdersByStatus(status); // Filter orders by status
getLatestOrders(limit); // Get recent orders
```

#### notifications.js

```javascript
// Exports:
notify(message, toastRoot); // Show toast notification
triggerCartPulse(buttonId); // Pulse cart button animation
```

#### pwa.js

```javascript
// Exports PWA functions:
createManifest(manifestLink); // Setup web app manifest
registerServiceWorker(); // Register service worker
```

#### events.js

```javascript
// Main exports:
handleAction(event, callbacks)    // Dispatch all actions

// Supported actions:
hero, category, view, close-modal, qty, add-to-cart,
checkout, back, confirm-order, whatsapp-order, track-order,
home, cart, close-cart, cart-update, cart-remove, track-message,
admin, admin-login, admin-logout, admin-tab,
admin-add-menu, admin-edit-menu, admin-delete-menu, admin-save-menu,
admin-add-category, admin-delete-category, admin-save-settings,
admin-update-order, admin-export, admin-reset
```

#### app.js

```javascript
// Main WarungCOD class orchestrates everything:
new WarungCOD()
  .init() // Initialize app
  .render() // Render current screen
  .attachEventHandlers()
  .destroy(); // Cleanup
```

### Render Modules (modules/)

#### renderHome.js

```javascript
renderSplash(); // Splash screen
renderHome(); // Home page with menu
renderFoodModal(); // Food detail modal
renderCartDrawer(); // Cart bottom sheet
```

#### renderCheckoutSuccess.js

```javascript
renderCheckout(); // Checkout form
renderSuccess(); // Order success page
renderTracking(); // Order tracking page
```

#### renderAdmin.js

```javascript
renderAdminLogin(); // Admin login
renderAdmin(); // Admin dashboard
renderAdminDashboard();
renderAdminMenu();
renderAdminCategories();
renderAdminSettings();
renderAdminOrders();
renderAdminModal(); // Edit menu modal
```

## Usage Guide

### How to Add a New Feature

1. **Add a new action handler** dalam `events.js`:

```javascript
'my-new-action': () => {
  // Your logic here
  updateState({ /* state changes */ });
  callbacks?.render?.();
}
```

2. **Add the data-action attribute** dalam render function:

```html
<button data-action="my-new-action" data-id="123">Click me</button>
```

3. **Emit from any module** dengan `updateState()` dan `callbacks?.render?.()`

### How to Add a New Utility Function

1. **Add function dalam** `utils.js` atau modul khusus
2. **Export function** dengan ES6 export
3. **Import dalam modul yang membutuhkan**:

```javascript
import { myFunction } from "./utils.js";
```

### How to Modify Storage

1. **Update constants** dalam `constants.js` jika menambah default data baru
2. **Gunakan storage functions** dari `storage.js`:

```javascript
import { getSettings, saveSettings } from "./storage.js";

const settings = getSettings();
settings.newProperty = "value";
saveSettings(settings);
```

## State Management

Semua perubahan state menggunakan `updateState()`:

```javascript
import { updateState } from "./state.js";

// Ubah satu atau beberapa properties
updateState({
  screen: "home",
  cartOpen: false,
  activeCategory: "all",
});
```

State auto-subscribe melalui `callbacks?.render?.()` yang dipanggil setiap kali ada perubahan.

## Event Flow

```
User Click
    ↓
data-action captured
    ↓
handleAction() dispatches
    ↓
Handler updates state & calls callbacks
    ↓
callbacks?.render?.()
    ↓
renderApp() called
    ↓
Appropriate render function executes
    ↓
New HTML injected ke #app
    ↓
attachEventHandlers() rebinds listeners
```

## Performance Optimizations

1. **Module splitting**: Smaller, cacheable files
2. **Lazy rendering**: Only render active screen
3. **Event delegation**: Single listener for all [data-action] buttons
4. **Storage caching**: Data loaded once per session
5. **Efficient re-renders**: Only affected parts updated

## Migrasi dari Old Version

1. **Backup** `index.html` original
2. **Ganti reference** dari `index.html` ke `index-modular.html`
3. **Update any external links** yang mereferensi halaman
4. **Test all features** sebelum go live

## Development Tips

### Debug Mode

```javascript
// Access app instance
window.warungCOD;

// Check state
console.log(state);

// Check storage
console.log(localStorage);
```

### Add Logging

Tambah logs dalam handler:

```javascript
'my-action': () => {
  console.log('Action triggered:', { action, id, status });
  updateState({ /* ... */ });
}
```

### CSS Tweaks

- Global styles: `base.css`
- Animations: `animations.css`
- Tailwind classes: Used throughout (via CDN)

## Future Improvements

1. **Framework migration**: React/Vue untuk better state management
2. **Component library**: Reusable UI components
3. **Type safety**: TypeScript untuk type checking
4. **Testing**: Unit tests untuk critical functions
5. **Build step**: Bundler untuk production optimization
6. **API integration**: Replace localStorage dengan backend

## Troubleshooting

### Action tidak bekerja?

- Cek `data-action` attribute benar
- Verify handler exists dalam `events.js`
- Check console untuk errors

### State tidak update?

- Pastikan menggunakan `updateState()` bukan direct assignment
- Verify `callbacks?.render?.()` dipanggil

### Storage tidak persist?

- Check browser privacy settings
- Verify `initStorage()` called di app init
- Check localStorage quota

---

**Refactored with ❤️ for better maintainability**
