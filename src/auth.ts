import { API_ENDPOINT } from './config';

export interface AuthUser {
  userId: string;
  email: string;
  fname: string;
  lname: string;
}

const STORAGE_KEY = 'qc_demo_user';

export function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

// Stable, non-reversible demo uid from email. Real apps use their own user IDs.
async function hashEmail(email: string): Promise<string> {
  const data = new TextEncoder().encode(email.toLowerCase().trim());
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16);
}

export async function login(email: string, name: string): Promise<AuthUser> {
  const userId = await hashEmail(email);
  const [fname, ...rest] = name.trim().split(/\s+/);
  const user: AuthUser = { userId, email, fname: fname || '', lname: rest.join(' ') };

  if (API_ENDPOINT) {
    try {
      await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, userId }),
      });
    } catch (e) {
      // ponytail: demo tolerates a missing/unreachable endpoint; widget still renders.
      console.error('demo-login failed:', e);
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
}
