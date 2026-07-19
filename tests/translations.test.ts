import { describe, test, expect } from 'vitest';
import {
  t,
  getTranslatedRouteStep,
  getTranslatedGate,
  getTranslatedSection,
  getTranslatedFood,
  getTranslatedReward,
  getTranslatedZone,
  getTranslatedStand
} from '../src/utils/translations';

describe('Multilingual Translation Dictionary', () => {
  test('t should return translation for active language', () => {
    // English
    expect(t('title', 'en')).toBe('ArenaOS 2026');
    expect(t('roleFan', 'en')).toBe('Fan Experience Hub');

    // Spanish
    expect(t('title', 'es')).toBe('ArenaOS 2026');
    expect(t('roleFan', 'es')).toBe('Portal de Experiencia del Fanático');

    // French
    expect(t('title', 'fr')).toBe('ArenaOS 2026');
    expect(t('roleFan', 'fr')).toBe('Hub d\'Expérience des Supporters');
  });

  test('t should fallback to English if key is missing or translation empty', () => {
    expect(t('title', 'es')).toBe('ArenaOS 2026');
  });

  test('dynamic helpers should return correct localized translations', () => {
    // Gate translations
    expect(getTranslatedGate('Gate A (North)', 'es')).toBe('Puerta A (Norte)');
    expect(getTranslatedGate('Gate B (East)', 'fr')).toBe('Porte B (Est)');

    // Section translations
    expect(getTranslatedSection('Section 104', 'es')).toBe('Sección 104');
    expect(getTranslatedSection('Section 102', 'fr')).toBe('Section 102');

    // Route step translations
    expect(getTranslatedRouteStep(0, 'Gate A (North)', 'Section 101', 'en')).toContain('Gate A (North)');
    expect(getTranslatedRouteStep(0, 'Puerta A (Norte)', 'Sección 101', 'es')).toContain('Puerta A (Norte)');

    // Food translations
    expect(getTranslatedFood('World Cup Double Burger', 'es').name).toBe('Hamburguesa Doble Copa Mundial');

    // Reward translations
    expect(getTranslatedReward('FIFA Smart Water Bottle', 'fr')).toBe('Gourde Intelligente FIFA');

    // Zone translations
    expect(getTranslatedZone('North Stand', 'es')).toBe('Tribuna Norte');

    // Stand translations
    expect(getTranslatedStand('c1', 'fr').name).toBe('MetLife Grill (Burgers & Frites)');
  });
});
