// App version
export const VERSION = 1;

// Storage keys
export const STORAGE_KEYS = {
  settings: 'wc_settings',
  menu: 'wc_menu',
  categories: 'wc_categories',
  cart: 'wc_cart',
  orders: 'wc_orders',
  analytics: 'wc_analytics'
};

// Storage limits
// Digunakan untuk mengawal saiz fail JSON supaya mengelakkan QuotaExceededError di localStorage
export const STORAGE_LIMITS = {
  maxOrdersStored: 100
};

// Default settings
export const DEFAULT_SETTINGS = {
  version: 1,
  businessName: 'WarungCOD',
  ownerName: 'WarungCOD',
  whatsapp: '60123456789',
  currency: 'RM',
  deliveryFee: 3,
  deliveryEta: '20-35 min',
  tagLine: 'Cepat. Mudah. COD-ready.',
  adminPassword: 'warung2026', // TODO/WARNING: Plaintext di frontend. Pertimbangkan "hashing" mudah atau elak simpan data sensitif klien-sisi.
  heroMessage: 'Food ordering made effortless for small warung owners.',
  theme: 'dark'
};

// Default categories
export const DEFAULT_CATEGORIES = [
  { id: 'all', label: 'Semua', tone: 'bg-orange-500/12 text-orange-200' },
  { id: 'main', label: 'Nasi & Lauk', tone: 'bg-rose-500/12 text-rose-200' },
  { id: 'snacks', label: 'Snek', tone: 'bg-violet-500/12 text-violet-200' },
  { id: 'drinks', label: 'Minuman', tone: 'bg-amber-500/12 text-amber-200' },
  { id: 'sweet', label: 'Manis', tone: 'bg-cyan-500/12 text-cyan-200' }
];

