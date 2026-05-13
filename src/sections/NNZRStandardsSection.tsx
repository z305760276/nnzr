import { useState } from 'react';
import { AccordionGroup, AccordionItem } from '../components/Accordion';
import { BookOpen, Eye, ExternalLink, FileText } from 'lucide-react';
import FilePreview from '../components/FilePreview';

interface NNZRItem {
  code: string;
  name: string;
  desc: string;
  link: string | null;
  tags: string[];
  isDocx?: boolean;
}

const items: NNZRItem[] = [
  { code: '1', name: '南宁中燃客户服务部管理组织架构及岗位职责', desc: '客户服务部组织架构、各部门职责及岗位说明书', link: './docs/附件：1.南宁中燃客户服务部管理组织架构及岗位职责.pdf', tags: ['组织架构', '岗位职责'] },
  { code: '2', name: '南宁中燃客户服务部管理制度', desc: '客户服务部综合管理制度，涵盖服务标准、工作流程及管理要求', link: './docs/附件：2.南宁中燃客户服务部管理制度.docx', tags: ['管理制度', '服务标准'], isDocx: true },
  { code: '3', name: '南宁中燃客户服务部安检管理制度', desc: '客户服务部安检工作管理制度、安检流程及检查标准', link: './docs/附件：3.南宁中燃客户服务部安检管理制度.pdf', tags: ['安检', '管理制度'] },
  { code: '4', name: '南宁中燃客户服务部隐患管理制度', desc: '客户服务部隐患排查、分级、整改及闭环管理制度', link: './docs/附件：4.南宁中燃客户服务部隐患管理制度.pdf', tags: ['隐患', '管理制度'] },
];

export default function NNZRStandardsSection() {
  const [preview, setPreview] = useState<{ filePath: string; fileName: string; fileType: 'pdf' | 'xlsx' } | null>(null);

  return (
    <div className="space-y-6">
      <AccordionGroup className="space-y-3">
        {items.map((s, i) => (
          <AccordionItem
            key={i}
            id={`nnzr-${i}`}
            title={`附件：${s.code}.${s.name}`}
            summary={s.desc}
            icon={s.isDocx ? <FileText className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
            badge={
              s.link
                ? <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(16,185,129,0.08)] text-[#10B981] border border-[rgba(16,185,129,0.15)]">已收录</span>
                : <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(245,158,11,0.08)] text-[#F59E0B] border border-[rgba(245,158,11,0.15)]">待收录</span>
            }
          >
            <div className="space-y-3">
              {s.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map((tag, ti) => (
                    <span key={ti} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--card-inner-bg)] text-[var(--text-secondary)] border border-[var(--border-light)]">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              {s.link && s.isDocx ? (
                <a
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#C8102E] font-medium hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  下载查看文档 →
                </a>
              ) : s.link ? (
                <button
                  onClick={() => setPreview({ filePath: s.link!, fileName: `附件：${s.code}.${s.name}.pdf`, fileType: 'pdf' })}
                  className="inline-flex items-center gap-1.5 text-xs text-[#C8102E] font-medium hover:underline cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  在线预览PDF →
                </button>
              ) : (
                <div className="bg-[var(--card-inner-bg)] border border-dashed border-[var(--border-light)] rounded-lg p-4 flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
                  <p className="text-xs text-[var(--text-secondary)]">
                    待上传
                  </p>
                </div>
              )}
            </div>
          </AccordionItem>
        ))}
      </AccordionGroup>

      {preview && (
        <FilePreview
          open={!!preview}
          onClose={() => setPreview(null)}
          fileName={preview.fileName}
          filePath={preview.filePath}
          fileType={preview.fileType}
        />
      )}
    </div>
  );
}
