import { useState, useEffect } from 'react';
import { List } from 'lucide-react';

export default function TableOfContents({ sectionIds }: { sectionIds: { id: string; label: string }[] }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );

    sectionIds.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (sectionIds.length === 0) return null;

  return (
    <div
      className="rounded-2xl border overflow-hidden"
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
        <List className="size-3.5" style={{ color: 'var(--brand-primary)' }} />
        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          目录
        </span>
      </div>
      <nav className="p-2 space-y-0.5">
        {sectionIds.map(({ id, label }) => {
          const isActive = activeId === id;
          return (
            <button
              key={id}
              onClick={() => handleClick(id)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all duration-200"
              style={{
                background: isActive ? 'var(--brand-bg)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'var(--card-inner-bg)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <div
                className="size-1.5 rounded-full shrink-0 transition-all duration-200"
                style={{
                  background: isActive ? 'var(--brand-primary)' : 'var(--border-light)',
                  transform: isActive ? 'scale(1.2)' : 'scale(1)',
                }}
              />
              <span
                className="text-xs transition-all duration-200"
                style={{
                  color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
