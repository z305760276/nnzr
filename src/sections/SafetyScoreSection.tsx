import { useState } from 'react';
import { AccordionGroup, AccordionItem } from '../components/Accordion';
import { ShieldAlert, BookOpen, Eye } from 'lucide-react';
import FilePreview from '../components/FilePreview';

const safetyScoreItems = [
  { category: '严重违章', score: '12分/次', examples: ['违章指挥强令冒险作业', '瞒报谎报安全事故', '破坏事故现场', '无票证从事高危作业'], desc: '直接导致人身伤亡或重大财产损失的行为' },
  { category: '重大违章', score: '6分/次', examples: ['擅自拆除安全装置', '特种作业无证上岗', '重大隐患未整改继续作业', '违规动火'], desc: '可能导致严重事故但尚未造成后果的行为' },
  { category: '一般违章', score: '3分/次', examples: ['未按规定佩戴防护用品', '安全培训缺席', '台账记录不完整', '消防器材失效未报'], desc: '违反安全管理制度的一般性行为' },
  { category: '轻微违章', score: '1分/次', examples: ['劳保用品穿戴不规范', '安全标识损坏未更换', '培训签到代签', '应急物资未定期检查'], desc: '安全管理不到位但不直接威胁安全的行为' },
];

export default function SafetyScoreSection() {
  const [preview, setPreview] = useState<{ filePath: string; fileName: string; fileType: 'pdf' | 'xlsx' } | null>(null);

  return (
    <div className="space-y-6">
      <AccordionGroup className="space-y-3">
        {safetyScoreItems.map((item, i) => (
          <AccordionItem key={i} id={`safety-${i}`} title={item.category} summary={`${item.score} · ${item.desc}`}
            icon={<ShieldAlert className="w-5 h-5" />}
            badge={<span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: item.score.includes('12') ? 'rgba(227,24,55,0.1)' : item.score.includes('6') ? 'rgba(245,158,11,0.08)' : 'rgba(59,130,246,0.06)', color: item.score.includes('12') ? '#E31837' : item.score.includes('6') ? '#F59E0B' : '#3B82F6' }}>{item.score}</span>}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="dark-card bg-[var(--card-inner-bg)] rounded-lg p-3">
                <span className="text-[10px] text-[var(--accent)] font-semibold uppercase tracking-wider">记分标准</span>
                <p className="text-sm text-[var(--text-primary)] font-medium mt-1">{item.score}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{item.desc}</p>
              </div>
              <div className="dark-card bg-[var(--card-inner-bg)] rounded-lg p-3">
                <span className="text-[10px] text-[var(--accent)] font-semibold uppercase tracking-wider">典型示例</span>
                <ul className="mt-1 space-y-1">
                  {item.examples.map((ex, j) => (
                    <li key={j} className="text-xs text-[var(--text-secondary)] flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#C8102E] mt-1.5 shrink-0" />{ex}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AccordionItem>
        ))}
      </AccordionGroup>

      <div className="bg-[rgba(16,185,129,0.03)] border border-[rgba(16,185,129,0.12)] rounded-xl p-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-[#10B981]" />
          <div className="text-xs text-[var(--text-secondary)] space-y-1.5">
            <p className="text-white font-medium">参考文件</p>
            <button
              onClick={() => setPreview({ filePath: './docs/附件1.《中燃集团客服业务红黄线及负面清单记分管理规定》.pdf', fileName: '附件1.中燃集团客服业务红黄线及负面清单记分管理规定.pdf', fileType: 'pdf' })}
              className="inline-flex items-center gap-1.5 text-[#C8102E] font-medium hover:underline cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              附件1. 中燃集团客服业务红黄线及负面清单记分管理规定（PDF）
            </button>
          </div>
        </div>
      </div>

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
