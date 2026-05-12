import { Search, X, ArrowLeft, Sun, Moon } from 'lucide-react';

interface TopNavProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  /** 当前页面标题（详情页用） */
  title?: string;
  /** 标题图标组件 */
  TitleIcon?: React.FC<{ className?: string }>;
}

export default function TopNav({ searchQuery, onSearchChange, title, TitleIcon }: TopNavProps) {
  /** 判断当前是否为首页：HashRouter 下首页 hash 为 "#/" 或 "#" */
  const isHome = !window.location.hash || window.location.hash === '#/' || window.location.hash === '#';

  const toggleTheme = () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('app-theme', next);
    html.classList.add('theme-transitioning');
    setTimeout(() => html.classList.remove('theme-transitioning'), 400);
  };

  const theme = typeof document !== 'undefined'
    ? document.documentElement.getAttribute('data-theme') || 'dark'
    : 'dark';

  const handleBack = () => {
    window.location.hash = '#/';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-[var(--nav-bg)] backdrop-blur-md border-b border-[var(--border-light)]">
      <div className="h-full flex items-center px-4 md:px-6 gap-3 max-w-[1440px] mx-auto">
        {/* Logo */}
        <a href="#/" className="flex items-center gap-3 shrink-0">
          <img
            src="./logo.png"
            alt="中国燃气"
            className="h-7 w-auto object-contain"
          />
          <div className="hidden sm:block">
            <span className="text-[#C8102E] text-xs font-medium">客户服务部管理图谱</span>
          </div>
        </a>

        {/* 详情页的返回按钮 + 标题 */}
        {!isHome && (
          <>
            <div className="w-px h-5 bg-[var(--border-light)]" />
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[var(--brand-bg)] text-[var(--text-secondary)] transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">返回首页</span>
            </button>
            {title && (
              <>
                <div className="w-px h-5 bg-[var(--border-light)] hidden sm:block" />
                <div className="items-center gap-2 hidden sm:flex">
                  {TitleIcon && <TitleIcon className="w-4 h-4 text-[#C8102E]" />}
                  <span className="text-sm font-medium text-[var(--text-primary)] truncate max-w-[200px]">{title}</span>
                </div>
              </>
            )}
          </>
        )}

        {/* 搜索框 - 居中弹性 */}
        <div className="flex-1 max-w-lg mx-auto relative">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--card-glass)] border border-[var(--border-subtle)] rounded-lg focus-within:border-[var(--border-hover)] transition-colors">
            <Search className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="搜索岗位、隐患标准、制度条款..."
              className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none min-w-0"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="p-0.5 rounded hover:bg-[var(--brand-bg)] shrink-0"
              >
                <X className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
              </button>
            )}
          </div>
        </div>

        {/* 主题切换 */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg hover:bg-[var(--brand-bg)] text-[var(--text-secondary)] hover:text-[#C8102E] transition-colors shrink-0"
          title={theme === 'dark' ? '切换白天模式' : '切换夜间模式'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
      </div>
    </nav>
  );
}
