import { useState } from 'react';
import { AccordionGroup, AccordionItem } from '../components/Accordion';
import { Skull, AlertOctagon, AlertCircle, Info, BookOpen, Eye, Target, ListChecks } from 'lucide-react';
import FilePreview from '../components/FilePreview';

const SEVERITY_CONFIG = {
  critical: { color: 'var(--score-critical)', bg: 'var(--score-critical-bg)', border: 'var(--score-critical-border)', glow: 'var(--score-critical-glow)', icon: Skull, label: '12分/次' },
  major:    { color: 'var(--score-major)', bg: 'var(--score-major-bg)', border: 'var(--score-major-border)', glow: 'var(--score-major-glow)', icon: AlertOctagon, label: '6分/次' },
  general:  { color: 'var(--score-general)', bg: 'var(--score-general-bg)', border: 'var(--score-general-border)', glow: 'var(--score-general-glow)', icon: AlertCircle, label: '3分/次' },
  minor:    { color: 'var(--score-minor)', bg: 'var(--score-minor-bg)', border: 'var(--score-minor-border)', glow: 'var(--score-minor-glow)', icon: Info, label: '1分/次' },
} as const;

type Severity = keyof typeof SEVERITY_CONFIG;

interface SafetyScoreItem {
  category: string;
  severity: Severity;
  score: string;
  examples: string[];
  desc: string;
}

const safetyScoreItems: SafetyScoreItem[] = [
  { category: '严重违章', severity: 'critical', score: '12分/次', examples: ['违章指挥强令冒险作业', '瞒报谎报安全事故', '破坏事故现场', '无票证从事高危作业'], desc: '直接导致人身伤亡或重大财产损失的行为' },
  { category: '重大违章', severity: 'major', score: '6分/次', examples: ['擅自拆除安全装置', '特种作业无证上岗', '重大隐患未整改继续作业', '违规动火'], desc: '可能导致严重事故但尚未造成后果的行为' },
  { category: '一般违章', severity: 'general', score: '3分/次', examples: ['未按规定佩戴防护用品', '安全培训缺席', '台账记录不完整', '消防器材失效未报'], desc: '违反安全管理制度的一般性行为' },
  { category: '轻微违章', severity: 'minor', score: '1分/次', examples: ['劳保用品穿戴不规范', '安全标识损坏未更换', '培训签到代签', '应急物资未定期检查'], desc: '安全管理不到位但不直接威胁安全的行为' },
];

const totalExamples = safetyScoreItems.reduce((s, item) => s + item.examples.length, 0);

const STAT_CARDS = [
  { label: '记分等级', value: safetyScoreItems.length, unit: '级', icon: Target, color: 'var(--score-critical)', bg: 'var(--score-critical-bg)', desc: '四级分类管控' },
  { label: '最高记分', value: '12', unit: '分/次', icon: Skull, color: 'var(--score-critical)', bg: 'var(--score-critical-bg)', desc: '严重违章一票否决' },
  { label: '违章示例', value: totalExamples, unit: '项', icon: ListChecks, color: 'var(--score-major)', bg: 'var(--score-major-bg)', desc: '覆盖常见违规场景' },
  { label: '参考文件', value: '1', unit: '份', icon: BookOpen, color: 'var(--score-minor)', bg: 'var(--score-minor-bg)', desc: '红黄线记分管理规定' },
];

export default function SafetyScoreSection() {
  const [preview, setPreview] = useState<{ filePath: string; fileName: string; fileType: 'pdf' | 'xlsx' } | null>(null);

  return (
    <div className="space-y-7">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STAT_CARDS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:scale-[1.02]"
              style={{ background: 'var(--score-stat-bg)', borderColor: 'var(--score-stat-border)' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: stat.bg }}>
                  <Icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.unit}</span>
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--text-primary)' }}>{stat.label}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{stat.desc}</p>
            </div>
          );
        })}
      </div>

      <AccordionGroup className="space-y-3">
        {safetyScoreItems.map((item, i) => {
          const cfg = SEVERITY_CONFIG[item.severity];
          const SevIcon = cfg.icon;

          return (
            <AccordionItem key={i} id={`safety-${i}`} title={item.category}
              summary={`${item.score} · ${item.desc}`}
              icon={<SevIcon className="w-5 h-5" style={{ color: cfg.color }} />}
              badge={
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold border"
                  style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}>
                  {item.score}
                </span>
              }>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl p-4 transition-colors"
                  style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: cfg.glow }}>
                      <Target className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: cfg.color }}>记分标准</span>
                  </div>
                  <p className="text-base font-bold" style={{ color: cfg.color }}>{item.score}</p>
                  <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                </div>
                <div className="rounded-xl p-4 transition-colors"
                  style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: cfg.glow }}>
                      <ListChecks className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: cfg.color }}>典型示例</span>
                  </div>
                  <ul className="space-y-2">
                    {item.examples.map((ex, j) => (
                      <li key={j} className="text-xs flex items-start gap-2 rounded-lg px-3 py-2 transition-colors"
                        style={{ background: 'var(--card-inner-bg)', borderLeft: `3px solid ${cfg.color}` }}>
                        <span className="text-[10px] font-bold mt-px shrink-0" style={{ color: cfg.color }}>{j + 1}.</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AccordionItem>
          );
        })}
      </AccordionGroup>

      <div className="rounded-xl border p-4 flex items-center gap-3"
        style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
        <BookOpen className="w-5 h-5 text-[#10B981] shrink-0" />
        <div className="text-xs space-y-1.5">
          <p className="text-white font-medium">参考文件</p>
          <button
            onClick={() => setPreview({ filePath: './docs/附件1.《中燃集团客服业务红黄线及负面清单记分管理规定》.pdf', fileName: '附件1.中燃集团客服业务红黄线及负面清单记分管理规定.pdf', fileType: 'pdf' })}
            className="inline-flex items-center gap-1.5 font-medium hover:underline cursor-pointer" style={{ color: 'var(--brand-primary)' }}
          >
            <Eye className="w-3.5 h-3.5" />
            附件1. 中燃集团客服业务红黄线及负面清单记分管理规定（PDF）
          </button>
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
