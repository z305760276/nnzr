import { AccordionGroup, AccordionItem } from '../components/Accordion';
import { Gavel, ExternalLink } from 'lucide-react';

interface LawItem {
  name: string;
  level: string;
  desc: string;
  link: string;
  tags: string[];
  hasContent: boolean;
}

const laws: LawItem[] = [
  {
    name: '城镇燃气管理条例',
    level: '国务院令第583号',
    desc: '燃气发展规划与应急保障、燃气经营与服务、燃气使用、燃气设施保护、燃气安全事故预防与处理等',
    link: './docs/法规_城镇燃气管理条例.pdf',
    tags: ['国务院令', '燃气管理'],
    hasContent: true,
  },
  {
    name: '安全生产法',
    level: '法律',
    desc: '生产经营单位的安全生产保障、从业人员的安全生产权利义务、安全生产的监督管理等',
    link: './docs/中华人民共和国安全生产法（2021年6月修订）.pdf',
    tags: ['安全生产', '法律责任'],
    hasContent: true,
  },
  {
    name: '消防法',
    level: '法律',
    desc: '火灾预防、消防组织、灭火救援、监督检查、法律责任等',
    link: './docs/法规_消防法.pdf',
    tags: ['消防', '火灾预防'],
    hasContent: true,
  },
  {
    name: '特种设备安全法',
    level: '法律',
    desc: '特种设备的生产、经营、使用、检验、检测和监督管理等',
    link: './docs/法规_特种设备安全法.pdf',
    tags: ['特种设备', '检验检测'],
    hasContent: true,
  },
  {
    name: '刑法（涉及燃气安全相关条款）',
    level: '法律',
    desc: '危害公共安全罪、重大责任事故罪等涉及燃气安全的刑事责任条款',
    link: './docs/法规_刑法.pdf',
    tags: ['刑事责任', '公共安全'],
    hasContent: true,
  },
];

export default function LawsSection() {
  return (
    <div className="space-y-6">
      <AccordionGroup className="space-y-3">
        {laws.map((l, i) => (
          <AccordionItem
            key={i}
            id={`law-${i}`}
            title={l.name}
            summary={`${l.level} · ${l.desc}`}
            icon={<Gavel className="w-5 h-5" />}
            badge={
              l.hasContent
                ? <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(16,185,129,0.08)] text-[#10B981] border border-[rgba(16,185,129,0.15)]">已收录</span>
                : <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(245,158,11,0.08)] text-[#F59E0B] border border-[rgba(245,158,11,0.15)]">待收录</span>
            }
          >
            <div className="space-y-3">
              {/* 标签 */}
              <div className="flex flex-wrap gap-1.5">
                {l.tags.map((tag, ti) => (
                  <span key={ti} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--card-inner-bg)] text-[var(--text-secondary)] border border-[var(--border-light)]">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* 链接 */}
              {l.link ? (
                <a
                  href={l.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#C8102E] font-medium hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  在线预览PDF →
                </a>
              ) : (
                <div className="bg-[var(--card-inner-bg)] border border-dashed border-[var(--border-light)] rounded-lg p-4 flex items-center gap-3">
                  <Gavel className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
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
    </div>
  );
}
