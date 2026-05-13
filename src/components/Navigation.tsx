import { useState, useEffect } from 'react';
import { Search, Menu, X, ChevronRight, Network, Cpu, ShieldAlert, BarChart3, BookOpen, Scale, Gavel, ClipboardCheck } from 'lucide-react';

export const navSections = [
  { id: 'org-hierarchy', label: '组织架构', icon: Network },
  { id: 'workflow', label: 'CRM工单流转', icon: Cpu },
  { id: 'safety-check', label: '安检与隐患', icon: ShieldAlert },
  { id: 'kpi-dashboard', label: '财年指标', icon: BarChart3 },
];

export const extraSections = [
  { id: 'gb-standards', label: '国标', icon: BookOpen },
  { id: 'local-standards', label: '地方规范', icon: Scale },
  { id: 'laws', label: '法规', icon: Gavel },
  { id: 'safety-score', label: '安全记分标准', icon: ShieldAlert },
  { id: 'service-score', label: '客服记分标准', icon: ClipboardCheck },
];

export const sectionLabels: Record<string, string> = {
  'org-hierarchy': '组织架构',
  'workflow': 'CRM工单流转',
  'safety-check': '安检与隐患',
  'kpi-dashboard': '财年指标',
  'gb-standards': '国标',
  'local-standards': '地方规范',
  'laws': '法规',
  'safety-score': '安全记分标准',
  'service-score': '客服记分标准',
};

interface NavigationProps {
  activeSection: string;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export default function Navigation({ activeSection, onSearch, searchQuery }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const renderNavItem = (sec: typeof navSections[0], isExtra = false) => {
    const Icon = sec.icon;
    const isActive = activeSection === sec.id;
    return (
      <button
        key={sec.id}
        onClick={() => scrollTo(sec.id)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
          isActive
            ? 'bg-[var(--brand-bg-hover)] text-[var(--text-primary)] border-l-2 border-[#C8102E]'
            : 'text-[var(--text-secondary)] hover:bg-[var(--brand-bg)] hover:text-[var(--text-primary)]'
        } ${isExtra ? 'opacity-70' : ''}`}
      >
        <Icon className={`w-4 h-4 ${isActive ? 'text-[#C8102E]' : 'text-[var(--text-secondary)]'}`} />
        <span>{sec.label}</span>
        {isActive && <ChevronRight className="w-3 h-3 ml-auto text-[#C8102E]" />}
        {isExtra && <span className="ml-auto text-[10px] text-[var(--text-secondary)]/40">待补充</span>}
      </button>
    );
  };

  return (
    <>
      {/* Top Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 h-14 transition-all duration-300 ${
        scrolled ? 'bg-[var(--nav-bg)] backdrop-blur-md border-b border-[rgba(200,16,46,0.15)]' : 'bg-[var(--page-bg)]/80'
      }`}>
        <div className="h-full flex items-center px-4 md:px-6 gap-3">
          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-[var(--brand-bg)] text-[var(--text-secondary)]">
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-md bg-[#C8102E]/20 flex items-center justify-center">
              <Network className="w-4 h-4 text-[#C8102E]" />
            </div>
            <div className="hidden sm:block">
              <span className="text-[var(--text-primary)] text-sm font-bold leading-tight">南宁中燃</span>
              <span className="text-[#C8102E] text-xs ml-1.5">管理图谱 v3.0</span>
            </div>
          </div>

          <div className="flex-1 max-w-lg mx-auto relative">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--card-glass)] border border-[var(--border-subtle)] rounded-lg focus-within:border-[var(--border-hover)] transition-colors">
              <Search className="w-4 h-4 text-[var(--text-secondary)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="搜索岗位、隐患标准、制度条款..."
                className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none"
              />
              {searchQuery && (
                <button onClick={() => onSearch('')} className="p-0.5 rounded hover:bg-[var(--brand-bg)]">
                  <X className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Left Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-14 bottom-0 w-56 z-40 border-r border-[var(--border-light)] bg-[var(--nav-bg)] backdrop-blur-sm overflow-y-auto">
        <div className="p-4">
          <p className="text-[var(--text-secondary)]/50 text-[10px] font-semibold uppercase tracking-wider px-3 mb-2">核心业务</p>
          <div className="space-y-1">
            {navSections.map(sec => renderNavItem(sec))}
          </div>

          <div className="my-4 border-t border-[var(--border-light)]" />

          <p className="text-[var(--text-secondary)]/50 text-[10px] font-semibold uppercase tracking-wider px-3 mb-2">规范标准</p>
          <div className="space-y-1">
            {extraSections.map(sec => renderNavItem(sec, true))}
          </div>

          <div className="my-4 border-t border-[var(--border-light)]" />
          <p className="text-[var(--text-secondary)]/30 text-[10px] px-3 leading-relaxed">
            标"待补充"的模块内容正在整理中，可先联系部门管理员获取纸质文件。
          </p>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-[var(--text-secondary)]/30 text-[10px] text-center">v3.0_20260502</p>
        </div>
      </aside>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-[var(--card-solid)] border-r border-[rgba(200,16,46,0.15)] p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[var(--text-primary)] font-bold">管理图谱 v3.0</span>
              <button onClick={() => setMobileMenuOpen(false)}><X className="w-5 h-5 text-[var(--text-secondary)]" /></button>
            </div>
            <p className="text-[var(--text-secondary)]/50 text-[10px] font-semibold uppercase tracking-wider mb-2">核心业务</p>
            <div className="space-y-1 mb-4">
              {navSections.map(sec => renderNavItem(sec))}
            </div>
            <p className="text-[var(--text-secondary)]/50 text-[10px] font-semibold uppercase tracking-wider mb-2">规范标准</p>
            <div className="space-y-1">
              {extraSections.map(sec => renderNavItem(sec, true))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
