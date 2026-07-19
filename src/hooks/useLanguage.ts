import { useState } from 'react';
import { t } from '../utils/translations';
import type { Language } from '../utils/translations';

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('arena_lang');
    if (saved === 'en' || saved === 'es' || saved === 'fr') {
      return saved;
    }
    return 'en'; // Default language
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('arena_lang', lang);
  };

  const translate = (key: Parameters<typeof t>[0]) => {
    return t(key, language);
  };

  return { language, setLanguage, t: translate };
}
