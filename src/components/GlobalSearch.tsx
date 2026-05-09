import { X, ArrowRight } from 'lucide-react';
import { search } from '../data/searchIndex';

interface GlobalSearchPanelProps {
  query: string;
  onClose: () => void;
  onSelect: (section: string) => void;
}

export default function GlobalSearchPanel({ query, onClose, onSelect }: GlobalSearchPanelProps) {
  const results = query.length >= 1 ? search(query) : [];

  if (!query) return null;

  return (
    <div className="fixed inset-0 z-[70] pt-14">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative max-w-lg mx-auto mt-2 bg-[var(--card-solid)] border border-[var(--border-subtle)] rounded-xl shadow-2xl overflow-hidden max-h-[70vh] flex flex-col">
        <div className="dark-card flex items-center justify-between px-4 py-2.5 border-b border-[var(--border-light)] bg-[var(--accordion-panel-bg)]">
          <span className="text-[var(--text-secondary)]/50 text-xs">找到 {results.length} 条结果</span>
          <button onClick={onClose} className="p-1 rounded hover:bg-[var(--brand-bg)]"><X className="w-3.5 h-3.5 text-[var(--text-secondary)]" /></button>
        </div>
        <div className="flex-1 overflow-y-auto py-1">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-[var(--text-secondary)] text-sm">未找到与 "{query}" 相关的内容</p>
            </div>
          ) : (
            results.slice(0, 30).map((result, _idx) => (
              <button key={result.id} className="w-full text-left px-4 py-2.5 flex items-start gap-2.5 hover:bg-[var(--brand-bg)] transition-colors group"
                onClick={() => { onSelect(result.section); onClose(); }}>
                <ArrowRight className="w-3.5 h-3.5 mt-0.5 text-[var(--text-secondary)]/30 group-hover:text-[#C8102E] flex-shrink-0 transition-colors" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate">{result.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded flex-shrink-0"
                      style={{ background: `${result.categoryColor}15`, color: result.categoryColor, border: `1px solid ${result.categoryColor}30` }}>
                      {result.category}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]/60 truncate mt-0.5">{result.content.slice(0, 60)}{result.content.length > 60 ? '...' : ''}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
