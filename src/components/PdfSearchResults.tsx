import { FileText, ExternalLink, BookOpen } from 'lucide-react';
import type { PdfSearchResult } from '../data/searchIndex';

interface PdfSearchResultsProps {
  results: PdfSearchResult[];
  query: string;
  loading: boolean;
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query) return text;

  // 将查询词拆成单个字符用于高亮
  const q = query.toLowerCase().trim();
  const idx = text.toLowerCase().indexOf(q);
  if (idx === -1) return text;

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + q.length);
  const after = text.slice(idx + q.length);

  return (
    <>
      {before}
      <span className="text-[var(--accent)] font-medium">{match}</span>
      {after}
    </>
  );
}

export default function PdfSearchResults({ results, query, loading }: PdfSearchResultsProps) {
  if (loading) {
    return (
      <div className="px-4 py-8 text-center">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="w-5 h-5 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
          <p className="text-xs text-[var(--text-secondary)]">正在检索 PDF 文档...</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) return null;

  return (
    <div>
      <div className="px-4 py-2 flex items-center gap-1.5 border-b border-[var(--border-light)]">
        <BookOpen className="w-3.5 h-3.5 text-[var(--accent)]" />
        <span className="text-xs text-[var(--text-secondary)]">
          法规文档搜索 — 找到 {results.length} 条结果
        </span>
      </div>
      <div>
        {results.map((result) => (
          <a
            key={result.id}
            href={result.pdfLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-[var(--brand-bg)] transition-colors group border-b border-[var(--border-light)]/50 last:border-0"
          >
            <FileText className="w-4 h-4 mt-0.5 text-[var(--text-secondary)]/40 group-hover:text-[var(--accent)] flex-shrink-0 transition-colors" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate font-medium">
                  {result.title}
                </span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{
                    background: `${result.categoryColor}15`,
                    color: result.categoryColor,
                    border: `1px solid ${result.categoryColor}30`,
                  }}
                >
                  {result.category}
                </span>
                <ExternalLink className="w-3 h-3 text-[var(--text-secondary)]/30 flex-shrink-0 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-[var(--text-secondary)]/70 mt-1 leading-relaxed line-clamp-2">
                {highlightText(result.content, query)}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
