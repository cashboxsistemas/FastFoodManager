export function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return defaultValue;
  }
}

export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from localStorage:", error);
  }
}

export function clearLocalStorage(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}

// CashBoxFood specific storage keys
export const STORAGE_KEYS = {
  USER: "cashboxfood_user",
  CART: "cashboxfood_cart",
  SALES: "cashboxfood_sales",
  PRODUCTS: "cashboxfood_products",
  CUSTOMERS: "cashboxfood_customers",
  SETTINGS: "cashboxfood_settings",
} as const;
