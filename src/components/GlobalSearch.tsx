import { useState, useEffect, useRef } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { search, searchPdf } from '../data/searchIndex';
import type { PdfSearchResult } from '../data/searchIndex';
import PdfSearchResults from './PdfSearchResults';

interface GlobalSearchPanelProps {
  query: string;
  onClose: () => void;
  onSelect: (section: string) => void;
}

export default function GlobalSearchPanel({ query, onClose, onSelect }: GlobalSearchPanelProps) {
  const results = query.length >= 1 ? search(query) : [];
  const [pdfResults, setPdfResults] = useState<PdfSearchResult[]>([]);
  const [pdfLoading, setPdfLoading] = useState(false);
  const lastQueryRef = useRef('');
  const timeoutIds = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current = [];
    const q = query;

    if (!q || q.length < 1) {
      lastQueryRef.current = '';
      const id = setTimeout(() => {
        setPdfResults([]);
        setPdfLoading(false);
      });
      timeoutIds.current.push(id);
      return;
    }

    if (q === lastQueryRef.current) return;
    lastQueryRef.current = q;

    const id2 = setTimeout(() => {
      setPdfLoading(true);
    });
    timeoutIds.current.push(id2);

    searchPdf(q).then((res) => {
      if (lastQueryRef.current === q) {
        setPdfResults(res);
        setPdfLoading(false);
      }
    });
  }, [query]);

  // 只有当完全没有结果（包括系统搜索和PDF搜索都无结果）时才显示"未找到"
  const systemEmpty = results.length === 0;
  const pdfEmpty = pdfResults.length === 0 && !pdfLoading;

  if (!query) return null;

  return (
    <div className="fixed inset-0 z-[70] pt-14">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative max-w-lg mx-auto mt-2 bg-[var(--card-solid)] border border-[var(--border-subtle)] rounded-xl shadow-2xl overflow-hidden max-h-[75vh] flex flex-col">
        <div className="dark-card flex items-center justify-between px-4 py-2.5 border-b border-[var(--border-light)] bg-[var(--accordion-panel-bg)]">
          <span className="text-[var(--text-secondary)]/50 text-xs">
            系统 {results.length} 条 · 法规 {pdfLoading ? '检索中...' : `${pdfResults.length} 条`}
          </span>
          <button onClick={onClose} className="p-1 rounded hover:bg-[var(--brand-bg)]">
            <X className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-1">
          {/* 现有系统搜索结果 */}
          {systemEmpty && pdfLoading ? (
            <div className="px-4 py-8 text-center">
              <div className="animate-pulse flex flex-col items-center gap-2">
                <div className="w-5 h-5 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
                <p className="text-xs text-[var(--text-secondary)]">正在检索...</p>
              </div>
            </div>
          ) : (
            <>
              {/* PDF 搜索结果（如果有，优先展示） */}
              {!pdfLoading && pdfResults.length > 0 && (
                <PdfSearchResults
                  results={pdfResults}
                  query={query}
                  loading={false}
                />
              )}

              {/* 系统搜索结果 */}
              {results.length > 0 && (
                <>
                  {pdfResults.length > 0 && (
                    <div className="px-4 py-1.5">
                      <div className="h-px bg-[var(--border-light)]" />
                    </div>
                  )}
                  <div className="px-4 py-1.5">
                    <span className="text-[10px] text-[var(--text-secondary)]/40 uppercase tracking-wider">系统数据</span>
                  </div>
                  {results.slice(0, 30).map((result) => (
                    <button key={result.id} className="w-full text-left px-4 py-2 flex items-start gap-2.5 hover:bg-[var(--brand-bg)] transition-colors group"
                      onClick={() => { onSelect(result.section); onClose(); }}>
                      <ArrowRight className="w-3.5 h-3.5 mt-0.5 text-[var(--text-secondary)]/30 group-hover:text-[var(--brand-primary)] flex-shrink-0 transition-colors" />
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
                  ))}
                </>
              )}

              {/* 全部无结果 */}
              {systemEmpty && pdfEmpty && !pdfLoading && (
                <div className="px-4 py-8 text-center">
                  <p className="text-[var(--text-secondary)] text-sm">未找到与 "{query}" 相关的内容</p>
                  <p className="text-[var(--text-secondary)]/40 text-xs mt-1">试试其他关键词，或直接在文档中搜索</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
