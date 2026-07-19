import React, { useState, useRef, useEffect } from 'react';
import { useGemini } from '../../hooks/useGemini';
import type { Language } from '../../utils/translations';
import { Send, Trash2, Cpu, Volume2 } from 'lucide-react';
import { speakText } from '../../utils/speech';

interface AIChatbotProps {
  currentLang: Language;
  t: (key: any) => string;
}

/**
 * AIChatbot Component
 * Implements a multilingual virtual assistant using Gemini 3.0 Flash.
 * Allows stadium fans to ask questions and receive dynamic answers in real-time.
 * Wrapped in React.memo for render efficiency.
 */
const AIChatbotComponent: React.FC<AIChatbotProps> = ({ currentLang, t }) => {
  const { messages, loading, sendMessage, clearChat } = useGemini(currentLang);
  const [inputText, setInputText] = useState('');
  
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Suggestions depending on the active language
  const suggestions = currentLang === 'es' 
    ? ['¿Cómo llegar a mi asiento?', '¿Cómo reciclo mi vaso?', 'Tiempo de espera de comida', 'Traslados al aeropuerto']
    : currentLang === 'fr'
    ? ['Comment trouver mon siège ?', 'Comment recycler mon gobelet ?', 'Temps d\'attente nourriture', 'Navettes aéroport']
    : ['How do I find my seat?', 'How to recycle my cup?', 'Food queue wait times', 'Airport shuttle schedule'];

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, loading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;
    sendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '480px' }}>
      
      {/* Chat Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu style={{ color: 'var(--primary)' }} />
            {t('assistantTitle')}
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }}></span>
            Live Gemini Model (3.0 Flash)
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={clearChat}
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--danger-bg)',
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center'
            }}
            aria-label="Clear Chat Log"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div ref={messagesContainerRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '5px', marginBottom: '15px' }}>
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={index}
              style={{
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                background: isUser ? 'var(--gradient-primary)' : 'var(--bg-tertiary)',
                color: isUser ? '#000' : 'var(--text-primary)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                borderTopRightRadius: isUser ? '2px' : 'var(--radius-md)',
                borderTopLeftRadius: isUser ? 'var(--radius-md)' : '2px',
                boxShadow: 'var(--shadow-sm)',
                fontSize: '0.88rem',
                lineHeight: '1.4'
              }}
              role="log"
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', justifyContent: 'space-between' }}>
                <span style={{ flex: 1 }}>{msg.text}</span>
                {!isUser && (
                  <button
                    onClick={() => speakText(msg.text, currentLang)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--primary)',
                      cursor: 'pointer',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: '50%',
                      marginTop: '2px'
                    }}
                    title={t('ttsChatBtn')}
                    aria-label={t('ttsChatBtn')}
                  >
                    <Volume2 size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {loading && (
          <div style={{ alignSelf: 'flex-start', background: 'var(--bg-tertiary)', padding: '10px 14px', borderRadius: 'var(--radius-md)', borderTopLeftRadius: '2px', display: 'flex', gap: '4px' }} role="status">
            <span className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: 'fadeIn 1.2s infinite 0.2s' }}></span>
            <span className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: 'fadeIn 1.2s infinite 0.4s' }}></span>
            <span className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: 'fadeIn 1.2s infinite 0.6s' }}></span>
            <span className="sr-only">{t('loading')}</span>
          </div>
        )}
      </div>

      {/* Suggestion Chips */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '10px', scrollbarWidth: 'none' }}>
        {suggestions.map((sug) => (
          <button
            key={sug}
            onClick={() => sendMessage(sug)}
            disabled={loading}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              fontSize: '0.75rem',
              whiteSpace: 'nowrap',
              transition: 'all var(--transition-fast)'
            }}
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Chat Form Input */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder={t('assistantPlaceholder')}
          value={inputText}
          onChange={(e) => setInputText(e.target.value.substring(0, 500))} // character limit 500
          disabled={loading}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            fontSize: '0.9rem'
          }}
          maxLength={500}
        />
        <button
          type="submit"
          disabled={loading || !inputText.trim()}
          style={{
            width: '45px',
            height: '45px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--gradient-primary)',
            color: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform var(--transition-fast)'
          }}
          aria-label={t('send')}
        >
          <Send size={18} />
        </button>
      </form>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '4px' }}>
        {inputText.length}/500 chars
      </div>

    </div>
  );
};

export const AIChatbot = React.memo(AIChatbotComponent);
AIChatbot.displayName = 'AIChatbot';


