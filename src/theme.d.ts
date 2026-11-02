export type Theme = 'light' | 'dark';
export function readSavedTheme(): Theme | null;
export function persistTheme(theme: Theme): void;
export function getInitialTheme(savedTheme: Theme | null, prefersDark: boolean): Theme;
