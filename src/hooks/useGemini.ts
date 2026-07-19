import { useState } from 'react';
import type { Language } from '../utils/translations';
import { sanitizeInput } from '../utils/security';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export function useGemini(currentLang: Language) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: getWelcomeMessage(currentLang)
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKeyState] = useState<string>(() => {
    return sessionStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
  });

  const saveApiKey = (key: string) => {
    setApiKeyState(key);
    sessionStorage.setItem('gemini_api_key', key);
  };

  const sendMessage = async (userInput: string) => {
    if (!userInput.trim()) return;
    
    // 1. Secure & Sanitize User Input
    const sanitized = sanitizeInput(userInput);
    
    const newMessages = [...messages, { role: 'user', text: sanitized } as ChatMessage];
    setMessages(newMessages);
    setLoading(true);

    try {
      // 2. Server-side Proxy Integration (API key is hidden on the server)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: newMessages,
          currentLang
        })
      });

      if (!response.ok) {
        throw new Error('API server returned an error.');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'model', text: data.text }]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Gemini API Error:', error);
      const errorMsg = currentLang === 'es' 
        ? 'Error al conectar con la IA de Gemini. Por favor, comprueba tu clave API.' 
        : currentLang === 'fr' 
        ? 'Erreur lors de la connexion à l\'IA de Gemini. Veuillez vérifier votre clé API.' 
        : 'Error connecting to Gemini API. Please check your API key configuration.';
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: errorMsg }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'model',
        text: getWelcomeMessage(currentLang)
      }
    ]);
  };

  return {
    messages,
    loading,
    apiKey,
    saveApiKey,
    sendMessage,
    clearChat
  };
}

function getWelcomeMessage(lang: Language): string {
  switch (lang) {
    case 'es':
      return '¡Hola! Soy tu Asistente Inteligente de ArenaOS para la Copa Mundial de la FIFA 2026. ¿En qué puedo ayudarte hoy? (ej. encontrar asientos, transporte, sostenibilidad)';
    case 'fr':
      return 'Bonjour! Je suis votre Assistant Intelligent ArenaOS pour la Coupe du Monde de la FIFA 2026. Comment puis-je vous aider aujourd\'hui? (ex: trouver des sièges, transport, recyclage)';
    default:
      return 'Hello! I am your ArenaOS Smart Assistant for the FIFA World Cup 2026. How can I help you today? (e.g., finding seats, transit, concessions, sustainability)';
  }
}
