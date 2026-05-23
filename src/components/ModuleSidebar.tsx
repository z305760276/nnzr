import { useNavigate } from 'react-router-dom';
import { Users, Cpu, ShieldAlert, Gauge, BookOpen, LayoutDashboard, X } from 'lucide-react';

const MODULES = [
  { id: 'org', label: '组织架构', icon: Users, color: '#6366F1' },
  { id: 'workflow', label: '工单流转', icon: Cpu, color: '#0891B2' },
  { id: 'safety', label: '安检隐患', icon: ShieldAlert, color: '#DC2626' },
  { id: 'kpi', label: '财年指标', icon: Gauge, color: '#D97706' },
  { id: 'standards', label: '规范记分', icon: BookOpen, color: '#10B981' },
];

export default function ModuleSidebar({
  currentId,
  onClose,
  isOpen,
}: {
  currentId?: string;
  onClose?: () => void;
  isOpen?: boolean;
}) {
  const navigate = useNavigate();

  const handleNav = (id: string) => {
    if (id === 'standards') {
      navigate('/detail/standards');
    } else {
      navigate(`/detail/${id}`);
    }
    onClose?.();
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 shrink-0">
        <div
          className="sticky top-24 rounded-2xl border overflow-hidden transition-all duration-300"
          style={{
            background: 'var(--glass-bg)',
            borderColor: 'var(--glass-border)',
            backdropFilter: 'blur(20px) saturate(180%)',
            boxShadow: 'var(--glass-shadow)',
          }}
        >
          <div
            className="px-4 py-3 border-b flex items-center gap-2"
            style={{ borderColor: 'var(--glass-border)' }}
          >
            <LayoutDashboard className="size-3.5" style={{ color: 'var(--brand-primary)' }} />
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              模块导航
            </span>
          </div>
          <nav className="p-2 space-y-0.5">
            {MODULES.map((mod) => {
              const ModIcon = mod.icon;
              const isActive = currentId === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => handleNav(mod.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group"
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, ${mod.color}10, ${mod.color}05)`
                      : 'transparent',
                    border: isActive ? `1px solid ${mod.color}18` : '1px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'var(--card-inner-bg)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <div
                    className="size-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
                    style={{
                      background: isActive ? `${mod.color}15` : 'var(--card-inner-bg)',
                    }}
                  >
                    <ModIcon
                      className="size-3.5 transition-all duration-200"
                      style={{
                        color: isActive ? mod.color : 'var(--text-muted)',
                      }}
                    />
                  </div>
                  <span
                    className="text-xs font-medium transition-all duration-200"
                    style={{
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    }}
                  >
                    {mod.label}
                  </span>
                  {isActive && (
                    <div
                      className="ml-auto size-1.5 rounded-full"
                      style={{ background: mod.color }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile bottom sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={onClose}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-2xl border overflow-hidden animate-slide-up"
            style={{
              background: 'var(--page-bg)',
              borderColor: 'var(--glass-border)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--glass-border)' }}>
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>切换模块</span>
              <button onClick={onClose} className="p-1 rounded-lg" style={{ color: 'var(--text-muted)' }}>
                <X className="size-4" />
              </button>
            </div>
            <div className="p-3 max-h-[60vh] overflow-y-auto space-y-1">
              {MODULES.map((mod) => {
                const ModIcon = mod.icon;
                const isActive = currentId === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => handleNav(mod.id)}
                    className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all"
                    style={{
                      background: isActive ? `${mod.color}08` : 'transparent',
                    }}
                  >
                    <div
                      className="size-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${mod.color}12` }}
                    >
                      <ModIcon className="size-4" style={{ color: mod.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {mod.label}
                      </p>
                    </div>
                    {isActive && (
                      <div className="size-2 rounded-full" style={{ background: mod.color }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </>
  );
}
