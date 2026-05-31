// Storage abstraction layer
import {
  VERSION,
  STORAGE_KEYS,
  DEFAULT_SETTINGS,
  DEFAULT_CATEGORIES,
  DEFAULT_MENU,
  DEFAULT_ANALYTICS
} from './constants.js';

function loadStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error(`Storage read error for ${key}:`, error);
    return fallback;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Storage write error for ${key}:`, error);
  }
}

export function initStorage() {
  const settings = loadStorage(STORAGE_KEYS.settings, null);
  if (!settings || settings.version !== VERSION) {
    saveStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
  }

  const menu = loadStorage(STORAGE_KEYS.menu, null);
  if (!Array.isArray(menu) || menu.length === 0) {
    saveStorage(STORAGE_KEYS.menu, DEFAULT_MENU);
  }

  const categories = loadStorage(STORAGE_KEYS.categories, null);
  if (!Array.isArray(categories) || categories.length === 0) {
    saveStorage(STORAGE_KEYS.categories, DEFAULT_CATEGORIES);
  }

  const cart = loadStorage(STORAGE_KEYS.cart, []);
  if (!Array.isArray(cart)) {
    saveStorage(STORAGE_KEYS.cart, []);
  }

  const orders = loadStorage(STORAGE_KEYS.orders, []);
  if (!Array.isArray(orders)) {
    saveStorage(STORAGE_KEYS.orders, []);
  }

  const analytics = loadStorage(STORAGE_KEYS.analytics, null);
  if (!analytics || typeof analytics.dailySales !== 'number') {
    saveStorage(STORAGE_KEYS.analytics, DEFAULT_ANALYTICS);
  }
}

// Getters
export function getSettings() {
  return loadStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
}

export function getMenu() {
  return loadStorage(STORAGE_KEYS.menu, DEFAULT_MENU);
}

export function getCategories() {
  return loadStorage(STORAGE_KEYS.categories, DEFAULT_CATEGORIES);
}

export function getCart() {
  return loadStorage(STORAGE_KEYS.cart, []);
}

export function getOrders() {
  return loadStorage(STORAGE_KEYS.orders, []);
}

export function getAnalytics() {
  return loadStorage(STORAGE_KEYS.analytics, DEFAULT_ANALYTICS);
}

// Setters
export function saveSettings(data) {
  saveStorage(STORAGE_KEYS.settings, data);
}

export function saveMenu(data) {
  saveStorage(STORAGE_KEYS.menu, data);
}

export function saveCategories(data) {
  saveStorage(STORAGE_KEYS.categories, data);
}

export function saveCart(data) {
  saveStorage(STORAGE_KEYS.cart, data);
}

export function saveOrders(data) {
  saveStorage(STORAGE_KEYS.orders, data);
}

export function saveAnalytics(data) {
  saveStorage(STORAGE_KEYS.analytics, data);
}

export function clearAllStorage() {
  localStorage.clear();
}