// Default menu items
export const DEFAULT_MENU = [
  { id: 'nasi-lemak', name: 'Nasi Lemak Special', category: 'main', price: 12, unit: 'plate', stock: true, favorite: true, description: 'Nasi lemak wangi, telur, ayam goreng rangup dan sambal istimewa.', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 560"%3E%3Cdefs%3E%3ClinearGradient id="g1" x1="0" x2="1" y1="0" y2="1"%3E%3Cstop offset="0%25" stop-color="%23ffb347"/%3E%3Cstop offset="100%25" stop-color="%23ffcc33"/%3E%3C/linearGradient%3E%3Cfilter id="f1" x="-20%25" y="-20%25" width="140%25" height="140%25"%3E%3CfeGaussianBlur stdDeviation="16"/%3E%3C/filter%3E%3C/defs%3E%3Crect width="720" height="560" rx="52" fill="url(%23g1)"/%3E%3Ccircle cx="360" cy="280" r="160" fill="rgba(255,255,255,0.22)" filter="url(%23f1)"/%3E%3Ctext x="360" y="310" font-family="Inter, sans-serif" font-size="60" fill="white" font-weight="700" text-anchor="middle">Nasi Lemak</text%3E%3C/svg%3E' },
  { id: 'mee-udang', name: 'Mee Udang Basah', category: 'main', price: 14, unit: 'plate', stock: true, favorite: false, description: 'Mee segar dan udang manis dalam sup pedas beraroma.', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 560"%3E%3Cdefs%3E%3ClinearGradient id="g2" x1="0" x2="1" y1="0" y2="1"%3E%3Cstop offset="0%25" stop-color="%23ff7a18"/%3E%3Cstop offset="100%25" stop-color="%23ff3d6d"/%3E%3C/linearGradient%3E%3Cfilter id="f2" x="-20%25" y="-20%25" width="140%25" height="140%25"%3E%3CfeGaussianBlur stdDeviation="16"/%3E%3C/filter%3E%3C/defs%3E%3Crect width="720" height="560" rx="52" fill="url(%23g2)"/%3E%3Ccircle cx="390" cy="300" r="180" fill="rgba(255,255,255,0.17)" filter="url(%23f2)"/%3E%3Ctext x="360" y="320" font-family="Inter, sans-serif" font-size="56" fill="white" font-weight="700" text-anchor="middle">Mee Udang</text%3E%3C/svg%3E' },
  { id: 'burger-wagyu', name: 'Burger Wagyu Riz', category: 'snacks', price: 11, unit: 'pcs', stock: true, favorite: false, description: 'Burger mini premium daging wagyu, sos coklat cili, dan sayuran segar.', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 560"%3E%3Cdefs%3E%3ClinearGradient id="g3" x1="0" x2="1" y1="0" y2="1"%3E%3Cstop offset="0%25" stop-color="%23a044ff"/%3E%3Cstop offset="100%25" stop-color="%236a00f4"/%3E%3C/linearGradient%3E%3Cfilter id="f3" x="-20%25" y="-20%25" width="140%25" height="140%25"%3E%3CfeGaussianBlur stdDeviation="16"/%3E%3C/filter%3E%3C/defs%3E%3Crect width="720" height="560" rx="52" fill="url(%23g3)"/%3E%3Ccircle cx="330" cy="260" r="150" fill="rgba(255,255,255,0.18)" filter="url(%23f3)"/%3E%3Ctext x="360" y="290" font-family="Inter, sans-serif" font-size="52" fill="white" font-weight="700" text-anchor="middle">Burger Wagyu</text%3E%3C/svg%3E' },
  { id: 'teh-o-ais', name: 'Teh O Ais Limau', category: 'drinks', price: 4, unit: 'glass', stock: true, favorite: true, description: 'Teh tarik sejuk dengan hirisan limau nipis dan manisan lembut.', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 560"%3E%3Cdefs%3E%3ClinearGradient id="g4" x1="0" x2="1" y1="0" y2="1"%3E%3Cstop offset="0%25" stop-color="%2337d5d6"/%3E%3Cstop offset="100%25" stop-color="%23029d9f"/%3E%3C/linearGradient%3E%3Cfilter id="f4" x="-20%25" y="-20%25" width="140%25" height="140%25"%3E%3CfeGaussianBlur stdDeviation="16"/%3E%3C/filter%3E%3C/defs%3E%3Crect width="720" height="560" rx="52" fill="url(%23g4)"/%3E%3Ccircle cx="360" cy="280" r="160" fill="rgba(255,255,255,0.16)" filter="url(%23f4)"/%3E%3Ctext x="360" y="310" font-family="Inter, sans-serif" font-size="58" fill="white" font-weight="700" text-anchor="middle">Teh O Ais</text%3E%3C/svg%3E' },
  { id: 'puding-coklat', name: 'Puding Coklat Lava', category: 'sweet', price: 8, unit: 'portion', stock: true, favorite: false, description: 'Puding coklat meleleh dengan ais krim vanila dan serbuk badam.', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 560"%3E%3Cdefs%3E%3ClinearGradient id="g5" x1="0" x2="1" y1="0" y2="1"%3E%3Cstop offset="0%25" stop-color="%23ff6363"/%3E%3Cstop offset="100%25" stop-color="%23ffb347"/%3E%3C/linearGradient%3E%3Cfilter id="f5" x="-20%25" y="-20%25" width="140%25" height="140%25"%3E%3CfeGaussianBlur stdDeviation="16"/%3E%3C/filter%3E%3C/defs%3E%3Crect width="720" height="560" rx="52" fill="url(%23g5)"/%3E%3Ccircle cx="360" cy="280" r="150" fill="rgba(255,255,255,0.18)" filter="url(%23f5)"/%3E%3Ctext x="360" y="300" font-family="Inter, sans-serif" font-size="54" fill="white" font-weight="700" text-anchor="middle">Puding Lava</text%3E%3C/svg%3E' }
];

// Default analytics
export const DEFAULT_ANALYTICS = {
  dailySales: 0,
  orders: 0,
  bestSeller: '',
  repeatCustomer: 0
};

// Order statuses
export const ORDER_STATUSES = [
  'Pending',
  'Preparing',
  'Out for Delivery',
  'Delivered'
];

// Admin actions
export const ADMIN_ACTIONS = [
  'Preparing',
  'Out for Delivery',
  'Delivered',
  'Customer Unreachable'
];

// Admin tabs
export const ADMIN_TABS = ['dashboard', 'menu', 'categories', 'settings', 'orders'];

// Hero carousel messages
export const HERO_MESSAGES = [
  { title: 'Order Cepat, COD Siap', subtitle: 'Menu siap dalam 30 minit. Hantar terus ke WhatsApp.', action: 'Lihat Menu' },
  { title: 'Warung Digital tanpa Kerumitan', subtitle: 'Boleh guna offline selepas muat turun. Sesuai untuk semua warung.', action: 'Mula Pesan' },
  { title: 'Bayar Cash on Delivery', subtitle: 'Pelanggan hanya perlu tekan dan hantar order melalui WhatsApp.', action: 'Checkout Sekarang' }
];
