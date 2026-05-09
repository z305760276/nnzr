import { Home, ChevronRight } from 'lucide-react';
import { sectionLabels } from './Navigation';

interface BreadcrumbProps {
  section: string;
  subsection?: string;
}

export default function Breadcrumb({ section, subsection }: BreadcrumbProps) {
  const sectionLabel = sectionLabels[section] || section;

  return (
    <nav className="flex items-center gap-1.5 text-xs mb-6 py-2 px-3 bg-[var(--brand-bg)] border border-[var(--border-subtle)] rounded-lg w-fit">
      <Home className="w-3 h-3 text-[var(--text-secondary)]" />
      <span className="text-[var(--text-secondary)]">首页</span>
      <ChevronRight className="w-3 h-3 text-[var(--text-secondary)]/40" />
      <span className="text-[var(--accent)] font-medium">{sectionLabel}</span>
      {subsection && (
        <>
          <ChevronRight className="w-3 h-3 text-[var(--text-secondary)]/40" />
          <span className="text-[var(--text-primary)]">{subsection}</span>
        </>
      )}
    </nav>
  );
}
