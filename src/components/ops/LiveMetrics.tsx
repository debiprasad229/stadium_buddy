import React from 'react';
import { Users, Zap, Compass, RefreshCw } from 'lucide-react';

interface LiveMetricsProps {
  telemetry: {
    crowdCount: number;
    capacity: number;
    energyUsage: number; // kW
    gateFlow: number; // people/min
  };
  triggerSimRefresh: () => void;
  t: (key: any) => string;
}

export const LiveMetrics: React.FC<LiveMetricsProps> = ({ telemetry, triggerSimRefresh, t }) => {
  const crowdPercent = Math.min(100, Math.round((telemetry.crowdCount / telemetry.capacity) * 100));

  return (
    <div className="glass-panel" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass style={{ color: 'var(--primary)' }} />
          {t('opsMetricsTitle')}
        </h3>
        <button
          onClick={triggerSimRefresh}
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background var(--transition-fast)'
          }}
          aria-label="Refresh Telemetry Data"
        >
          <RefreshCw size={14} />
          Refresh Stats
        </button>
      </div>

      <div className="telemetry-tiles-grid" style={{ display: 'grid', gap: '15px', marginBottom: '20px' }}>
        {/* Crowd Density Tile */}
        <div style={{ background: 'var(--bg-secondary)', padding: '15px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('densityLabel')}</span>
            <Users size={16} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>
            {telemetry.crowdCount.toLocaleString()} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ {telemetry.capacity.toLocaleString()}</span>
          </div>
          <div style={{ width: '100%', height: '5px', background: 'var(--bg-tertiary)', borderRadius: '3px', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${crowdPercent}%`, height: '100%', background: crowdPercent > 90 ? 'var(--danger)' : 'var(--primary)', borderRadius: '3px', transition: 'width var(--transition-slow)' }} />
          </div>
          <span style={{ fontSize: '0.72rem', color: crowdPercent > 90 ? 'var(--danger)' : 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
            {crowdPercent > 90 ? 'Alert: High Density detected in Sectors A/C' : 'Normal capacity flow'}
          </span>
        </div>

        {/* Energy Saving/Usage Tile */}
        <div style={{ background: 'var(--bg-secondary)', padding: '15px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('energyLabel')}</span>
            <Zap size={16} style={{ color: 'var(--warning)' }} />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>
            {telemetry.energyUsage} kW
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>▼ 14% eco-savings (Solar & Battery active)</span>
          </div>
        </div>

        {/* Gate Entrance Flow Rate Tile */}
        <div style={{ background: 'var(--bg-secondary)', padding: '15px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('gateFlowLabel')}</span>
            <Compass size={16} style={{ color: 'var(--secondary)' }} />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>
            {telemetry.gateFlow} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>check-ins / min</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Peak check-in rate at Gate B & C
          </div>
        </div>
      </div>

      {/* SVG Telemetry Mini-Graph */}
      <div>
        <h4 style={{ fontSize: '0.9rem', marginBottom: '10px' }}>Inflow Traffic Load (Last 5 mins)</h4>
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '10px' }}>
          <svg viewBox="0 0 400 100" style={{ width: '100%', height: 'auto', display: 'block' }}>
            {/* Grid Lines */}
            <line x1="0" y1="20" x2="400" y2="20" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="0" y1="50" x2="400" y2="50" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="0" y1="80" x2="400" y2="80" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="4 4" />

            {/* Glowing Flow Area Path */}
            <path
              d="M 0 80 Q 80 50 160 65 T 320 25 L 400 35 L 400 100 L 0 100 Z"
              fill="rgba(0, 242, 254, 0.08)"
            />
            
            {/* Line Path */}
            <path
              d="M 0 80 Q 80 50 160 65 T 320 25 L 400 35"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2.5"
            />

            {/* Labels */}
            <text x="5" y="15" fill="var(--text-muted)" fontSize="8">Peak Inflow</text>
            <text x="350" y="95" fill="var(--text-muted)" fontSize="8">Real-time</text>
          </svg>
        </div>
      </div>
    </div>
  );
};
