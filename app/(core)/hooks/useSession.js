export const setSessionValue = (key, value) => {
  try {
    if (typeof window === 'undefined') return; // SSR safety

    // Convert objects/arrays to JSON
    const stringValue =
      typeof value === 'object' ? JSON.stringify(value) : String(value);

    // Optional: encode (avoid XSS from session data)
    const encoded = btoa(encodeURIComponent(stringValue));

    sessionStorage.setItem(key, encoded);
    return true;
  } catch (error) {
    console.error(`Error setting session value for key "${key}":`, error);
    return false;
  }
};


export const getSessionValue = (key, defaultValue = null) => {
  try {
    if (typeof window === 'undefined') return defaultValue;

    const raw = sessionStorage.getItem(key);
    if (!raw) return defaultValue;

    // Decode if base64-encoded
    const decoded = decodeURIComponent(atob(raw));

    // Try parsing JSON
    try {
      return JSON.parse(decoded);
    } catch {
      return decoded; // Not JSON, return raw string
    }
  } catch (error) {
    console.error(`Error getting session value for key "${key}":`, error);
    return defaultValue;
  }
};


export const removeSessionValue = (key) => {
  try {
    sessionStorage.removeItem(key);
  } catch (e) {
    console.error(`Error removing session key "${key}":`, e);
  }
};

export const clearSession = () => {
  try {
    sessionStorage.clear();
  } catch (e) {
    console.error('Error clearing session storage:', e);
  }
};



