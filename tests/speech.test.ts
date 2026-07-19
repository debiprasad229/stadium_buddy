import { describe, test, expect, vi, beforeEach } from 'vitest';
import { speakText, stopSpeech } from '../src/utils/speech';

interface MockVoice {
  lang: string;
  name: string;
}

interface MockSpeechSynthesis {
  speak: (utterance: { text: string; lang: string; voice: MockVoice | null; pitch: number; rate: number }) => void;
  cancel: () => void;
  getVoices: () => MockVoice[];
}

interface GlobalWithMock {
  window: {
    speechSynthesis?: MockSpeechSynthesis;
  };
  SpeechSynthesisUtterance?: new (text: string) => {
    text: string;
    lang: string;
    voice: MockVoice | null;
    pitch: number;
    rate: number;
  };
}

describe('Speech Synthesis Utilities', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('speakText does not crash when window.speechSynthesis is undefined', () => {
    const targetGlobal = globalThis as unknown as GlobalWithMock;
    const originalSpeechSynthesis = targetGlobal.window.speechSynthesis;
    delete targetGlobal.window.speechSynthesis;

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(() => speakText('Hello', 'en')).not.toThrow();
    expect(warnSpy).toHaveBeenCalledWith('Speech synthesis is not supported in this environment.');

    if (originalSpeechSynthesis) {
      targetGlobal.window.speechSynthesis = originalSpeechSynthesis;
    }
  });

  test('speakText invokes speechSynthesis.speak when available', () => {
    const mockSpeak = vi.fn();
    const mockCancel = vi.fn();
    const mockGetVoices = vi.fn().mockReturnValue([
      { lang: 'en-US', name: 'Voice 1' },
      { lang: 'es-MX', name: 'Voice 2' }
    ]);

    const targetGlobal = globalThis as unknown as GlobalWithMock;
    targetGlobal.window.speechSynthesis = {
      speak: mockSpeak,
      cancel: mockCancel,
      getVoices: mockGetVoices
    };

    class MockSpeechSynthesisUtterance {
      text: string;
      lang: string = '';
      voice: MockVoice | null = null;
      pitch: number = 1;
      rate: number = 1;
      constructor(text: string) {
        this.text = text;
      }
    }
    targetGlobal.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance as unknown as GlobalWithMock['SpeechSynthesisUtterance'];

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    speakText('Hola', 'es');

    expect(mockCancel).toHaveBeenCalled();
    expect(mockSpeak).toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('stopSpeech cancels current playback', () => {
    const mockCancel = vi.fn();
    const targetGlobal = globalThis as unknown as GlobalWithMock;
    targetGlobal.window.speechSynthesis = {
      speak: vi.fn(),
      cancel: mockCancel,
      getVoices: vi.fn().mockReturnValue([])
    };

    stopSpeech();
    expect(mockCancel).toHaveBeenCalled();
  });
});
