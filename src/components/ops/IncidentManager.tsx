import React, { useState } from 'react';
import { sanitizeInput } from '../../utils/security';
import { ShieldAlert, Plus, CheckCircle, UserCheck } from 'lucide-react';
import { getTranslatedZone } from '../../utils/translations';
import type { Language } from '../../utils/translations';

interface Volunteer {
  name: string;
  languages: string[];
  status: 'Available' | 'Busy';
  zone: string;
}

interface Incident {
  id: string;
  type: 'Medical' | 'Logistics' | 'Crowding' | 'Facility' | 'Safety';
  location: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  assignedVolunteer: string;
  status: 'Active' | 'Resolved';
  checklist: string[];
}

const INITIAL_VOLUNTEERS: Volunteer[] = [
  { name: 'John Doe', languages: ['English'], status: 'Available', zone: 'North Stand' },
  { name: 'Sofia Rodriguez', languages: ['English', 'Spanish'], status: 'Available', zone: 'East Stand' },
  { name: 'Jean-Luc Picard', languages: ['English', 'French'], status: 'Available', zone: 'South Stand' },
  { name: 'Yuki Tanaka', languages: ['English', 'Japanese'], status: 'Available', zone: 'West Stand' }
];

const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-701',
    type: 'Logistics',
    location: 'Gate B Entrance',
    severity: 'Medium',
    description: 'Ticket scanner RFID sensor failing to read mobile barcodes.',
    assignedVolunteer: 'Sofia Rodriguez',
    status: 'Active',
    checklist: ['Reboot scanner hardware', 'Check network link status', 'Redirect fans to manual scanner line']
  },
  {
    id: 'INC-702',
    type: 'Facility',
    location: 'Sector 104',
    severity: 'Low',
    description: 'Spilled soft drink causing a slippery hazard near concessions.',
    assignedVolunteer: 'John Doe',
    status: 'Active',
    checklist: ['Deploy wet floor safety caution signs', 'Coordinate sanitation sweep team', 'Confirm area is dry and clear']
  }
];

interface IncidentManagerProps {
  currentLang: Language;
  t: (key: any) => string;
}

/**
 * IncidentManager Component
 * Handles reporting, assignment, and status tracking for stadium incidents and volunteers.
 * Wrapped in React.memo to prevent unnecessary re-renders when parent telemetry updates.
 */
