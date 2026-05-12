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
          className={`dark-card bg-[rgba(13,25,48,0.5)] border rounded-xl overflow-hidden transition-all duration-300 ${
            isOpen
              ? 'border-[rgba(200,16,46,0.3)] shadow-[0_0_20px_rgba(200,16,46,0.06)]'
              : 'border-[rgba(200,16,46,0.08)] hover:border-[var(--border-subtle)]'
          }`}
        >
          <button
            onClick={onToggle}
            className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors ${
              isOpen ? 'bg-[var(--brand-bg)]' : 'hover:bg-[rgba(200,16,46,0.03)]'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-[#C8102E] shrink-0">{icon}</span>
              <div className="min-w-0">
                <h2
                  className={`text-xl md:text-2xl font-bold truncate ${
                    isOpen ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'
                  }`}
                >
                  {title}
                </h2>
                <p className="text-xs text-white truncate mt-0.5">{subtitle}</p>
              </div>
            </div>
            <div className="shrink-0 ml-3">
              <ChevronRight
                className={`w-5 h-5 text-[#C8102E] transition-transform duration-300 ${
                  isOpen ? 'rotate-90' : ''
                }`}
              />
            </div>
          </button>
          <div
            className="overflow-hidden transition-all duration-500 ease-in-out"
            style={{ maxHeight: isOpen ? '99999px' : '0px', opacity: isOpen ? 1 : 0 }}
          >
            <div className="px-5 pb-5 pt-1 border-t border-[rgba(200,16,46,0.06)]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
