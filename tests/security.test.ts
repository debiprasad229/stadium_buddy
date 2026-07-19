import { describe, test, expect, vi, beforeAll, afterAll } from 'vitest';
import { sanitizeInput, generateMockToken, validateSessionToken } from '../src/utils/security';

describe('Security Utilities', () => {
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });
  test('sanitizeInput should escape dangerous HTML tags and characters', () => {
    const rawInput = '<script>alert("hack")</script>';
    const sanitized = sanitizeInput(rawInput);
    
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('</script>');
    expect(sanitized).toBe('&lt;script&gt;alert(&quot;hack&quot;)&lt;&#x2F;script&gt;');
  });

  test('sanitizeInput should handle empty inputs gracefully', () => {
    expect(sanitizeInput('')).toBe('');
  });

  test('validateSessionToken should successfully decode generated tokens', () => {
    const token = generateMockToken('ops');
    const decoded = validateSessionToken(token);
    
    expect(decoded).not.toBeNull();
    expect(decoded!.role).toBe('ops');
    expect(decoded!.userId).toBeDefined();
    expect(decoded!.csrfToken).toBeDefined();
  });

  test('validateSessionToken should return null for malformed tokens', () => {
    expect(validateSessionToken('invalid-base-64-string')).toBeNull();
    expect(validateSessionToken('')).toBeNull();
  });
});
