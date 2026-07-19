import { describe, test, expect, vi, beforeEach } from 'vitest';
import { speakText, stopSpeech } from '../src/utils/speech';

describe('Speech Synthesis Utilities', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('speakText does not crash when window.speechSynthesis is undefined', () => {
    const originalSpeechSynthesis = (global as any).window.speechSynthesis;
    delete (global as any).window.speechSynthesis;

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(() => speakText('Hello', 'en')).not.toThrow();
    expect(warnSpy).toHaveBeenCalledWith('Speech synthesis is not supported in this environment.');

    if (originalSpeechSynthesis) {
      (global as any).window.speechSynthesis = originalSpeechSynthesis;
    }
  });

  test('speakText invokes speechSynthesis.speak when available', () => {
    const mockSpeak = vi.fn();
    const mockCancel = vi.fn();
    const mockGetVoices = vi.fn().mockReturnValue([
      { lang: 'en-US', name: 'Voice 1' },
      { lang: 'es-MX', name: 'Voice 2' }
    ]);

    (global as any).window.speechSynthesis = {
      speak: mockSpeak,
      cancel: mockCancel,
      getVoices: mockGetVoices
    };

    class MockSpeechSynthesisUtterance {
      text: string;
      lang: string = '';
      voice: any = null;
      pitch: number = 1;
      rate: number = 1;
      constructor(text: string) {
        this.text = text;
      }
    }
    (global as any).SpeechSynthesisUtterance = MockSpeechSynthesisUtterance as any;

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    speakText('Hola', 'es');

    expect(mockCancel).toHaveBeenCalled();
    expect(mockSpeak).toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('stopSpeech cancels current playback', () => {
    const mockCancel = vi.fn();
    (global as any).window.speechSynthesis = {
      cancel: mockCancel
    };

    stopSpeech();
    expect(mockCancel).toHaveBeenCalled();
  });
});
