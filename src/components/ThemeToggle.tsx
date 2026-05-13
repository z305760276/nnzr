import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const theme = typeof document !== 'undefined'
    ? document.documentElement.getAttribute('data-theme') || 'light'
    : 'light';

  const toggle = () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('app-theme', next);
    html.classList.add('theme-transitioning');
    setTimeout(() => html.classList.remove('theme-transitioning'), 400);
  };

  return (
    <button
      onClick={toggle}
      className="p-1.5 rounded-lg hover:bg-[var(--brand-bg)] text-[var(--text-secondary)] hover:text-[#C8102E] transition-colors"
      title={theme === 'dark' ? '切换白天模式' : '切换夜间模式'}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}
