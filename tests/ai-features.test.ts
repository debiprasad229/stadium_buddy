import { describe, test, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import chatHandler from '../api/chat';
import copilotHandler from '../api/copilot';
import navigationHandler from '../api/navigation';
import ecoHandler from '../api/eco';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('AI Endpoint Handlers', () => {
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    mockFetch.mockClear();
  });

  // Helper to construct a mock Vercel Response
  function createMockResponse() {
    let responseStatus = 200;
    let responseHeaders: Record<string, string[]> = {};
    let responseData: any = null;

    const res = {
      status(code: number) {
        responseStatus = code;
        return this;
      },
      send(data: any) {
        responseData = data;
        return this;
      },
      json(data: any) {
        responseData = data;
        return this;
      },
      setHeader(name: string, value: string[]) {
        responseHeaders[name] = value;
        return this;
      },
      get statusVal() { return responseStatus; },
      get headersVal() { return responseHeaders; },
      get dataVal() { return responseData; }
    };
    return res;
  }

  describe('api/chat', () => {
    test('success path', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: 'Hello fan!' }] } }]
        })
      });

      const req = {
        method: 'POST',
        body: { messages: [{ role: 'user', text: 'hi' }], currentLang: 'en' }
      };
      const res = createMockResponse();

      await chatHandler(req, res);

      expect(res.statusVal).toBe(200);
      expect(res.dataVal).toEqual({ text: 'Hello fan!' });
    });

    test('invalid method', async () => {
      const req = { method: 'GET' };
      const res = createMockResponse();

      await chatHandler(req, res);

      expect(res.statusVal).toBe(405);
      expect(res.headersVal['Allow']).toContain('POST');
    });

    test('missing payload', async () => {
      const req = { method: 'POST', body: {} };
      const res = createMockResponse();

      await chatHandler(req, res);

      expect(res.statusVal).toBe(400);
      expect(res.dataVal.error).toContain('messages');
    });

    test('gemini API error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        text: async () => 'Service Unavailable'
      });

      const req = {
        method: 'POST',
        body: { messages: [], currentLang: 'en' }
      };
      const res = createMockResponse();

      await chatHandler(req, res);

      expect(res.statusVal).toBe(500);
      expect(res.dataVal.error).toContain('Gemini REST API error');
    });
  });

  describe('api/copilot', () => {
    test('success path', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: '[{"id": "1"}]' }] } }]
        })
      });

      const req = {
        method: 'POST',
        body: { telemetry: { crowdCount: 1000 }, currentLang: 'en' }
      };
      const res = createMockResponse();

      await copilotHandler(req, res);

      expect(res.statusVal).toBe(200);
      expect(res.dataVal).toBe('[{"id": "1"}]');
    });

    test('invalid method', async () => {
      const req = { method: 'GET' };
      const res = createMockResponse();

      await copilotHandler(req, res);

      expect(res.statusVal).toBe(405);
    });

    test('missing telemetry', async () => {
      const req = { method: 'POST', body: {} };
      const res = createMockResponse();

      await copilotHandler(req, res);

      expect(res.statusVal).toBe(400);
    });

    test('gemini error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Bad Request'
      });

      const req = {
        method: 'POST',
        body: { telemetry: {}, currentLang: 'en' }
      };
      const res = createMockResponse();

      await copilotHandler(req, res);

      expect(res.statusVal).toBe(500);
    });
  });

  describe('api/navigation', () => {
    test('success path', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: '[]' }] } }]
        })
      });

      const req = {
        method: 'POST',
        body: { gate: 'A', section: '101', currentLang: 'en' }
      };
      const res = createMockResponse();

      await navigationHandler(req, res);

      expect(res.statusVal).toBe(200);
    });

    test('invalid method', async () => {
      const req = { method: 'PUT' };
      const res = createMockResponse();

      await navigationHandler(req, res);

      expect(res.statusVal).toBe(405);
    });

    test('missing payload', async () => {
      const req = { method: 'POST', body: { gate: 'A' } };
      const res = createMockResponse();

      await navigationHandler(req, res);

      expect(res.statusVal).toBe(400);
    });
  });

  describe('api/eco', () => {
    test('success path', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: 'Recycle cups!' }] } }]
        })
      });

      const req = {
        method: 'POST',
        body: { query: 'rules', currentLang: 'en' }
      };
      const res = createMockResponse();

      await ecoHandler(req, res);

      expect(res.statusVal).toBe(200);
      expect(res.dataVal).toEqual({ text: 'Recycle cups!' });
    });

    test('invalid method', async () => {
      const req = { method: 'DELETE' };
      const res = createMockResponse();

      await ecoHandler(req, res);

      expect(res.statusVal).toBe(405);
    });

    test('missing payload', async () => {
      const req = { method: 'POST', body: {} };
      const res = createMockResponse();

      await ecoHandler(req, res);

      expect(res.statusVal).toBe(400);
    });
  });
});
