import * as SecureStore from 'expo-secure-store';
// Chunk values to stay below older iOS Keychain item size limits.
// 400 UTF-16 code units fit within the 2 KB Keychain limit even with Unicode.
const SIZE = 400;
const keyFor = (key, part) => `${key.replace(/[^a-zA-Z0-9._-]/g, '_')}.${part}`;
export default {
  async getItem(key) {
    const count = Number(await SecureStore.getItemAsync(keyFor(key, 'count')));
    if (!Number.isInteger(count) || count < 1 || count > 100) return null;
    const parts = await Promise.all(Array.from({ length: count }, (_, i) => SecureStore.getItemAsync(keyFor(key, i))));
    return parts.some(part => part == null) ? null : parts.join('');
  },
  async setItem(key, value) {
    const count = Math.ceil(value.length / SIZE);
    if (count < 1 || count > 100) throw new Error('Session is too large to store securely.');
    const previous = Number(await SecureStore.getItemAsync(keyFor(key, 'count'))) || 0;
    // Mark the old session unavailable before replacing its chunks.
    await SecureStore.deleteItemAsync(keyFor(key, 'count'));
    for (let i = 0; i < count; i++) await SecureStore.setItemAsync(keyFor(key, i), value.slice(i * SIZE, (i + 1) * SIZE));
    await SecureStore.setItemAsync(keyFor(key, 'count'), String(count));
    for (let i = count; i < Math.min(previous, 100); i++) await SecureStore.deleteItemAsync(keyFor(key, i));
  },
  async removeItem(key) {
    const count = Number(await SecureStore.getItemAsync(keyFor(key, 'count'))) || 0;
    await SecureStore.deleteItemAsync(keyFor(key, 'count'));
    for (let i = 0; i < Math.min(count, 100); i++) await SecureStore.deleteItemAsync(keyFor(key, i));
  }
};
