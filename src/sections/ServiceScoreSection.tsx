import { useState } from 'react';
import { AccordionGroup, AccordionItem } from '../components/Accordion';
import { Eye, FileSpreadsheet, Skull, AlertOctagon, AlertCircle, Info, BookOpen, Target, ListChecks } from 'lucide-react';
import FilePreview from '../components/FilePreview';

const SERVICE_SEVERITY_CONFIG = {
  critical: { color: 'var(--score-critical)', bg: 'var(--score-critical-bg)', border: 'var(--score-critical-border)', glow: 'var(--score-critical-glow)', icon: Skull },
  major:    { color: 'var(--score-major)', bg: 'var(--score-major-bg)', border: 'var(--score-major-border)', glow: 'var(--score-major-glow)', icon: AlertOctagon },
  general:  { color: 'var(--score-general)', bg: 'var(--score-general-bg)', border: 'var(--score-general-border)', glow: 'var(--score-general-glow)', icon: AlertCircle },
  minor:    { color: 'var(--score-minor)', bg: 'var(--score-minor-bg)', border: 'var(--score-minor-border)', glow: 'var(--score-minor-glow)', icon: Info },
} as const;

type ServiceSeverity = keyof typeof SERVICE_SEVERITY_CONFIG;

interface ServiceScoreItem {
  category: string;
  severity: ServiceSeverity;
  score: string;
  examples: string[];
  desc: string;
}

const serviceScoreItems: ServiceScoreItem[] = [
  { category: '恶性违规行为', severity: 'critical', score: '12分/次', examples: ['安检入户造假（虚假照片）', '通气点火未做严密性试验', '违规置换/室内放散', '抄表弄虚作假乱填表数', '勾结偷盗气', '乱收费'], desc: '严重损害公司利益和形象的恶意违规行为，直接责任人扣12分' },
  { category: '严重违规行为', severity: 'major', score: '6分/次', examples: ['隐患未整改却显示已整改', '到访不遇工单造假', '漏抄/错抄/未按计划抄表', '隐瞒包庇偷盗气', '泄漏客户信息', '使用他人账号操作'], desc: '违反操作规范可能导致严重后果的行为，直接责任人扣6分' },
  { category: '一般违规行为', severity: 'general', score: '3分/次', examples: ['安检照片缺失/无用户签名', '未按约定时间上门', '未及时上报处置用户诉求', '服务态度导致投诉'], desc: '违反服务标准和工作流程的一般性行为，直接责任人扣3分' },
  { category: '轻微违规行为', severity: 'minor', score: '2分/次', examples: ['户内作业后未做安全宣传'], desc: '服务细节不到位但不直接影响安全的行为，直接责任人扣2分' },
];

const totalExamples = serviceScoreItems.reduce((s, item) => s + item.examples.length, 0);

const STAT_CARDS = [
  { label: '记分等级', value: serviceScoreItems.length, unit: '级', icon: Target, color: 'var(--score-critical)', bg: 'var(--score-critical-bg)', desc: '四级分类管控' },
  { label: '最高记分', value: '12', unit: '分/次', icon: Skull, color: 'var(--score-critical)', bg: 'var(--score-critical-bg)', desc: '恶性违规一票否决' },
  { label: '违规示例', value: totalExamples, unit: '项', icon: ListChecks, color: 'var(--score-major)', bg: 'var(--score-major-bg)', desc: '覆盖客服全业务场景' },
  { label: '参考文件', value: '2', unit: '份', icon: BookOpen, color: 'var(--score-minor)', bg: 'var(--score-minor-bg)', desc: '红黄线+负面清单' },
];

const REFERENCES = [
  { filePath: './docs/附件2.《中燃集团客服条口红黄线考核细则》.xlsx', fileName: '附件2.中燃集团客服条口红黄线考核细则.xlsx', fileType: 'xlsx' as const, label: '附件2. 中燃集团客服条口红黄线考核细则（Excel）' },
  { filePath: './docs/附件3.《客户服务部负面清单记分标准》.xlsx', fileName: '附件3.客户服务部负面清单记分标准.xlsx', fileType: 'xlsx' as const, label: '附件3. 客户服务部负面清单记分标准（Excel）' },
];

export default function ServiceScoreSection() {
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
        {serviceScoreItems.map((item, i) => {
          const cfg = SERVICE_SEVERITY_CONFIG[item.severity];
          const SevIcon = cfg.icon;

          return (
            <AccordionItem key={i} id={`service-${i}`} title={item.category}
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
        <FileSpreadsheet className="w-5 h-5 text-[#10B981] shrink-0" />
        <div className="text-xs space-y-1.5">
          <p className="text-white font-medium">参考文件</p>
          {REFERENCES.map((ref, idx) => (
            <button key={idx}
              onClick={() => setPreview({ filePath: ref.filePath, fileName: ref.fileName, fileType: ref.fileType })}
              className="block font-medium hover:underline cursor-pointer" style={{ color: 'var(--brand-primary)' }}
            >
              <span className="inline-flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                {ref.label}
              </span>
            </button>
          ))}
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
