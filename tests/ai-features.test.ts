import { describe, test, expect, vi, beforeEach } from 'vitest';
import navigationHandler from '../api/navigation';
import ecoHandler from '../api/eco';

// Define a simple mock for global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('AI Integration Endpoints', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  test('navigationHandler returns correct route steps on successful Gemini call', async () => {
    const mockApiResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify([
                  { text: 'Walk through Gate A', distance: '10m' },
                  { text: 'Turn left to Section 102', distance: '30m' }
                ])
              }
            ]
          }
        }
      ]
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    });

    const req = {
      method: 'POST',
      body: {
        gate: 'Gate A (North)',
        section: 'Section 102',
        currentLang: 'en'
      }
    };

    let responseStatus = 200; // default Vercel status is 200 unless set otherwise
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
      setHeader() {
        return this;
      }
    };

    await navigationHandler(req, res);

    expect(mockFetch).toHaveBeenCalled();
    expect(responseStatus).toBe(200);
    const parsed = JSON.parse(responseData);
    expect(parsed).toBeInstanceOf(Array);
    expect(parsed[0].text).toBe('Walk through Gate A');
  });

  test('ecoHandler returns environmental advice from Gemini API', async () => {
    const mockApiResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: 'You can recycle plastic cups in the green bins located near concession stands.'
              }
            ]
          }
        }
      ]
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    });

    const req = {
      method: 'POST',
      body: {
        query: 'How to recycle cups?',
        currentLang: 'en'
      }
    };

    let responseStatus = 200;
    let responseData: any = null;

    const res = {
      status(code: number) {
        responseStatus = code;
        return this;
      },
      json(data: any) {
        responseData = data;
        return this;
      },
      setHeader() {
        return this;
      }
    };

    await ecoHandler(req, res);

    expect(mockFetch).toHaveBeenCalled();
    expect(responseStatus).toBe(200);
    expect(responseData.text).toBe('You can recycle plastic cups in the green bins located near concession stands.');
  });
});
