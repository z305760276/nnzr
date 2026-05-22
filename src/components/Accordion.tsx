import { useState, createContext, useContext, type ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

const AccordionContext = createContext<{ openId: string | null; setOpenId: (id: string | null) => void; variant?: 'default' | 'kpi' }>({ openId: null, setOpenId: () => {} });

export function AccordionGroup({ children, className = '', variant }: { children: ReactNode; className?: string; variant?: 'default' | 'kpi' }) {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <AccordionContext.Provider value={{ openId, setOpenId, variant }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  id,
  title,
  summary,
  icon,
  badge,
  children
}: {
  id: string;
  title: string;
  summary: string;
  icon?: ReactNode;
  badge?: ReactNode;
  children: ReactNode;
}) {
  const { openId, setOpenId, variant } = useContext(AccordionContext);
  const isOpen = openId === id;
  const isKpi = variant === 'kpi';

  if (isKpi) {
    return (
      <div className={`kpi-card overflow-hidden transition-all duration-400 ${isOpen ? 'border-[var(--kpi-glass-border-active)]' : ''}`}>
        <button
          onClick={() => setOpenId(isOpen ? null : id)}
          className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors duration-300"
          style={{ background: isOpen ? 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)' : 'transparent' }}
        >
          <div className="flex items-center gap-4 min-w-0">
            {icon && (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
                style={{ background: isOpen ? 'var(--kpi-glow-blue)' : 'var(--kpi-glass-highlight)' }}>
                <span style={{ color: 'var(--kpi-accent-blue)' }}>{icon}</span>
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-base font-semibold tracking-tight" style={{ color: isOpen ? 'var(--kpi-accent-blue)' : 'var(--kpi-text-primary)' }}>{title}</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--kpi-text-muted)' }}>{summary}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-4">
            {badge}
            <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
              style={{ background: isOpen ? 'var(--kpi-glow-blue)' : 'var(--kpi-glass-highlight)' }}>
              <ChevronRight className={`w-4 h-4 transition-all duration-400 ${isOpen ? 'rotate-90' : ''}`}
                style={{ color: isOpen ? 'var(--kpi-accent-blue)' : 'var(--kpi-text-muted)' }} />
            </div>
          </div>
        </button>
        <div className="overflow-hidden transition-all duration-500 ease-out"
          style={{ maxHeight: isOpen ? '99999px' : '0px', opacity: isOpen ? 1 : 0 }}>
          <div className="px-6 pb-6 pt-1" style={{ borderTop: '1px solid var(--kpi-divider)' }}>
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden transition-all duration-300 rounded-xl glass-card"
      style={{
        background: isOpen ? 'var(--glass-bg-strong)' : 'var(--glass-bg)',
        borderColor: isOpen ? 'var(--glass-border-active)' : 'var(--glass-border)',
      }}
    >
      <button
        onClick={() => setOpenId(isOpen ? null : id)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
        style={{ background: isOpen ? 'var(--brand-bg)' : 'transparent' }}
        onMouseEnter={(e) => {
          if (!isOpen) e.currentTarget.style.background = 'var(--brand-bg)';
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.background = 'transparent';
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          {icon && <span className="shrink-0" style={{ color: 'var(--brand-primary)' }}>{icon}</span>}
          <div className="min-w-0">
            <h3 className={`text-base font-semibold truncate`} style={{ color: isOpen ? 'var(--brand-primary)' : 'var(--text-primary)' }}>{title}</h3>
            <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{summary}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          {badge}
          <ChevronRight
            className="w-4 h-4 transition-transform duration-300"
            style={{
              color: 'var(--brand-primary)',
              transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          />
        </div>
      </button>
      <div className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: isOpen ? '99999px' : '0px', opacity: isOpen ? 1 : 0 }}>
        <div className="px-5 pb-5 pt-1" style={{ borderTop: '1px solid var(--border-accent)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function SubAccordion({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className="mt-3 overflow-hidden rounded-lg glass-card-subtle"
      style={{
        background: 'var(--sub-accordion-panel-bg)',
        borderColor: 'var(--glass-border)',
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
        style={{ background: isOpen ? 'var(--brand-bg)' : 'transparent' }}
        onMouseEnter={(e) => {
          if (!isOpen) e.currentTarget.style.background = 'var(--brand-bg)';
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.background = 'transparent';
        }}
      >
        <span className="text-sm font-medium" style={{ color: isOpen ? 'var(--brand-primary)' : 'var(--text-secondary)' }}>{title}</span>
        <ChevronRight
          className="w-3.5 h-3.5 transition-transform duration-300"
          style={{
            color: 'var(--brand-primary)',
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            opacity: isOpen ? 1 : 0.5,
          }}
        />
      </button>
      <div className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: isOpen ? '99999px' : '0px', opacity: isOpen ? 1 : 0 }}>
        <div className="px-4 pb-4 pt-1">
          {children}
        </div>
      </div>
    </div>
  );
}
