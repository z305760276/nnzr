import { useState, createContext, useContext, type ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

const AccordionContext = createContext<{ openId: string | null; setOpenId: (id: string | null) => void }>({ openId: null, setOpenId: () => {} });

// ===== 一级手风琴容器（同层级互斥） =====
export function AccordionGroup({ children, className = '' }: { children: ReactNode; className?: string }) {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <AccordionContext.Provider value={{ openId, setOpenId }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
}

// ===== 一级手风琴项（互斥展开） =====
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
  const { openId, setOpenId } = useContext(AccordionContext);
  const isOpen = openId === id;

  return (
    <div className={`dark-card bg-[var(--accordion-panel-bg)] border rounded-xl overflow-hidden transition-all ${isOpen ? 'border-[rgba(200,16,46,0.3)] shadow-[0_0_20px_rgba(200,16,46,0.06)]' : 'border-[rgba(200,16,46,0.08)] hover:border-[var(--border-subtle)]'}`}>
      <button
        onClick={() => setOpenId(isOpen ? null : id)}
        className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors ${isOpen ? 'bg-[var(--brand-bg)]' : 'hover:bg-[rgba(200,16,46,0.03)]'}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {icon && <span className="text-[#C8102E] shrink-0">{icon}</span>}
          <div className="min-w-0">
            <h3 className={`text-base font-semibold truncate ${isOpen ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>{title}</h3>
            <p className="text-xs text-white truncate mt-0.5">{summary}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          {badge}
          <ChevronRight className={`w-4 h-4 text-[#C8102E] transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
        </div>
      </button>
      <div className="overflow-hidden transition-all duration-500 ease-in-out" style={{ maxHeight: isOpen ? '99999px' : '0px', opacity: isOpen ? 1 : 0 }}>
        <div className="px-5 pb-5 pt-1 border-t border-[rgba(200,16,46,0.06)]">
          {children}
        </div>
      </div>
    </div>
  );
}

// ===== 二级子折叠（不互斥，可自由展开） =====
export function SubAccordion({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="dark-card bg-[var(--sub-accordion-panel-bg)] border border-[rgba(200,16,46,0.06)] rounded-lg mt-3 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${isOpen ? 'bg-[rgba(200,16,46,0.04)]' : 'hover:bg-[rgba(200,16,46,0.02)]'}`}
      >
        <span className={`text-sm font-medium ${isOpen ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>{title}</span>
        <ChevronRight className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${isOpen ? 'rotate-90 text-[#C8102E]' : ''}`} />
      </button>
      <div className="overflow-hidden transition-all duration-500 ease-in-out" style={{ maxHeight: isOpen ? '99999px' : '0px', opacity: isOpen ? 1 : 0 }}>
        <div className="px-4 pb-4 pt-1">
          {children}
        </div>
      </div>
    </div>
  );
}
