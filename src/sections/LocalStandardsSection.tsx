import { useState } from 'react';
import { AccordionGroup, AccordionItem } from '../components/Accordion';
import { Scale, Eye } from 'lucide-react';
import FilePreview from '../components/FilePreview';

interface LocalStandardItem {
  name: string;
  desc: string;
  link: string;
  tags: string[];
  hasContent: boolean;
}

const standards: LocalStandardItem[] = [
  {
    name: '广西壮族自治区燃气管理条例',
    desc: '广西行政区域内燃气规划、建设、经营、使用和管理的条例',
    link: './docs/广西燃气管理条例（公告+文本）2023-3-30.pdf',
    tags: ['广西', '管理条例'],
    hasContent: true,
  },
  {
    name: '南宁市燃气管理条例',
    desc: '南宁市燃气设施建设和用户服务管理的地方性法规',
    link: './docs/南宁市燃气管理条例（2021-08-06发布实施）.doc',
    tags: ['南宁', '管理条例'],
    hasContent: true,
  },
  {
    name: '关于明确燃气设施保护范围及有关要求的通知',
    desc: '南宁市燃气设施保护范围界定及相关管理要求',
    link: './docs/关于明确燃气设施保护范围及有关要求的通知 (南宁住建).pdf',
    tags: ['南宁', '设施保护', '住建'],
    hasContent: true,
  },
  {
    name: '南宁市市区管道燃气价格联动有关事项的通知',
    desc: '南宁市发改委关于管道燃气价格联动机制的实施通知',
    link: './docs/南宁市发展和改革委员会关于南宁市市区管道燃气价格联动有关事项的通知_南发改规〔2025〕4号.pdf',
    tags: ['南宁', '价格联动', '发改委'],
    hasContent: true,
  },
];

export default function LocalStandardsSection() {
  const [preview, setPreview] = useState<{ filePath: string; fileName: string; fileType: 'pdf' | 'xlsx' } | null>(null);

  return (
    <div className="space-y-6">
      <AccordionGroup className="space-y-3">
        {standards.map((s, i) => (
          <AccordionItem
            key={i}
            id={`local-${i}`}
            title={s.name}
            summary={s.desc}
            icon={<Scale className="w-5 h-5" />}
            badge={
              s.hasContent
                ? <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(16,185,129,0.08)] text-[#10B981] border border-[rgba(16,185,129,0.15)]">已收录</span>
                : <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(245,158,11,0.08)] text-[#F59E0B] border border-[rgba(245,158,11,0.15)]">待收录</span>
            }
          >
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {s.tags.map((tag, ti) => (
                  <span key={ti} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--card-inner-bg)] text-[var(--text-secondary)] border border-[var(--border-light)]">
                    #{tag}
                  </span>
                ))}
              </div>

              {s.link ? (
                <button
                  onClick={() => setPreview({ filePath: s.link, fileName: `${s.name}.pdf`, fileType: 'pdf' })}
                  className="inline-flex items-center gap-1.5 text-xs text-[#C8102E] font-medium hover:underline cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  在线预览 →
                </button>
              ) : (
                <div className="bg-[var(--card-inner-bg)] border border-dashed border-[var(--border-light)] rounded-lg p-4 flex items-center gap-3">
                  <Scale className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
                  <div>
                    <p className="text-xs text-[var(--text-secondary)]">
                      文件待补充
                    </p>
                  </div>
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