const IncidentManagerComponent: React.FC<IncidentManagerProps> = ({ currentLang, t }) => {
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(INITIAL_VOLUNTEERS);
  
  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [type, setType] = useState<'Medical' | 'Logistics' | 'Crowding' | 'Facility' | 'Safety'>('Facility');
  const [location, setLocation] = useState('Sector 128');
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [description, setDescription] = useState('');

  const getSeverityLabel = (sev: string) => {
    if (sev === 'Low') return t('severityLow');
    if (sev === 'Medium') return t('severityMedium');
    if (sev === 'High') return t('severityHigh');
    if (sev === 'Critical') return t('severityCritical');
    return sev;
  };

  const getStatusLabel = (stat: string) => {
    if (stat === 'Active') return t('active');
    if (stat === 'Resolved') return t('resolved');
    return stat;
  };

  const getVolStatusLabel = (stat: string) => {
    if (stat === 'Available') return t('volunteerAvailable');
    if (stat === 'Busy') return t('volunteerBusy');
    return stat;
  };

  const getTranslatedLocation = (loc: string) => {
    if (loc === 'Sector 102') return t('incidentLocationWest');
    if (loc === 'Sector 114') return t('incidentLocationNorth');
    if (loc === 'Sector 128') return t('incidentLocationEast');
    if (loc === 'Sector 142') return t('incidentLocationSouth');
    if (loc === 'Gate B Entrance') return t('incidentLocationGateB');
    return loc;
  };

  const getTranslatedType = (ty: string) => {
    if (ty === 'Facility') return t('incidentTypeFacility');
    if (ty === 'Medical') return t('incidentTypeMedical');
    if (ty === 'Logistics') return t('incidentTypeLogistics');
    if (ty === 'Crowding') return t('incidentTypeCrowding');
    if (ty === 'Safety') return t('incidentTypeSafety');
    return ty;
  };

  const handleReportIncident = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Sanitize text fields
    const sanitizedDesc = sanitizeInput(description);
    if (!sanitizedDesc.trim()) return;

    // 2. AI Dispatcher Matching Logic
    const isSpanishFan = sanitizedDesc.toLowerCase().includes('espan') || sanitizedDesc.toLowerCase().includes('spanish') || location.includes('128');
    const isFrenchFan = sanitizedDesc.toLowerCase().includes('franc') || sanitizedDesc.toLowerCase().includes('french') || location.includes('142');

    let assigned: Volunteer | null = null;

    if (isSpanishFan) {
      assigned = volunteers.find(v => v.status === 'Available' && v.languages.includes('Spanish')) || null;
    } else if (isFrenchFan) {
      assigned = volunteers.find(v => v.status === 'Available' && v.languages.includes('French')) || null;
    }

    if (!assigned) {
      assigned = volunteers.find(v => v.status === 'Available') || null;
    }

    const volunteerName = assigned ? assigned.name : 'Standby Emergency Officer';

    if (assigned) {
      setVolunteers(prev =>
        prev.map(v => (v.name === assigned!.name ? { ...v, status: 'Busy' } : v))
      );
    }

    // 4. Generate Checklist steps based on Incident Type
    let checklist: string[] = [];
    if (type === 'Medical') {
      checklist = currentLang === 'es' 
        ? ['Buscar botiquín de primeros auxilios y DEA', 'Asegurar acceso libre para paramédicos', 'Brindar primeros auxilios básicos']
        : currentLang === 'fr'
        ? ['Récupérer la trousse médicale et le DAE', 'Sécuriser l\'accès pour les ambulanciers', 'Dispenser les premiers soins de base']
        : ['Retrieve medical pack & automated external defibrillator', 'Secure sector clearance for paramedics', 'Render basic first-aid assistance'];
    } else if (type === 'Crowding') {
      checklist = currentLang === 'es'
        ? ['Evaluar cuellos de botella en la puerta', 'Abrir molinetes y puertas de respaldo', 'Guiar a la multitud con megáfono']
        : currentLang === 'fr'
        ? ['Évaluer les goulots d\'étranglement', 'Ouvrir les tourniquets de secours', 'Guider la foule au mégaphone']
        : ['Assess gate flow constraints', 'Open backup turnstiles & gates', 'Guide crowd using megaphone commands'];
    } else if (type === 'Safety') {
      checklist = currentLang === 'es'
        ? ['Identificar el origen del riesgo de seguridad', 'Asegurar barreras perimetrales locales', 'Notificar a oficiales de seguridad']
        : currentLang === 'fr'
        ? ['Identifier la source du risque de sécurité', 'Sécuriser les barrières de périmètre', 'Alerter les agents de sécurité']
        : ['Identify source of security risk', 'Secure local perimeter barricades', 'Notify stadium security officers'];
    } else {
      checklist = currentLang === 'es'
        ? ['Inspeccionar el sitio del reporte', 'Coordinar con depósito central de instalaciones', 'Registrar detalles de resolución']
        : currentLang === 'fr'
        ? ['Inspecter le site du rapport', 'Coordonner avec le dépôt de maintenance', 'Enregistrer les détails de résolution']
        : ['Inspect report site', 'Coordinate with main facilities depot', 'Log repair resolution details'];
    }

    const newInc: Incident = {
      id: `INC-${Math.floor(703 + Math.random() * 200)}`,
      type,
      location,
      severity,
      description: sanitizedDesc,
      assignedVolunteer: volunteerName,
      status: 'Active',
      checklist
    };

    setIncidents(prev => [newInc, ...prev]);
    setDescription('');
    setShowAddForm(false);
  };

  const handleResolveIncident = (id: string, volName: string) => {
    setIncidents(prev =>
      prev.map(inc => (inc.id === id ? { ...inc, status: 'Resolved' } : inc))
    );
    
    setVolunteers(prev =>
      prev.map(v => (v.name === volName ? { ...v, status: 'Available' } : v))
    );
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert style={{ color: 'var(--danger)' }} />
          {t('incidentTitle')}
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            padding: '8px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--gradient-primary)',
            color: '#000',
            fontWeight: 'bold',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          aria-expanded={showAddForm}
        >
          <Plus size={16} />
          {t('reportIncidentButton')}
        </button>
      </div>

      {/* Report Form */}
      {showAddForm && (
        <form onSubmit={handleReportIncident} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '15px' }} className="animate-fade">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label htmlFor="inc-type" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', marginBottom: '4px' }}>
                {t('incidentType')}
              </label>
              <select
                id="inc-type"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="Facility">{t('incidentTypeFacility')}</option>
                <option value="Medical">{t('incidentTypeMedical')}</option>
                <option value="Logistics">{t('incidentTypeLogistics')}</option>
                <option value="Crowding">{t('incidentTypeCrowding')}</option>
                <option value="Safety">{t('incidentTypeSafety')}</option>
              </select>
            </div>

            <div>
              <label htmlFor="inc-loc" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', marginBottom: '4px' }}>
                {t('location')}
              </label>
              <select
                id="inc-loc"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="Sector 102">{t('incidentLocationWest')}</option>
                <option value="Sector 114">{t('incidentLocationNorth')}</option>
                <option value="Sector 128">{t('incidentLocationEast')}</option>
                <option value="Sector 142">{t('incidentLocationSouth')}</option>
                <option value="Gate B Entrance">{t('incidentLocationGateB')}</option>
              </select>
            </div>

            <div>
              <label htmlFor="inc-sev" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', marginBottom: '4px' }}>
                {t('severity')}
              </label>
              <select
                id="inc-sev"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="Low">{t('severityLow')}</option>
                <option value="Medium">{t('severityMedium')}</option>
                <option value="High">{t('severityHigh')}</option>
                <option value="Critical">{t('severityCritical')}</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="inc-desc" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', marginBottom: '4px' }}>
              {t('incidentDescLabel')}
            </label>
            <textarea
              id="inc-desc"
              rows={3}
              placeholder={t('incidentDescPlaceholder')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontFamily: 'inherit'
              }}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                fontSize: '0.8rem'
              }}
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--danger)',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '0.8rem'
              }}
            >
              {t('dispatchStaffBtn')}
            </button>
          </div>
        </form>
      )}

      {/* Incident Grid Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '15px' }}>
        {incidents.map(inc => (
          <div
            key={inc.id}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '15px',
              opacity: inc.status === 'Resolved' ? 0.75 : 1,
              transition: 'opacity var(--transition-normal)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: inc.severity === 'Critical' ? 'var(--danger-bg)' : inc.severity === 'High' ? 'var(--warning-bg)' : 'var(--info-bg)',
                  color: inc.severity === 'Critical' ? 'var(--danger)' : inc.severity === 'High' ? 'var(--warning)' : 'var(--info)',
                  marginRight: '6px'
                }}>
                  {getSeverityLabel(inc.severity)}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{inc.id}</span>
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 'bold', color: inc.status === 'Resolved' ? 'var(--success)' : 'var(--danger)' }}>
                {getStatusLabel(inc.status)}
              </span>
            </div>

            <h4 style={{ fontSize: '0.92rem', marginBottom: '6px', color: 'var(--text-primary)' }}>
              {getTranslatedType(inc.type)} @ {getTranslatedLocation(inc.location)}
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px', minHeight: '36px' }}>
              {inc.description}
            </p>

            <div style={{ background: 'var(--bg-tertiary)', padding: '10px', borderRadius: 'var(--radius-sm)', marginBottom: '12px', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                <UserCheck size={14} style={{ color: 'var(--success)' }} />
                <span>{t('responderLabel')}: {inc.assignedVolunteer}</span>
              </div>
              <ul style={{ listStyleType: 'none', paddingLeft: '0', display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--text-muted)' }}>
                {inc.checklist.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '4px', height: '4px', background: 'var(--primary)', borderRadius: '50%' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {inc.status === 'Active' && (
              <button
                onClick={() => handleResolveIncident(inc.id, inc.assignedVolunteer)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--success)',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'background var(--transition-fast)'
                }}
              >
                <CheckCircle size={14} />
                {t('markResolvedBtn')}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Volunteer Staff Roster Panel */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
        <h4 style={{ fontSize: '0.9rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <UserCheck size={16} style={{ color: 'var(--primary)' }} />
          {t('activeVolunteerRosterTitle')}
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {volunteers.map(vol => (
            <div
              key={vol.name}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.8rem'
              }}
            >
              <div>
                <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{vol.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Lang: {vol.languages.join(', ')} • {getTranslatedZone(vol.zone, currentLang)}
                </div>
              </div>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 'bold',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                background: vol.status === 'Available' ? 'var(--success-bg)' : 'var(--warning-bg)',
                color: vol.status === 'Available' ? 'var(--success)' : 'var(--warning)'
              }}>
                {getVolStatusLabel(vol.status)}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export const IncidentManager = React.memo(IncidentManagerComponent);
IncidentManager.displayName = 'IncidentManager';


