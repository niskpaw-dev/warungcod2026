# WarungCOD - Modular Architecture Cheat Sheet

## Quick Reference

### Key Directories

- `js/` - Core logic modules
- `modules/` - Screen render functions
- `css/` - Stylesheets

### Import Patterns

```javascript
// Constants
import { DEFAULT_MENU, STORAGE_KEYS } from "./constants.js";

// Storage
import { getSettings, saveSettings, getCart } from "./storage.js";

// State
import { state, updateState } from "./state.js";

// Utils
import { formatPrice, generateOrderId } from "./utils.js";

// Operations
import { addToCart, removeCartItem } from "./cart.js";
import { createOrder, updateOrderStatus } from "./orders.js";

// Notifications
import { notify, triggerCartPulse } from "./notifications.js";

// Renders
import { renderHome, renderFoodModal } from "../modules/renderHome.js";
```

### Common Patterns

#### Update State

```javascript
updateState({ screen: "home", cartOpen: false });
```

#### Save Data

```javascript
import { getSettings, saveSettings } from "./storage.js";
const settings = getSettings();
settings.businessName = "New Name";
saveSettings(settings);
```

#### Add to Cart

```javascript
import { addToCart } from "./cart.js";
addToCart("item-id", 2, "notes", {
  notify,
  render: () => app.render(),
});
```

#### Show Notification

```javascript
import { notify } from "./notifications.js";
notify("Pesanan dibuat!", document.getElementById("toast"));
```

#### Handle Action

```javascript
import { handleAction } from "./events.js";

button.addEventListener("click", (event) => {
  handleAction(event, {
    render: () => app.render(),
    notify: (msg) => notify(msg, toastRoot),
    toastRoot,
  });
});
```

### Module Dependencies Graph

```
app.js (orchestrator)
├── state.js
├── storage.js (uses constants.js)
├── pwa.js
├── notifications.js
├── events.js
│   ├── state.js
│   ├── storage.js
│   ├── utils.js (uses storage.js)
│   ├── cart.js (uses storage.js)
│   ├── orders.js (uses storage.js, utils.js)
│   └── notifications.js
├── renderHome.js (uses state, storage, utils)
├── renderCheckoutSuccess.js
├── renderAdmin.js
└── Render callbacks call app.render()
```

### Storage Keys (from constants.js)

```javascript
{
  settings: 'wc_settings',
  menu: 'wc_menu',
  categories: 'wc_categories',
  cart: 'wc_cart',
  orders: 'wc_orders',
  analytics: 'wc_analytics'
}
```

### State Shape

```javascript
{
  screen: 'home|admin|checkout|success|tracking',
  activeCategory: string,
  searchQuery: string,
  modalFood: null|string,
  modalQty: number,
  modalNotes: string,
  cartOpen: boolean,
  checkoutDraft: { name, phone, address, notes },
  orderPreview: null|order,
  trackingOrderId: null|string,
  isAdmin: boolean,
  adminTab: string,
  adminEditing: null|menuItem,
  offline: boolean,
  splashComplete: boolean,
  currentHero: number
}
```

### Render Functions Return HTML String

```javascript
// All render functions return HTML string
const html = renderHome();
const html = renderCheckout();
const html = renderFoodModal("item-id");
// etc
```

### CSS Classes Available

**Glass Effects:**

- `.glass` - Glass container
- `.glass-border` - Inset border
- `.soft-shadow` - Soft shadow
- `.backdrop` - Backdrop filter

**Animations:**

- `.fade-in` - Fade in animation
- `.slide-up` - Slide up animation
- `.pulse-soft` - Soft pulse
- `.shimmer` - Shimmer effect

**Utilities:**

- `.hidden` - Display none
- `.text-muted` - Muted text color
- `.section-divider` - Divider line
- `.hide-scrollbar` - Hide scrollbar

### Common Callbacks Object

```javascript
{
  render: () => void,              // Re-render app
  notify: (msg) => void,           // Show notification
  toastRoot: HTMLElement           // Toast container
}
```

### Adding New Features - Checklist

- [ ] Add constant if needed → `constants.js`
- [ ] Add utility function if needed → `utils.js`
- [ ] Add storage getter/setter if needed → `storage.js`
- [ ] Add event handler → `events.js`
- [ ] Add/update render function → `modules/render*.js`
- [ ] Import & use in appropriate places
- [ ] Test thoroughly

---

**Print this page for quick reference during development!**
