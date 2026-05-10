import { useState } from 'react';
import { FileText, ExternalLink, BookOpen, X } from 'lucide-react';
import type { PdfSearchResult } from '../data/searchIndex';

interface PdfSearchResultsProps {
  results: PdfSearchResult[];
  query: string;
  loading: boolean;
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query) return text;

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

/** 预览卡片 — 展示完整搜索结果 */
function PreviewCard({ result, query, onClose }: {
  result: PdfSearchResult;
  query: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[var(--card-solid)] border border-[var(--border-subtle)] rounded-xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
        {/* 标题栏 */}
        <div className="dark-card flex items-center justify-between px-4 py-3 border-b border-[var(--border-light)] bg-[var(--accordion-panel-bg)]">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <FileText className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
            <span className="text-sm text-[var(--text-primary)] truncate font-medium">{result.title}</span>
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
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-[var(--brand-bg)] ml-2">
            <X className="w-4 h-4 text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* 正文 */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-3">
            <div>
              <span className="text-[10px] text-[var(--text-secondary)]/40 uppercase tracking-wider">匹配内容</span>
              <div className="mt-1.5 p-3 rounded-lg bg-[var(--accordion-panel-bg)] border border-[var(--border-light)]">
                <p className="text-sm text-[var(--text-secondary)]/80 leading-relaxed whitespace-pre-wrap">
                  {highlightText(result.content, query)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        <div className="px-4 py-3 border-t border-[var(--border-light)] bg-[var(--accordion-panel-bg)] flex items-center justify-end gap-2">
          <a
            href={result.pdfLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C8102E] text-white text-xs font-medium hover:opacity-90 transition-opacity"
          >
            打开 PDF 阅读原文
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function PdfSearchResults({ results, query, loading }: PdfSearchResultsProps) {
  const [previewItem, setPreviewItem] = useState<PdfSearchResult | null>(null);

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
    <>
      <div>
        <div className="px-4 py-2 flex items-center gap-1.5 border-b border-[var(--border-light)]">
          <BookOpen className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="text-xs text-[var(--text-secondary)]">
            法规文档搜索 — 找到 {results.length} 条结果
          </span>
        </div>
        <div>
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => setPreviewItem(result)}
              className="w-full text-left flex items-start gap-2.5 px-4 py-2.5 hover:bg-[var(--brand-bg)] transition-colors group border-b border-[var(--border-light)]/50 last:border-0"
            >
              <FileText className="w-4 h-4 mt-1 text-[var(--text-secondary)]/40 group-hover:text-[var(--accent)] flex-shrink-0 transition-colors" />
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
                </div>
                <p className="text-xs text-[var(--text-secondary)]/70 mt-1 leading-relaxed line-clamp-4">
                  {highlightText(result.content, query)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 预览卡片 */}
      {previewItem && (
        <PreviewCard result={previewItem} query={query} onClose={() => setPreviewItem(null)} />
      )}
    </>
  );
}
