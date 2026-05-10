import { AccordionGroup, AccordionItem } from '../components/Accordion';
import { BookOpen, ExternalLink, FileSpreadsheet } from 'lucide-react';

interface GroupItem {
  code: string;
  name: string;
  desc: string;
  link: string;
  tags: string[];
  isExcel: boolean;
}

const items: GroupItem[] = [
  { code: '1', name: '中燃集团客服业务红黄线及负面清单记分管理规定', desc: '中燃集团客服业务红线、黄线行为界定及负面清单记分管理要求', link: './docs/附件1.《中燃集团客服业务红黄线及负面清单记分管理规定》.pdf', tags: ['集团', '红黄线', '记分管理'], isExcel: false },
  { code: '2', name: '中燃集团客服条口红黄线考核细则', desc: '中燃集团客服条线各岗位红黄线行为考核具体细则和记分标准', link: './docs/附件2.《中燃集团客服条口红黄线考核细则》.xlsx', tags: ['集团', '红黄线', '考核细则'], isExcel: true },
  { code: '3', name: '客户服务部负面清单记分标准', desc: '客户服务部负面清单记分标准，明确各违规行为对应的扣分分值', link: './docs/附件3.《客户服务部负面清单记分标准》.xlsx', tags: ['集团', '负面清单', '记分标准'], isExcel: true },
];

export default function GroupStandardsSection() {
  return (
    <div className="space-y-6">
      <AccordionGroup className="space-y-3">
        {items.map((s, i) => (
          <AccordionItem
            key={i}
            id={`group-${i}`}
            title={s.isExcel ? `附件${s.code}. ${s.name}` : `附件${s.code}.《${s.name}》`}
            summary={s.desc}
            icon={s.isExcel ? <FileSpreadsheet className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
            badge={
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(16,185,129,0.08)] text-[#10B981] border border-[rgba(16,185,129,0.15)]">已收录</span>
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
              <a
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#C8102E] font-medium hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {s.isExcel ? '在线查看表格 →' : '在线预览PDF →'}
              </a>
            </div>
          </AccordionItem>
        ))}
      </AccordionGroup>
    </div>
  );
}
