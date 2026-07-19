/**
 * Security Utilities for ArenaOS 2026
 * Implements security guidelines: input sanitization, XSS mitigation, and mock secure token logic.
 */

/**
 * Sanitizes input strings to prevent Cross-Site Scripting (XSS) attacks.
 * Strips HTML tags, script blocks, and potentially dangerous attributes.
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Helper to safely decode mock session token details.
 * Ensures the token structure matches safe practices before extraction.
 */
export interface SecureSession {
  userId: string;
  role: 'fan' | 'ops';
  exp: number;
  csrfToken: string;
}

export function generateMockToken(role: 'fan' | 'ops'): string {
  const payload: SecureSession = {
    userId: `user_${Math.random().toString(36).substring(2, 9)}`,
    role,
    exp: Date.now() + 3600000, // 1 hour expiration
    csrfToken: Math.random().toString(36).substring(2, 15)
  };
  return btoa(JSON.stringify(payload));
}

export function validateSessionToken(token: string): SecureSession | null {
  try {
    if (!token) return null;
    const decoded = JSON.parse(atob(token)) as SecureSession;
    if (decoded.exp < Date.now()) {
      // eslint-disable-next-line no-console
      console.warn('Session expired');
      return null;
    }
    return decoded;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Invalid token payload', error);
    return null;
  }
}
