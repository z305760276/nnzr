import { Search, X, ArrowLeft, Sun, Moon } from 'lucide-react';

interface TopNavProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  title?: string;
  TitleIcon?: React.FC<{ className?: string; style?: React.CSSProperties }>;
}

export default function TopNav({ searchQuery, onSearchChange, title, TitleIcon }: TopNavProps) {
  const isHome = !window.location.hash || window.location.hash === '#/' || window.location.hash === '#';

  const toggleTheme = () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('app-theme', next);
    html.classList.add('theme-transitioning');
    setTimeout(() => html.classList.remove('theme-transitioning'), 400);
  };

  const theme = typeof document !== 'undefined'
    ? document.documentElement.getAttribute('data-theme') || 'light'
    : 'light';

  const handleBack = () => {
    window.location.hash = '#/';
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-14"
      style={{
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid var(--nav-border)',
        boxShadow: 'var(--nav-shadow)',
      }}
    >
      <div className="h-full flex items-center px-4 md:px-6 gap-3 max-w-[1440px] mx-auto">
        <a href="#/" className="flex items-center gap-3 shrink-0">
          <img
            src="./logo.png"
            alt="中国燃气"
            className="h-7 w-auto object-contain"
            fetchPriority="high"
          />
          <div className="hidden sm:block">
            <span style={{ color: 'var(--brand-primary)', fontWeight: 500, fontSize: '0.75rem' }}>
              客户服务部管理图谱
            </span>
          </div>
        </a>

        {!isHome && (
          <>
            <div className="w-px h-5" style={{ background: 'var(--border-light)' }} />
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors shrink-0"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-bg)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">返回首页</span>
            </button>
            {title && (
              <>
                <div className="w-px h-5 hidden sm:block" style={{ background: 'var(--border-light)' }} />
                <div className="items-center gap-2 hidden sm:flex">
                  {TitleIcon && <TitleIcon className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />}
                  <span className="text-sm font-medium truncate max-w-[200px]" style={{ color: 'var(--text-primary)' }}>{title}</span>
                </div>
              </>
            )}
          </>
        )}

        <div className="flex-1 max-w-lg mx-auto relative">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300"
            style={{
              background: 'var(--card-glass)',
              border: '1px solid var(--border-subtle)',
              backdropFilter: 'blur(12px)',
            }}
            onFocus={(e) => {
              const parent = e.currentTarget;
              parent.style.borderColor = 'var(--border-hover)';
              parent.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.08)';
            }}
            onBlur={(e) => {
              const parent = e.currentTarget;
              parent.style.borderColor = 'var(--border-subtle)';
              parent.style.boxShadow = 'none';
            }}
          >
            <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="搜索岗位、隐患标准、制度条款..."
              className="flex-1 bg-transparent text-sm outline-none min-w-0"
              style={{ color: 'var(--text-primary)' }}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="p-0.5 rounded transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-bg)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg transition-all duration-300 shrink-0 relative overflow-hidden"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--brand-bg)';
            e.currentTarget.style.color = 'var(--brand-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          title={theme === 'dark' ? '切换白天模式' : '切换夜间模式'}
        >
          <div className="relative transition-transform duration-500" style={{
            transform: theme === 'dark' ? 'rotate(0deg)' : 'rotate(90deg)',
          }}>
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </div>
        </button>
      </div>
    </nav>
  );
}
