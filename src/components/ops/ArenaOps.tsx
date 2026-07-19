import React, { useState, useEffect } from 'react';
import { LiveMetrics } from './LiveMetrics';
import { GenAICopilot } from './GenAICopilot';
import { IncidentManager } from './IncidentManager';
import { ShieldCheck, Server, Activity } from 'lucide-react';

import type { Language } from '../../utils/translations';

import { translations } from '../../utils/translations';

interface ArenaOpsProps {
  currentLang: Language;
  t: (key: keyof typeof translations['en']) => string;
}

export const ArenaOps: React.FC<ArenaOpsProps> = ({ currentLang, t }) => {
  const [telemetry, setTelemetry] = useState({
    crowdCount: 64250,
    capacity: 82500,
    energyUsage: 1420,
    gateFlow: 185
  });

  // Telemetry fluctuation loop simulating live feeds
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => {
        const crowdChange = Math.floor(Math.random() * 80) - 20; // slow rise
        const energyChange = Math.floor(Math.random() * 30) - 15;
        const gateChange = Math.floor(Math.random() * 20) - 10;

        return {
          crowdCount: Math.min(prev.capacity, Math.max(0, prev.crowdCount + crowdChange)),
          capacity: prev.capacity,
          energyUsage: Math.max(100, prev.energyUsage + energyChange),
          gateFlow: Math.max(10, Math.min(600, prev.gateFlow + gateChange))
        };
      });
    }, 4500); // update telemetry every 4.5 seconds

    return () => clearInterval(interval);
  }, []);

  const triggerSimRefresh = () => {
    setTelemetry({
      crowdCount: Math.floor(58000 + Math.random() * 18000),
      capacity: 82500,
      energyUsage: Math.floor(1200 + Math.random() * 400),
      gateFlow: Math.floor(100 + Math.random() * 250)
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Operations Info bar */}
      <div className="glow-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server style={{ color: 'var(--primary)' }} />
            {t('roleOps')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
            MetLife Arena Operational Control Console • FIFA World Cup Tournament Operations
          </p>
        </div>

        <div style={{ display: 'flex', gap: '15px', fontSize: '0.82rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--success)', background: 'var(--success-bg)', padding: '6px 12px', borderRadius: 'var(--radius-full)' }}>
            <ShieldCheck size={14} />
            System Secure (SSL/AES)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--primary)', background: 'var(--info-bg)', padding: '6px 12px', borderRadius: 'var(--radius-full)' }}>
            <Activity size={14} className="animate-pulse-glow" style={{ animation: 'pulseGlow 1.5s infinite' }} />
            Live Telemetry Stream
          </span>
        </div>
      </div>

      {/* Grid: Telemetry Dashboard & AI Copilot */}
      <div className="responsive-grid">
        <LiveMetrics telemetry={telemetry} triggerSimRefresh={triggerSimRefresh} t={t} />
        <GenAICopilot telemetry={telemetry} currentLang={currentLang} t={t} />
      </div>

      {/* Row 2: Incident dispatcher list */}
      <IncidentManager currentLang={currentLang} t={t} />

    </div>
  );
};
