import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Cpu, CheckCircle, RefreshCcw, Settings, Volume2, VolumeX } from 'lucide-react';
import type { Language } from '../../utils/translations';
import { speakText, stopSpeech } from '../../utils/speech';

interface CopilotRecommendation {
  id: string;
  category: 'crowd' | 'energy' | 'transit' | 'staff';
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  actionLabel: string;
  applied: boolean;
}

interface GenAICopilotProps {
  telemetry: {
    crowdCount: number;
    capacity: number;
    energyUsage: number;
    gateFlow: number;
  };
  currentLang: Language;
  t: (key: any) => string;
}

/**
 * GenAICopilot Component
 * Monitors live stadium telemetry in the background and runs real-time Gemini AI analysis
 * to generate proactive recommendations for stadium operations managers.
 * Wrapped in React.memo to optimize re-render performance.
 */
const GenAICopilotComponent: React.FC<GenAICopilotProps> = ({ telemetry, currentLang, t }) => {
  const [recommendations, setRecommendations] = useState<CopilotRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [speechActive, setSpeechActive] = useState<string | null>(null);

  // Keep track of the latest telemetry without triggering re-runs of the generator callback
  const telemetryRef = useRef(telemetry);
  telemetryRef.current = telemetry;

  // Generate recommendations using real-time Gemini API or simulated fallback
  const generateRecommendations = useCallback(async () => {
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          telemetry: telemetryRef.current,
          currentLang
        })
      });

      if (!response.ok) {
        throw new Error('API server returned an error.');
      }

      let text = await response.text();
      text = text.trim();
      
      // Strip markdown wrapper blocks if returned
      if (text.startsWith('```')) {
        text = text.replace(/^```(json)?/, '').replace(/```$/, '').trim();
      }
      
      const parsed = JSON.parse(text) as CopilotRecommendation[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setRecommendations(parsed);
        setIsAnalyzing(false);
        return;
      }
    } catch (error) {
      console.error('Gemini Copilot API Error, falling back to local recommendations:', error);
    }

    // Simulated offline logic
    setTimeout(() => {
      const currentTelemetry = telemetryRef.current;
      const list: CopilotRecommendation[] = currentLang === 'es' ? [
        {
          id: 'rec-1',
          category: 'crowd',
          title: 'Alerta de Desbordamiento en Puerta A',
          description: `El flujo en Puerta A supera límites (${currentTelemetry.gateFlow} entradas/min). Redirigir boletos generales desde el Centro de Tránsito Sur a la Puerta B.`,
          impact: 'High',
          actionLabel: 'Redirigir Señales a Puerta B',
          applied: false
        },
        {
          id: 'rec-2',
          category: 'energy',
          title: 'Balanceo de Energía Pico HVAC',
          description: `La carga de la red está en ${currentTelemetry.energyUsage} kW. Ciclar aire acondicionado en sectores del Vestíbulo Sur 110-120 por 1.5°C para conservar energía.`,
          impact: 'Medium',
          actionLabel: 'Optimizar Ciclo HVAC Sur',
          applied: false
        },
        {
          id: 'rec-3',
          category: 'transit',
          title: 'Reasignación de Navetas al Aeropuerto',
          description: 'Alinear con pronósticos de salida moviendo 4 autobuses de reserva desde el Depósito Oeste a la Terminal Norte. Egress previsto en 35 min.',
          impact: 'High',
          actionLabel: 'Despachar Navetas de Tránsito',
          applied: false
        }
      ] : currentLang === 'fr' ? [
        {
          id: 'rec-1',
          category: 'crowd',
          title: 'Alerte Encombrement Porte A',
          description: `Le flux à la Porte A dépasse les limites (${currentTelemetry.gateFlow} entrées/min). Rediriger les billets généraux vers la Porte B.`,
          impact: 'High',
          actionLabel: 'Rediriger vers Porte B',
          applied: false
        },
        {
          id: 'rec-2',
          category: 'energy',
          title: 'Équilibrage Énergie CVC',
          description: `La charge du réseau est de ${currentTelemetry.energyUsage} kW. Ajuster la climatisation des secteurs 110-120 de la Tribune Sud de 1.5°C.`,
          impact: 'Medium',
          actionLabel: 'Optimiser Climatisation Sud',
          applied: false
        },
        {
          id: 'rec-3',
          category: 'transit',
          title: 'Réallocation Navettes Aéroport',
          description: 'Ajuster les prévisions de sortie en déplaçant 4 bus de réserve du Dépôt Ouest à la Gare Nord. Egress prévu dans 35 minutes.',
          impact: 'High',
          actionLabel: 'Déployer les Navettes',
          applied: false
        }
      ] : [
        {
          id: 'rec-1',
          category: 'crowd',
          title: 'Gate A Crowd Overflow Alert',
          description: `Check-in flow at Gate A exceeds limits (${currentTelemetry.gateFlow} check-ins/min). Reroute general tickets arriving from South Transit Hub to Gate B.`,
          impact: 'High',
          actionLabel: 'Redirect Signage to Gate B',
          applied: false
        },
        {
          id: 'rec-2',
          category: 'energy',
          title: 'HVAC Energy Peak Balancing',
          description: `Grid load is at ${currentTelemetry.energyUsage} kW. Cycle cooling in South Concourse sectors 110-120 by 1.5°C to conserve energy while maintaining comfortable climates.`,
          impact: 'Medium',
          actionLabel: 'Optimize South HVAC Cycle',
          applied: false
        },
        {
          id: 'rec-3',
          category: 'transit',
          title: 'Airport Transit Shuttle Reallocation',
          description: 'Match exit queue forecasts by shifting 4 standby shuttle buses from West Depot to North Station terminal. Anticipated peak egress in 35 minutes.',
          impact: 'High',
          actionLabel: 'Dispatch Transit Shuttles',
          applied: false
        }
      ];

      // Add staff allocation recommendation if crowd count is high
      if (currentTelemetry.crowdCount > 65000) {
        list.push(currentLang === 'es' ? {
          id: 'rec-4',
          category: 'staff',
          title: 'Despacho de Voluntarios Multilingües',
          description: 'Alta concentración de fanáticos en Puerta B. Reasignar 3 voluntarios fluidos en español al Vestíbulo B.',
          impact: 'Medium',
          actionLabel: 'Reasignar Voluntarios',
          applied: false
        } : currentLang === 'fr' ? {
          id: 'rec-4',
          category: 'staff',
          title: 'Déploiement Volontaires Bilingues',
          description: 'Forte concentration de supporters à la Porte B. Réassigner 3 bénévoles bilingues au Hall B.',
          impact: 'Medium',
          actionLabel: 'Réassigner Bénévoles',
          applied: false
        } : {
          id: 'rec-4',
          category: 'staff',
          title: 'Multilingual Volunteer Dispatch',
          description: 'High concentration of Spanish-speaking fans entering Gate B. Reassign 3 Spanish-fluent volunteers from Sector D to Concourse B information booths.',
          impact: 'Medium',
          actionLabel: 'Reassign Spanish Volunteers',
          applied: false
        });
      }

      setRecommendations(list);
      setIsAnalyzing(false);
    }, 1000);
  }, [currentLang]);

  useEffect(() => {
    generateRecommendations();
  }, [generateRecommendations]);

  const handleApplyAction = (id: string) => {
    setRecommendations(prev =>
      prev.map(rec => (rec.id === id ? { ...rec, applied: true } : rec))
    );
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu style={{ color: 'var(--primary)' }} />
            {t('opsCopilotTitle')}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {t('opsCopilotDesc')}
          </p>
        </div>
        
        <button
          onClick={generateRecommendations}
          disabled={isAnalyzing}
          style={{
            padding: '8px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          aria-label="Regenerate Copilot Recommendations"
        >
          <RefreshCcw size={16} className={isAnalyzing ? 'animate-spin' : ''} style={{ animation: isAnalyzing ? 'spin 1.5s linear infinite' : 'none' }} />
        </button>
      </div>

      {/* Recommendations List Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {isAnalyzing ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            <RefreshCcw size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: '8px', color: 'var(--primary)' }} />
            <div>{currentLang === 'es' ? 'Analizando telemetría del estadio...' : currentLang === 'fr' ? 'Analyse de la télémétrie en cours...' : 'AI is scanning telemetry streams and active incidents...'}</div>
          </div>
        ) : (
          recommendations.map(rec => (
            <div
              key={rec.id}
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                padding: '15px',
                border: `1px solid ${rec.applied ? 'var(--success)' : 'var(--border-color)'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '15px',
                transition: 'all var(--transition-normal)'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 'bold',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: rec.impact === 'High' ? 'var(--danger-bg)' : 'var(--warning-bg)',
                    color: rec.impact === 'High' ? 'var(--danger)' : 'var(--warning)'
                  }}>
                    {rec.impact === 'High' ? t('high') : rec.impact === 'Medium' ? t('medium') : t('low')}
                  </span>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', flex: 1 }}>{rec.title}</h4>
                  
                  {/* TTS Narrator */}
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => {
                        speakText(`${rec.title}. ${rec.description}`, currentLang);
                        setSpeechActive(rec.id);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--primary)',
                        cursor: 'pointer',
                        padding: '2px'
                      }}
                      title={t('ttsSpeakBtn')}
                      aria-label={t('ttsSpeakBtn')}
                    >
                      <Volume2 size={13} />
                    </button>
                    {speechActive === rec.id && (
                      <button
                        onClick={() => {
                          stopSpeech();
                          setSpeechActive(null);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--danger)',
                          cursor: 'pointer',
                          padding: '2px'
                        }}
                        title={t('ttsStopBtn')}
                        aria-label={t('ttsStopBtn')}
                      >
                        <VolumeX size={13} />
                      </button>
                    )}
                  </div>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {rec.description}
                </p>
              </div>

              <div>
                <button
                  onClick={() => handleApplyAction(rec.id)}
                  disabled={rec.applied}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: rec.applied ? 'var(--success-bg)' : 'var(--primary)',
                    color: rec.applied ? 'var(--success)' : '#000',
                    fontSize: '0.78rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                    border: rec.applied ? '1px solid var(--success)' : 'none',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {rec.applied ? (
                    <>
                      <CheckCircle size={14} />
                      {currentLang === 'es' ? 'Aplicado' : currentLang === 'fr' ? 'Appliqué' : 'Applied'}
                    </>
                  ) : (
                    <>
                      <Settings size={14} />
                      {rec.actionLabel}
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export const GenAICopilot = React.memo(GenAICopilotComponent);
GenAICopilot.displayName = 'GenAICopilot';


