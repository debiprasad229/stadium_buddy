import { useState, useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import { useLanguage } from './hooks/useLanguage';
import type { Language } from './utils/translations';
import { ArenaFan } from './components/fan/ArenaFan';
import { ArenaOps } from './components/ops/ArenaOps';
import { Eye, Languages, User, ShieldAlert, Cpu } from 'lucide-react';

function App() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [role, setRole] = useState<'fan' | 'ops'>('fan');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [showA11yMenu, setShowA11yMenu] = useState(false);

  // Sync font size attribute to html root for accessibility scaling
  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize);
  }, [fontSize]);

  const handleRoleToggle = () => {
    setRole(prev => (prev === 'fan' ? 'ops' : 'fan'));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Premium Glassmorphic Header */}
      <header className="glass-panel" style={{
        height: 'var(--header-height)',
        padding: '0 30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '0',
        borderLeft: 'none',
        borderRight: 'none',
        borderTop: 'none',
        position: 'sticky',
        top: '0',
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)'
      }}>
        
        {/* Brand Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Cpu size={20} style={{ color: '#000' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', letterSpacing: '0.5px' }}>{t('title')}</h1>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>FIFA World Cup 2026</p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          
          {/* Active Role Toggle button */}
          <button
            onClick={handleRoleToggle}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              background: role === 'ops' ? 'var(--gradient-accent)' : 'var(--bg-tertiary)',
              color: role === 'ops' ? '#000' : 'var(--text-primary)',
              border: `1px solid ${role === 'ops' ? 'transparent' : 'var(--border-color)'}`,
              fontWeight: 'bold',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all var(--transition-normal)',
              boxShadow: role === 'ops' ? 'var(--shadow-glow)' : 'none'
            }}
            aria-label={`Switch to ${role === 'fan' ? 'Operations' : 'Fan Experience'}`}
          >
            <User size={15} />
            {role === 'fan' ? t('roleFan') : t('roleOps')}
          </button>

          {/* Language Selector Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-tertiary)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <Languages size={15} style={{ color: 'var(--text-secondary)' }} />
            <label htmlFor="lang-nav-select" className="sr-only">Change Language</label>
            <select
              id="lang-nav-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 'bold'
              }}
            >
              <option value="en" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>EN (English)</option>
              <option value="es" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>ES (Español)</option>
              <option value="fr" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>FR (Français)</option>
            </select>
          </div>

          {/* Accessibility Settings Toggle */}
          <button
            onClick={() => setShowA11yMenu(!showA11yMenu)}
            style={{
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              background: showA11yMenu ? 'var(--bg-tertiary)' : 'transparent',
              color: showA11yMenu ? 'var(--primary)' : 'var(--text-secondary)',
              border: `1px solid ${showA11yMenu ? 'var(--border-color)' : 'transparent'}`,
              display: 'flex',
              alignItems: 'center'
            }}
            aria-label="Toggle Accessibility Options"
            aria-expanded={showA11yMenu}
          >
            <Eye size={18} />
          </button>

        </div>

        {/* Accessibility Drawer / Dropdown */}
        {showA11yMenu && (
          <div style={{
            position: 'absolute',
            top: 'var(--header-height)',
            right: '30px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '15px 20px',
            width: '280px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 99
          }} className="animate-fade" role="dialog" aria-modal="true" aria-label="Accessibility settings">
            <h3 style={{ fontSize: '0.95rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Eye size={16} style={{ color: 'var(--primary)' }} />
              {t('a11yTitle')}
            </h3>

            {/* Theme Selector */}
            <div style={{ marginBottom: '15px' }}>
              <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '6px' }}>Visual Theme</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['dark', 'light', 'high-contrast'] as const).map(tName => (
                  <button
                    key={tName}
                    onClick={() => setTheme(tName)}
                    style={{
                      flex: 1,
                      padding: '6px',
                      borderRadius: 'var(--radius-sm)',
                      background: theme === tName ? 'var(--primary)' : 'var(--bg-tertiary)',
                      color: theme === tName ? '#000' : 'var(--text-secondary)',
                      fontSize: '0.72rem',
                      fontWeight: 'bold',
                      border: `1px solid ${theme === tName ? 'var(--primary)' : 'var(--border-color)'}`
                    }}
                  >
                    {tName === 'dark' ? 'Dark' : tName === 'light' ? 'Light' : 'Contrast'}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Resizing */}
            <div>
              <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '6px' }}>{t('fontSizeLabel')}</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['small', 'medium', 'large'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    style={{
                      flex: 1,
                      padding: '6px',
                      borderRadius: 'var(--radius-sm)',
                      background: fontSize === size ? 'var(--primary)' : 'var(--bg-tertiary)',
                      color: fontSize === size ? '#000' : 'var(--text-secondary)',
                      fontSize: '0.72rem',
                      fontWeight: 'bold',
                      border: `1px solid ${fontSize === size ? 'var(--primary)' : 'var(--border-color)'}`
                    }}
                  >
                    {size.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '30px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
        {role === 'fan' ? (
          <ArenaFan currentLang={language} t={t} />
        ) : (
          <ArenaOps currentLang={language} t={t} />
        )}
      </main>

      {/* Footer bar */}
      <footer className="glass-panel" style={{
        padding: '15px 30px',
        textAlign: 'center',
        borderRadius: '0',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: 'none',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        marginTop: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <span>© 2026 FIFA World Cup Organizers. Managed by ArenaOS.</span>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ShieldAlert size={12} />
            WCAG 2.1 AA Compliant
          </span>
          <span>|</span>
          <span>Privacy & Security Regulations Apply</span>
        </div>
      </footer>

    </div>
  );
}

export default App;
