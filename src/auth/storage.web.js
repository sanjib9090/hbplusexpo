// Browser storage persists across reloads. Protect the app from XSS.
export default {
  getItem: key => typeof window === 'undefined' ? null : window.localStorage.getItem(key),
  setItem: (key, value) => { if (typeof window !== 'undefined') window.localStorage.setItem(key, value); },
  removeItem: key => { if (typeof window !== 'undefined') window.localStorage.removeItem(key); }
};
