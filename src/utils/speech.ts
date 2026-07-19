/**
 * Speech Synthesis Accessibility Helper for ArenaOS 2026
 * Handles screen reader playback for map directions, concessions, and chatbots.
 */
import type { Language } from './translations';

/**
 * Speaks the provided text in a voice matching the active language.
 */
export function speakText(text: string, lang: Language): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    // eslint-disable-next-line no-console
    console.warn('Speech synthesis is not supported in this environment.');
    return;
  }

  // Cancel any ongoing speech to avoid overlaps
  window.speechSynthesis.cancel();

  // Create utterance
  const utterance = new SpeechSynthesisUtterance(text);

  // Map language codes to BCP 47 locales
  const localeMap: Record<Language, string> = {
    en: 'en-US',
    es: 'es-MX',
    fr: 'fr-CA'
  };
  utterance.lang = localeMap[lang] || 'en-US';

  // Attempt to select a high-quality voice for the target language
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(
    (voice) =>
      voice.lang.toLowerCase() === utterance.lang.toLowerCase() ||
      voice.lang.toLowerCase().startsWith(utterance.lang.substring(0, 2).toLowerCase())
  );
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  // Set standard pitch and rate for clear reading
  utterance.pitch = 1.0;
  utterance.rate = 0.95; // Slightly slower for better intelligibility

  window.speechSynthesis.speak(utterance);
}

/**
 * Stops any active speech synthesis immediately.
 */
export function stopSpeech(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
