import React, { useState } from 'react';
import { validateCupBarcode } from '../../utils/validation';
import { Leaf, Award, Recycle, Check, AlertCircle, Cpu, Send } from 'lucide-react';
import { getTranslatedReward } from '../../utils/translations';
import type { Language } from '../../utils/translations';

import { translations } from '../../utils/translations';

interface GreenTrackerProps {
  currentLang: Language;
  t: (key: keyof typeof translations['en']) => string;
}

/**
 * GreenTracker Component
 * Tracks fan Green Points, environmental savings, and rewards milestone progression.
 * Includes a barcode scanner simulator and a Gemini-powered Eco-Advisor assistant.
 * Wrapped in React.memo for render efficiency.
 */
const GreenTrackerComponent: React.FC<GreenTrackerProps> = ({ currentLang, t }) => {
  const [points, setPoints] = useState(20); // Initial mock points
  const [barcodeInput, setBarcodeInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // AI Eco-Advisor State
  const [ecoQuery, setEcoQuery] = useState('');
  const [ecoAnswer, setEcoAnswer] = useState<string | null>(null);
  const [ecoLoading, setEcoLoading] = useState(false);
  
  // Eco stats
  const plasticRecycled = (points / 10) * 15; // 15g per cup
  const co2Offset = (points / 10) * 22; // 22g carbon offset per cup
  const waterSaved = (points / 10) * 0.4; // 0.4L water saved per cup

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formatted = barcodeInput.trim();
    if (!validateCupBarcode(formatted)) {
      setError(t('invalidBarcodeError'));
      return;
    }

    setPoints(prev => prev + 10);
    setSuccess(t('scanSuccessMsg'));
    setBarcodeInput('');
  };

  const handleGenerateBarcode = () => {
    const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    setBarcodeInput(`GREEN-CUP-${randomDigits}`);
    setError(null);
    setSuccess(null);
  };

  const handleEcoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ecoQuery.trim() || ecoLoading) return;
    setEcoLoading(true);
    setEcoAnswer(null);
    try {
      const response = await fetch('/api/eco', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: ecoQuery,
          currentLang
        })
      });

      if (!response.ok) {
        throw new Error('API server returned an error.');
      }

      const resData = await response.json();
      setEcoAnswer(resData.text || '');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Eco-Advisor Error:', err);
      setEcoAnswer(currentLang === 'es' ? 'Lo siento, no pude contactar al asesor ecológico en este momento.' : currentLang === 'fr' ? 'Désolé, impossible de contacter l\'éco-conseiller.' : 'Sorry, could not connect to the Eco-Advisor right now.');
    } finally {
      setEcoLoading(false);
    }
  };

  // Rewards checkpoints
  const rewards = [
    { name: 'FIFA Eco-Coaster', target: 30 },
    { name: 'Recycled Keyring', target: 60 },
    { name: 'FIFA Smart Water Bottle', target: 100 }
  ];

  return (
    <div className="glass-panel green-tracker-grid p-lg gap-lg">
      
      {/* Points & Stats Dashboard */}
      <div>
        <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Leaf style={{ color: 'var(--success)' }} />
          {t('sustainabilityTitle')}
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          {t('sustainabilityText')}
        </p>

        {/* Big Points Circular Indicator */}
        <div className="flex-row gap-lg" style={{ marginBottom: '20px', background: 'var(--bg-secondary)', padding: '15px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', alignItems: 'center' }}>
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: 'var(--success-bg)',
            border: '2px solid var(--success)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            <span style={{ fontSize: '1.4rem', color: 'var(--success)', lineHeight: '1.2' }}>{points}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{t('greenPointsLabel')}</span>
          </div>

          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '5px' }}>{t('environmentalImpactTitle')}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: '10px', fontSize: '0.75rem' }}>
              <div>
                <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{plasticRecycled.toFixed(0)}g</div>
                <div style={{ color: 'var(--text-muted)' }}>{t('plasticSavedLabel')}</div>
              </div>
              <div>
                <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{co2Offset.toFixed(0)}g</div>
                <div style={{ color: 'var(--text-muted)' }}>{t('co2SavedLabel')}</div>
              </div>
              <div>
                <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{waterSaved.toFixed(1)}L</div>
                <div style={{ color: 'var(--text-muted)' }}>{t('waterSavedLabel')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reward milestones */}
        <div>
          <h4 style={{ fontSize: '0.9rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={16} style={{ color: 'var(--secondary)' }} />
            {t('rewardsProgressionTitle')}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {rewards.map(reward => {
              const isClaimed = points >= reward.target;
              const percent = Math.min(100, (points / reward.target) * 100);
              const trRewardName = getTranslatedReward(reward.name, currentLang);
              
              return (
                <div key={reward.name} style={{ fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: isClaimed ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isClaimed ? 'bold' : 'normal' }}>
                      {trRewardName}
                    </span>
                    <span style={{ color: isClaimed ? 'var(--success)' : 'var(--text-muted)' }}>
                      {isClaimed ? t('unlockedLabel') : `${points}/${reward.target} GP`}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${percent}%`, height: '100%', background: isClaimed ? 'var(--success)' : 'var(--secondary)', borderRadius: '3px', transition: 'width 0.5s ease-out' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Simulator Scanner Form */}
      <div className="green-tracker-right-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h4 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Recycle size={18} style={{ color: 'var(--success)' }} />
          {t('recycleScannerTitle')}
        </h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '15px' }}>
          {t('recycleScannerDesc')}
        </p>

        <form onSubmit={handleBarcodeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label htmlFor="barcode-input" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '4px' }}>
              {t('barcodeInputLabel')}
            </label>
            <input
              id="barcode-input"
              type="text"
              placeholder="GREEN-CUP-0000000000"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem'
              }}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={handleGenerateBarcode}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                border: '1px solid var(--border-color)',
                transition: 'background var(--transition-fast)'
              }}
            >
              {t('generateBarcodeBtn')}
            </button>
            <button
              type="submit"
              style={{
                flex: 1.2,
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--gradient-primary)',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                transition: 'transform var(--transition-fast)'
              }}
            >
              {t('scanAwardBtn')}
            </button>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger)', fontSize: '0.75rem', marginTop: '5px' }} role="alert">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontSize: '0.75rem', marginTop: '5px' }} role="status">
              <Check size={14} />
              {success}
            </div>
          )}
        </form>

        {/* AI Eco-Advisor panel */}
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
          <h4 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={16} style={{ color: 'var(--success)' }} />
            {currentLang === 'es' ? 'Asesor Ecológico IA' : currentLang === 'fr' ? 'Conseiller Éco IA' : 'AI Eco-Advisor'}
          </h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            {currentLang === 'es' 
              ? 'Pregunta sobre reglas de reciclaje o iniciativas sostenibles del estadio.'
              : currentLang === 'fr'
              ? 'Posez des questions sur le recyclage et la durabilité du stade.'
              : 'Ask about MetLife Stadium waste recycling or carbon offset programs.'}
          </p>

          <form onSubmit={handleEcoSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              type="text"
              placeholder={currentLang === 'es' ? '¿Cómo reciclo botellas?' : currentLang === 'fr' ? 'Comment recycler ?' : 'Can I recycle food packaging?'}
              value={ecoQuery}
              onChange={(e) => setEcoQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.8rem'
              }}
              required
            />
            <button
              type="submit"
              disabled={ecoLoading || !ecoQuery.trim()}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--success)',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {ecoLoading ? <Cpu size={14} className="animate-pulse" /> : <Send size={14} />}
            </button>
          </form>

          {ecoAnswer && (
            <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success)', borderRadius: 'var(--radius-sm)', padding: '10px', fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
              {ecoAnswer}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export const GreenTracker = React.memo(GreenTrackerComponent);
GreenTracker.displayName = 'GreenTracker';


