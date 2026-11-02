export function readSavedTheme() {
  try {
    const saved = window.localStorage.getItem('qc-theme');
    return saved === 'light' || saved === 'dark' ? saved : null;
  } catch {
    return null;
  }
}

export function persistTheme(theme) {
  try {
    window.localStorage.setItem('qc-theme', theme);
  } catch {
    // Storage can be unavailable; the in-memory theme still applies.
  }
}

export function getInitialTheme(savedTheme, prefersDark) {
  return savedTheme ?? (prefersDark ? 'dark' : 'light');
}
