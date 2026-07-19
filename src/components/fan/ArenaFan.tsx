import React from 'react';
import { MapViewer } from './MapViewer';
import { AIChatbot } from './AIChatbot';
import { SmartQueue } from './SmartQueue';
import { GreenTracker } from './GreenTracker';
import type { Language } from '../../utils/translations';
import { Sparkles, Calendar, MapPin } from 'lucide-react';

import { translations } from '../../utils/translations';

interface ArenaFanProps {
  currentLang: Language;
  t: (key: keyof typeof translations['en']) => string;
}

export const ArenaFan: React.FC<ArenaFanProps> = ({ currentLang, t }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Welcome Banner */}
      <div className="glow-card" style={{ padding: '25px', color: 'var(--text-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--success-bg)',
              color: 'var(--success)',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              <Sparkles size={12} />
              FIFA World Cup 2026 Live
            </span>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>{t('welcomeTitle')}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              {t('welcomeSubtitle')}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: 'var(--radius-md)' }}>
              <Calendar size={15} style={{ color: 'var(--primary)' }} />
              <span>July 9, 2026</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: 'var(--radius-md)' }}>
              <MapPin size={15} style={{ color: 'var(--secondary)' }} />
              <span>East Rutherford, NJ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Chat & Seating Blueprint */}
      <div className="fan-grid">
        <MapViewer currentLang={currentLang} t={t} />
        <AIChatbot currentLang={currentLang} t={t} />
      </div>

      {/* Second Row: Concessions & GreenTracker */}
      <SmartQueue currentLang={currentLang} t={t} />
      <GreenTracker currentLang={currentLang} t={t} />

    </div>
  );
};
