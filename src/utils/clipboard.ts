// Lightweight clipboard wrapper that tries expo-clipboard first, then falls back.
export async function copyText(value: string) {
  // Attempt expo-clipboard via runtime require to avoid TypeScript module resolution errors
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const clipboard = require('expo-clipboard');
    if (clipboard && typeof clipboard.setStringAsync === 'function') {
      await clipboard.setStringAsync(value);
      return;
    }
  } catch (e) {
    // ignore and try next fallback
  }

  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const RNClipboard = require('@react-native-clipboard/clipboard');
    if (RNClipboard && typeof RNClipboard.setString === 'function') {
      RNClipboard.setString(value);
      return;
    }
  } catch (e) {
    // ignore and no-op
  }
  // if no clipboard available, no-op
}

export default { copyText };
