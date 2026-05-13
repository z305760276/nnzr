import { useState } from 'react';
import { AccordionGroup, AccordionItem } from '../components/Accordion';
import { BookOpen, Eye } from 'lucide-react';
import FilePreview from '../components/FilePreview';

interface StandardItem {
  code: string;
  name: string;
  desc: string;
  link: string;
  tags: string[];
  hasContent: boolean;
}

const standards: StandardItem[] = [
  { code: '0.', name: '南宁市管道燃气工程技术标准（2019年修编版）', desc: '南宁市地方燃气工程技术标准，适用于南宁市管道燃气工程建设', link: './docs/0.《南宁市管道燃气工程技术标准》（2019年修编版）.pdf', tags: ['地方标准', '工程技术'], hasContent: true },
  { code: '1.', name: '燃气工程项目规范 GB55009-2021', desc: '燃气工程项目全过程技术规范，含设计、施工、验收等环节基本要求', link: './docs/1.《燃气工程项目规范》GB55009-2021.pdf', tags: ['国标', '项目规范'], hasContent: true },
  { code: '2.', name: '城镇燃气设计规范(2020年版) GB50028-2006', desc: '城镇燃气输配系统、用户燃气系统设计的基本要求和标准', link: './docs/2.《城镇燃气设计规范》(2020年版)GB50028-2006.pdf', tags: ['国标', '设计规范', '输配系统'], hasContent: true },
  { code: '3.', name: '城镇燃气室内工程施工与质量验收规范 CJJ94-2009', desc: '城镇燃气室内工程(含户内管、燃气表、燃烧器具等)施工质量验收标准', link: './docs/3.《城镇燃气室内工程施工与质量验收规范》CJJ94-2009.pdf', tags: ['行业标准', '施工验收', '室内工程'], hasContent: true },
  { code: '4.', name: '城镇燃气报警控制系统技术规程 CJJT146-2011', desc: '城镇燃气报警控制系统设计、安装、验收及维护的技术要求', link: './docs/4.《城镇燃气报警控制系统技术规程》CJJT146-2011.pdf', tags: ['行业标准', '报警控制', '安全'], hasContent: true },
  { code: '5.', name: '家用燃气燃烧器具安装及验收规程 CJJ12-2013', desc: '家用燃气灶、热水器等燃烧器具的安装与验收技术要求', link: './docs/5.《家用燃气燃烧器具安装及验收规程》CJJ12-2013.pdf', tags: ['行业标准', '燃烧器具', '安装验收'], hasContent: true },
  { code: '6.', name: '城镇燃气设施运行、维护和抢修安全技术规程 CJJ51-2016', desc: '城镇燃气设施运行维护和安全抢修的技术规程', link: './docs/6.《城镇燃气设施运行、维护和抢修安全技术规程》CJJ51-2016.pdf', tags: ['行业标准', '运行维护', '抢修规程'], hasContent: true },
];

export default function GBStandardsSection() {
  const [preview, setPreview] = useState<{ filePath: string; fileName: string; fileType: 'pdf' | 'xlsx' } | null>(null);

  return (
    <div className="space-y-6">
      <AccordionGroup className="space-y-3">
        {standards.map((s, i) => (
          <AccordionItem
            key={i}
            id={`gb-${i}`}
            title={`${s.code} ${s.name}`}
            summary={s.desc}
            icon={<BookOpen className="w-5 h-5" />}
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
                  onClick={() => setPreview({ filePath: s.link, fileName: `${s.code} ${s.name}.pdf`, fileType: 'pdf' })}
                  className="inline-flex items-center gap-1.5 text-xs text-[#C8102E] font-medium hover:underline cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  在线预览PDF →
                </button>
              ) : (
                <div className="bg-[var(--card-inner-bg)] border border-dashed border-[var(--border-light)] rounded-lg p-4 flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
                  <div>
                    <p className="text-xs text-[var(--text-secondary)]">
                      PDF 文件待上传
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
