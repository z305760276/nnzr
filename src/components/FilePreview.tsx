import { useEffect, useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { FileSpreadsheet, FileText, Loader2, AlertCircle, FileType } from 'lucide-react';

interface FilePreviewProps {
  open: boolean;
  onClose: () => void;
  fileName: string;
  filePath: string;
  fileType: 'pdf' | 'xlsx' | 'xls' | 'docx';
}

interface ExcelSheetData {
  name: string;
  rows: string[][];
}

// 简易 HTML 清洗：仅保留 p/h1-h6/ul/ol/li/table/tr/td/th/strong/em/br，剔除所有内联 style/script/事件
function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return html;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script, style, link, meta').forEach(n => n.remove());
  doc.querySelectorAll('*').forEach(el => {
    // 移除事件与不安全的链接
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      if (name.startsWith('on')) el.removeAttribute(attr.name);
      if ((name === 'href' || name === 'src') && /^\s*javascript:/i.test(attr.value)) {
        el.removeAttribute(attr.name);
      }
    }
  });
  return doc.body.innerHTML;
}

export default function FilePreview({ open, onClose, fileName, filePath, fileType }: FilePreviewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [excelData, setExcelData] = useState<ExcelSheetData[]>([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [docxHtml, setDocxHtml] = useState('');

  const loadExcel = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setExcelData([]);
      setDocxHtml('');
      const resp = await fetch(filePath);
      if (!resp.ok) throw new Error('文件加载失败');
      const buf = await resp.arrayBuffer();
      const XLSX = await import('xlsx');
      const workbook = XLSX.read(new Uint8Array(buf), { type: 'array' });
      const sheets: ExcelSheetData[] = workbook.SheetNames.map(name => {
        const sheet = workbook.Sheets[name];
        const rows = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 });
        return { name, rows };
      });
      setExcelData(sheets);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '解析失败');
    } finally {
      setLoading(false);
    }
  }, [filePath]);

  const loadDocx = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setExcelData([]);
      setDocxHtml('');
      const resp = await fetch(filePath);
      if (!resp.ok) throw new Error('文件加载失败');
      const buf = await resp.arrayBuffer();
      const mammoth = await import('mammoth/mammoth.browser');
      const result = await mammoth.convertToHtml({ arrayBuffer: buf });
      setDocxHtml(sanitizeHtml(result.value));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '解析失败');
    } finally {
      setLoading(false);
    }
  }, [filePath]);

  useEffect(() => {
    if (!open) return;
    if (fileType === 'xlsx' || fileType === 'xls') {
      loadExcel();
    } else if (fileType === 'docx') {
      loadDocx();
    } else {
      setLoading(false);
    }
    return () => {
      setExcelData([]);
      setActiveSheet(0);
      setDocxHtml('');
      setError('');
    };
  }, [open, fileType, loadExcel, loadDocx]);

  const typeIcon = (() => {
    if (fileType === 'xlsx' || fileType === 'xls') return <FileSpreadsheet className="w-5 h-5 text-[#10B981]" />;
    if (fileType === 'docx') return <FileType className="w-5 h-5 text-[#3B82F6]" />;
    return <FileText className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />;
  })();

  const typeBadge = (() => {
    if (fileType === 'xlsx') return 'Excel';
    if (fileType === 'xls') return 'Excel 97-03';
    if (fileType === 'docx') return 'Word';
    return 'PDF';
  })();

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="!inset-0 !top-0 !left-0 !translate-x-0 !translate-y-0 !w-screen !h-screen !max-w-none !rounded-none p-0 gap-0 flex flex-col bg-[var(--page-bg)] border-0">
        <DialogTitle className="sr-only">{fileName}</DialogTitle>

        <div className="flex items-center gap-3 px-6 py-4 shrink-0" style={{ background: 'var(--brand-primary)' }}>
          {typeIcon}
          <span className="text-sm font-medium text-white truncate">{fileName}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-white/80 border border-white/20 ml-auto shrink-0">
            {typeBadge}
          </span>
        </div>

        <div className="flex-1 overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--brand-primary)' }} />
                <span className="text-xs text-[var(--text-secondary)]">加载中...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3 text-center px-6">
                <AlertCircle className="w-8 h-8 text-[#EF4444]" />
                <p className="text-sm text-[var(--text-primary)] font-medium">预览失败</p>
                <p className="text-xs text-[var(--text-secondary)]">{error}</p>
                <a href={filePath} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium hover:underline mt-2" style={{ color: 'var(--brand-primary)' }}>
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  下载文件查看
                </a>
              </div>
            </div>
          )}

          {!loading && !error && fileType === 'pdf' && (
            <iframe
              src={`${filePath}#view=FitH&toolbar=1`}
              className="w-full h-full border-0"
              title={fileName}
            />
          )}

          {!loading && !error && fileType === 'docx' && (
            <div className="h-full overflow-auto bg-white">
              <div
                className="max-w-3xl mx-auto px-10 py-8 text-sm leading-relaxed text-gray-800"
                // mammoth 输出已通过 sanitizeHtml 清洗
                dangerouslySetInnerHTML={{ __html: docxHtml || '<p class="text-center text-gray-400 py-12">（空文档）</p>' }}
              />
            </div>
          )}

          {!loading && !error && (fileType === 'xlsx' || fileType === 'xls') && excelData.length > 0 && (
            <div className="flex flex-col h-full">
              {excelData.length > 1 && (
                <div className="flex gap-1 px-6 py-2 border-b border-[var(--border-light)] bg-[var(--card-inner-bg)] shrink-0 overflow-x-auto">
                  {excelData.map((sheet, i) => (
                    <button key={i} onClick={() => setActiveSheet(i)}
                      className={`text-[11px] px-3 py-1 rounded-md whitespace-nowrap transition-colors ${
                        activeSheet === i
                          ? 'text-white font-medium'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-light)]'
                      }`}
                      style={activeSheet === i ? { background: 'var(--brand-primary)' } : {}}>
                      {sheet.name}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex-1 overflow-auto">
                <table className="w-full border-collapse text-xs">
                  <tbody>
                    {excelData[activeSheet]?.rows.map((row, ri) => (
                      <tr key={ri} className={ri === 0 ? 'bg-[var(--card-inner-bg)]' : 'hover:bg-[var(--card-inner-bg)]/50'}>
                        {row.map((cell, ci) => (
                          <td key={ci}
                            className={`px-4 py-2 border border-[var(--border-light)] whitespace-nowrap ${
                              ri === 0 ? 'font-medium text-white' : 'text-[var(--text-secondary)]'
                            }`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
