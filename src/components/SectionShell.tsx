import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

interface SectionShellProps {
  id: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export default function SectionShell({ id, title, subtitle, icon, isOpen, onToggle, children }: SectionShellProps) {
  return (
    <div id={id} className="relative py-3">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:pl-64 relative z-10">
        <div
          className="overflow-hidden transition-all duration-300 glass-card"
          style={{
            background: isOpen ? 'var(--glass-bg-strong)' : 'var(--glass-bg)',
            borderColor: isOpen ? 'var(--glass-border-active)' : 'var(--glass-border)',
          }}
        >
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
            style={{
              background: isOpen ? 'var(--brand-bg)' : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (!isOpen) e.currentTarget.style.background = 'var(--brand-bg)';
            }}
            onMouseLeave={(e) => {
              if (!isOpen) e.currentTarget.style.background = 'transparent';
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="shrink-0" style={{ color: 'var(--brand-primary)' }}>{icon}</span>
              <div className="min-w-0">
                <h2
                  className="text-xl md:text-2xl font-bold truncate"
                  style={{ color: isOpen ? 'var(--brand-primary)' : 'var(--text-primary)' }}
                >
                  {title}
                </h2>
                <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
              </div>
            </div>
            <div className="shrink-0 ml-3">
              <ChevronRight
                className="w-5 h-5 transition-transform duration-300"
                style={{
                  color: 'var(--brand-primary)',
                  transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                }}
              />
            </div>
          </button>
          <div
            className="overflow-hidden transition-all duration-500 ease-in-out"
            style={{ maxHeight: isOpen ? '99999px' : '0px', opacity: isOpen ? 1 : 0 }}
          >
            <div
              className="px-5 pb-5 pt-1"
              style={{ borderTop: '1px solid var(--border-accent)' }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
