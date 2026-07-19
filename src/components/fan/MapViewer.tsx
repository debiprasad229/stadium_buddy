import React, { useState } from 'react';
import { Navigation, Info, Volume2, VolumeX, Cpu } from 'lucide-react';
import { getTranslatedRouteStep, getTranslatedGate, getTranslatedSection } from '../../utils/translations';
import type { Language } from '../../utils/translations';
import { speakText, stopSpeech } from '../../utils/speech';

interface RouteStep {
  text: string;
  distance: string;
}

interface MapViewerProps {
  currentLang: Language;
  t: (key: any) => string;
}

const GATES = ['Gate A (North)', 'Gate B (East)', 'Gate C (South)', 'Gate D (West)'];
const SECTIONS = ['Section 101', 'Section 102', 'Section 103', 'Section 104', 'Section 105', 'Section 106'];

/**
 * MapViewer Component
 * Renders the stadium blueprint SVG and calculates routes from Ticket Gates to Seat Sections.
 * Integrates real-time Gemini-guided navigation for crowd-aware step-by-step directions.
 * Wrapped in React.memo for rendering performance.
 */
const MapViewerComponent: React.FC<MapViewerProps> = ({ currentLang, t }) => {
  const [selectedGate, setSelectedGate] = useState(GATES[0]);
  const [selectedSection, setSelectedSection] = useState(SECTIONS[0]);
  const [routeSteps, setRouteSteps] = useState<RouteStep[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // SVG Coordinates for drawing the path (Center is 150, 150)
  const getCoordinates = () => {
    let gateCoord = { x: 150, y: 35 }; // Gate A (North)
    if (selectedGate.includes('Gate B')) gateCoord = { x: 265, y: 150 }; // Gate B (East)
    if (selectedGate.includes('Gate C')) gateCoord = { x: 150, y: 265 }; // Gate C (South)
    if (selectedGate.includes('Gate D')) gateCoord = { x: 35, y: 150 };  // Gate D (West)

    let sectionCoord = { x: 100, y: 100 }; // Section 101
    if (selectedSection === 'Section 102') sectionCoord = { x: 200, y: 100 };
    if (selectedSection === 'Section 103') sectionCoord = { x: 200, y: 200 };
    if (selectedSection === 'Section 104') sectionCoord = { x: 100, y: 200 };
    if (selectedSection === 'Section 105') sectionCoord = { x: 150, y: 90 };
    if (selectedSection === 'Section 106') sectionCoord = { x: 150, y: 210 };

    return { gate: gateCoord, section: sectionCoord };
  };

  const handleRouteCalculation = () => {
    const steps: RouteStep[] = [
      {
        text: getTranslatedRouteStep(0, getTranslatedGate(selectedGate, currentLang), getTranslatedSection(selectedSection, currentLang), currentLang),
        distance: '0m'
      },
      {
        text: getTranslatedRouteStep(1, getTranslatedGate(selectedGate, currentLang), getTranslatedSection(selectedSection, currentLang), currentLang),
        distance: '5m'
      },
      {
        text: getTranslatedRouteStep(2, getTranslatedGate(selectedGate, currentLang), getTranslatedSection(selectedSection, currentLang), currentLang),
        distance: '45m'
      },
      {
        text: getTranslatedRouteStep(3, getTranslatedGate(selectedGate, currentLang), getTranslatedSection(selectedSection, currentLang), currentLang),
        distance: '30m'
      },
      {
        text: getTranslatedRouteStep(4, getTranslatedGate(selectedGate, currentLang), getTranslatedSection(selectedSection, currentLang), currentLang),
        distance: '20m'
      }
    ];
    setRouteSteps(steps);
    setActiveStepIndex(0);
  };

  const handleAiRouteCalculation = async () => {
    setIsAiLoading(true);
    setAiError(null);
    try {
      const response = await fetch('/api/navigation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          gate: selectedGate,
          section: selectedSection,
          currentLang
        })
      });

      if (!response.ok) {
        throw new Error('API server returned an error.');
      }

      let text = await response.text();
      text = text.trim();
      
      if (text.startsWith('```')) {
        text = text.replace(/^```(json)?/, '').replace(/```$/, '').trim();
      }
      
      const parsed = JSON.parse(text) as RouteStep[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setRouteSteps(parsed);
        setActiveStepIndex(0);
        return;
      }
      throw new Error('Invalid routing structure returned.');
    } catch (err: any) {
      console.error('AI Navigation Error, falling back to static calculation:', err);
      setAiError(currentLang === 'es' ? 'Error al obtener ruta de IA. Usando ruta fija.' : currentLang === 'fr' ? 'Échec itinéraire IA. Utilisation itinéraire standard.' : 'AI routing failed. Using standard route.');
      handleRouteCalculation();
    } finally {
      setIsAiLoading(false);
    }
  };

  const { gate, section } = getCoordinates();

  return (
    <div className="glass-panel map-viewer-grid p-lg gap-lg">
      {/* Stadium Seating Chart Canvas */}
      <div className="flex-col" style={{ alignItems: 'center' }}>
        <h3 style={{ marginBottom: '15px', alignSelf: 'flex-start' }}>{t('blueprintTitle')}</h3>
        <div style={{ position: 'relative', width: '100%', maxWidth: '340px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '15px' }}>
          <svg viewBox="0 0 300 300" style={{ width: '100%', height: 'auto' }}>
            {/* Pitch (Field) */}
            <rect x="90" y="110" width="120" height="80" rx="4" fill="rgba(16, 185, 129, 0.15)" stroke="var(--success)" strokeWidth="1.5" />
            <line x1="150" y1="110" x2="150" y2="190" stroke="var(--success)" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx="150" cy="150" r="15" fill="none" stroke="var(--success)" strokeWidth="1" />
            <text x="138" y="153" fill="var(--success)" fontSize="8" fontWeight="bold">{t('pitchCenterLabel')}</text>

            {/* Stadium Outer Ring (Seating Bowl) */}
            <rect x="25" y="25" width="250" height="250" rx="125" fill="none" stroke="var(--border-color)" strokeWidth="12" />
            <rect x="40" y="40" width="220" height="220" rx="110" fill="none" stroke="var(--border-color)" strokeWidth="10" strokeDasharray="10 5" />

            {/* Seating Sectors */}
            <text x="65" y="85" fill="var(--text-muted)" fontSize="9" fontWeight="bold">Sect 101</text>
            <text x="195" y="85" fill="var(--text-muted)" fontSize="9" fontWeight="bold">Sect 102</text>
            <text x="195" y="225" fill="var(--text-muted)" fontSize="9" fontWeight="bold">Sect 103</text>
            <text x="65" y="225" fill="var(--text-muted)" fontSize="9" fontWeight="bold">Sect 104</text>

            {/* Gates */}
            <circle cx="150" cy="20" r="8" fill="var(--bg-tertiary)" stroke="var(--text-muted)" strokeWidth="1" />
            <text x="145" y="23" fill="var(--text-primary)" fontSize="8" fontWeight="bold">A</text>
            
            <circle cx="280" cy="150" r="8" fill="var(--bg-tertiary)" stroke="var(--text-muted)" strokeWidth="1" />
            <text x="277" y="153" fill="var(--text-primary)" fontSize="8" fontWeight="bold">B</text>

            <circle cx="150" cy="280" r="8" fill="var(--bg-tertiary)" stroke="var(--text-muted)" strokeWidth="1" />
            <text x="146" y="283" fill="var(--text-primary)" fontSize="8" fontWeight="bold">C</text>

            <circle cx="20" cy="150" r="8" fill="var(--bg-tertiary)" stroke="var(--text-muted)" strokeWidth="1" />
            <text x="17" y="153" fill="var(--text-primary)" fontSize="8" fontWeight="bold">D</text>

            {/* Interactive navigation line path */}
            {routeSteps.length > 0 && (
              <>
                {/* Connector Path line */}
                <path
                  d={`M ${gate.x} ${gate.y} Q 150 150 ${section.x} ${section.y}`}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="3"
                  strokeDasharray="5 3"
                  style={{ animation: 'dash 10s linear infinite' }}
                />
                
                {/* Gate Pin */}
                <circle cx={gate.x} cy={gate.y} r="5" fill="var(--secondary)" />
                <circle cx={gate.x} cy={gate.y} r="8" fill="none" stroke="var(--secondary)" strokeWidth="1" />

                {/* Seat Section Destination Pin */}
                <circle cx={section.x} cy={section.y} r="6" fill="var(--primary)" />
                <circle cx={section.x} cy={section.y} r="10" fill="none" stroke="var(--primary)" strokeWidth="1" className="animate-pulse-glow" />
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Inputs & Navigation Route Directions */}
      <div className="flex-col gap-md">
        <h3>{t('calculatorTitle')}</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
          <div>
            <label htmlFor="gate-select" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px' }}>
              {t('gateSelectLabel')}
            </label>
            <select
              id="gate-select"
              value={selectedGate}
              onChange={(e) => {
                setSelectedGate(e.target.value);
                setRouteSteps([]);
              }}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              {GATES.map(g => (
                <option key={g} value={g}>
                  {getTranslatedGate(g, currentLang)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="section-select" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px' }}>
              {t('sectionSelectLabel')}
            </label>
            <select
              id="section-select"
              value={selectedSection}
              onChange={(e) => {
                setSelectedSection(e.target.value);
                setRouteSteps([]);
              }}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              {SECTIONS.map(s => (
                <option key={s} value={s}>
                  {getTranslatedSection(s, currentLang)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button
            onClick={handleRouteCalculation}
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'transform var(--transition-fast)'
            }}
          >
            <Navigation size={16} />
            {t('findSeatButton')}
          </button>

          <button
            onClick={handleAiRouteCalculation}
            disabled={isAiLoading}
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--primary)',
              color: '#000',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'transform var(--transition-fast)',
              opacity: isAiLoading ? 0.7 : 1,
              cursor: isAiLoading ? 'not-allowed' : 'pointer'
            }}
          >
            <Cpu size={16} className={isAiLoading ? 'animate-pulse' : ''} />
            {isAiLoading 
              ? (currentLang === 'es' ? 'Calculando...' : currentLang === 'fr' ? 'Calcul...' : 'Calculating...')
              : (currentLang === 'es' ? 'Ruta de IA' : currentLang === 'fr' ? 'Itinéraire IA' : 'AI-Optimized Route')}
          </button>
        </div>

        {aiError && (
          <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '4px' }}>
            ⚠️ {aiError}
          </div>
        )}

        {routeSteps.length > 0 && (
          <div style={{ marginTop: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Info size={16} style={{ color: 'var(--primary)' }} />
                {t('routeDirectionsTitle')}
              </h4>
              
              <div style={{ display: 'flex', gap: '5px' }}>
                <button
                  onClick={() => {
                    const fullText = routeSteps.map((step, idx) => `${idx + 1}. ${step.text}`).join(' ');
                    speakText(fullText, currentLang);
                  }}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)'
                  }}
                  aria-label="Read directions aloud"
                >
                  <Volume2 size={13} />
                  {t('ttsSpeakBtn')}
                </button>
                <button
                  onClick={stopSpeech}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--danger)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px 6px',
                    borderRadius: 'var(--radius-sm)'
                  }}
                  aria-label="Stop reading"
                >
                  <VolumeX size={13} />
                </button>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
              {routeSteps.map((step, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveStepIndex(idx)}
                  style={{
                    display: 'flex',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: activeStepIndex === idx ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                    borderLeft: `3px solid ${activeStepIndex === idx ? 'var(--primary)' : 'var(--border-color)'}`,
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{
                    minWidth: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: activeStepIndex === idx ? 'var(--primary)' : 'var(--bg-tertiary)',
                    color: activeStepIndex === idx ? '#000' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.75rem'
                  }}>
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1, color: activeStepIndex === idx ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    {step.text}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {step.distance}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export const MapViewer = React.memo(MapViewerComponent);
MapViewer.displayName = 'MapViewer';


