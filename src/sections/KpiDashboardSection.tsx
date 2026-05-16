import { useState } from 'react';
import { AccordionGroup, AccordionItem } from '../components/Accordion';
import { penaltyStandards, systemModules } from '../data/orgData';
import {
  AlertCircle, BookOpen, ChevronRight, Gauge, Target, Weight, Database, X,
  BarChart3, ShieldCheck, TrendingUp, Clock, Zap
} from 'lucide-react';

interface KPIDetail {
  name: string; target: string; weight: string; dataSource: string;
  current: string; unit: string; description: string; frequency: string;
  calculation: string; note: string;
}

const kpiDetails: KPIDetail[] = [
  { name: "抄表率", target: "≥100%", weight: "25%", dataSource: "CRM系统抄表记录 + 物联网表自动回传数据 + 人工复核抽检", current: "100", unit: "%", description: "按抄表计划完成居民及工商业用户的月度/双月抄表，确保无遗漏。抄表率=实际抄表户数÷应抄表户数×100%。", frequency: "月度", calculation: "抄表率 = 实际抄表户数 ÷ 应抄表户数 × 100%", note: "未抄到户的须在系统中注明原因（无人/拒抄/锁门），连续两月未抄到的须上报站长安排二次上门。" },
  { name: "安检完成率", target: "≥72%", weight: "30%", dataSource: "CRM安检工单 + 手持终端GPS定位签到 + 拍照审核", current: "72", unit: "%", description: "居民用户每年不少于2次入户安检，非居民用户每半年不少于2次。安检完成率=实际安检户数÷应安检户数×100%。", frequency: "年度", calculation: "安检完成率 = 实际安检户数 ÷ 应安检户数 × 100%", note: "到访不遇的须张贴告知单并拍照留痕，计入已安检。虚假安检（无照片/照片造假）按严重违规处理。" },
  { name: "投诉响应时效", target: "≤24h", weight: "20%", dataSource: "95007热线系统 + 全国联络中心工单 + 回访记录", current: "24", unit: "h", description: "从用户投诉受理到首次响应（电话回访确认）的时间。投诉响应时效=投诉受理时间至首次回访时间。", frequency: "实时", calculation: "响应时效 = 首次回访时间 - 投诉受理时间", note: "紧急投诉（漏气/爆炸）须30分钟内响应。一般投诉24小时内首次回访，72小时内给出处理方案。" },
  { name: "隐患整改率", target: "≥100%", weight: "25%", dataSource: "CRM隐患跟踪模块 + 复查确认记录 + 整改通知单存档", current: "100", unit: "%", description: "一级隐患7日内整改、二级隐患30日内整改的闭环完成比例。整改率=已整改隐患数÷应整改隐患数×100%。", frequency: "月度", calculation: "整改率 = 已整改隐患数 ÷ 应整改隐患数 × 100%", note: "超期未整改的隐患每日电话催收并上报站长。用户拒不整改的，依法上报燃气主管部门协助处理。" },
];

const KPI_CARDS = [
  { name: "抄表率", value: "100", unit: "%", target: "≥100%", weight: "25%", icon: BarChart3, gradient: 'var(--kpi-gradient-blue)', glow: 'var(--kpi-glow-blue)', accent: 'var(--kpi-accent-blue)', desc: '月度抄表到位 · 无遗漏户', colorStop: '#38BDF8', ringColor: 'url(#kpiGradBlue)' },
  { name: "安检完成率", value: "72", unit: "%", target: "≥72%", weight: "30%", icon: ShieldCheck, gradient: 'var(--kpi-gradient-purple)', glow: 'var(--kpi-glow-purple)', accent: 'var(--kpi-accent-purple)', desc: '年度入户安检 · 每户2次', colorStop: '#A78BFA', ringColor: 'url(#kpiGradPurple)' },
  { name: "投诉响应时效", value: "24", unit: "h", target: "≤24h", weight: "20%", icon: Clock, gradient: 'var(--kpi-gradient-amber)', glow: 'var(--kpi-glow-amber)', accent: 'var(--kpi-accent-amber)', desc: '首次响应 · 紧急30分钟', colorStop: '#FBBF24', ringColor: 'url(#kpiGradAmber)' },
  { name: "隐患整改率", value: "100", unit: "%", target: "≥100%", weight: "25%", icon: TrendingUp, gradient: 'var(--kpi-gradient-emerald)', glow: 'var(--kpi-glow-teal)', accent: 'var(--kpi-accent-emerald)', desc: '月度闭环整改 · 零积压', colorStop: '#34D399', ringColor: 'url(#kpiGradEmerald)' },
];

function RingProgress({ pct, ringColor, size = 120, strokeWidth = 6 }: { pct: number; ringColor: string; size?: number; strokeWidth?: number }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 shrink-0">
      <defs>
        <linearGradient id="kpiGradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>
        <linearGradient id="kpiGradPurple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
        <linearGradient id="kpiGradAmber" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
        <linearGradient id="kpiGradEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--kpi-ring-track)" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={ringColor} strokeWidth={strokeWidth}
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }} />
    </svg>
  );
}

function RegulationModal({ module, onClose }: { module: typeof systemModules[0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 animate-[kpi-scale-in_0.2s_ease-out]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-xl max-h-[80vh] overflow-hidden rounded-2xl flex flex-col"
        style={{
          background: 'var(--kpi-glass-bg-strong)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid var(--kpi-glass-border)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        }}>
        <div className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--kpi-divider)', background: 'linear-gradient(180deg, rgba(56,189,248,0.06) 0%, transparent 100%)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--kpi-glow-blue)' }}>
              <BookOpen className="w-4 h-4" style={{ color: 'var(--kpi-accent-blue)' }} />
            </div>
            <h3 className="font-bold text-base" style={{ color: 'var(--kpi-text-primary)' }}>{module.name}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-[var(--kpi-glass-highlight)]"
            style={{ color: 'var(--kpi-text-muted)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <p className="text-sm mb-5" style={{ color: 'var(--kpi-text-secondary)' }}>{module.desc}</p>
          <div className="space-y-3">
            {module.clauses.map((clause, i) => (
              <div key={i} className="rounded-xl p-4 transition-colors"
                style={{ background: 'var(--kpi-glass-highlight)', border: '1px solid var(--kpi-glass-border)' }}>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--kpi-accent-blue)' }}>
                  <span className="w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold"
                    style={{ background: 'var(--kpi-glow-blue)', color: 'var(--kpi-accent-blue)' }}>{i + 1}</span>
                  {clause.title}
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--kpi-text-secondary)' }}>{clause.content}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] mt-5" style={{ color: 'var(--kpi-text-muted)' }}>{module.source}</p>
        </div>
      </div>
    </div>
  );
}

export default function KpiDashboardSection() {
  const [selectedModule, setSelectedModule] = useState<typeof systemModules[0] | null>(null);

  return (
    <div className="space-y-8">
      {/* ===== KPI 指标概览卡片 ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {KPI_CARDS.map((card, i) => {
          const Icon = card.icon;
          const pct = card.unit === '%' ? parseInt(card.value) : card.unit === 'h' ? Math.min((24 - parseInt(card.value)) / 24 * 100, 100) : 0;

          return (
            <div key={i} className="kpi-card kpi-card-liquid p-5 flex flex-col"
              style={{ animationDelay: `${i * 0.1}s`, animation: `kpi-fade-in-up 0.5s ease-out ${i * 0.1}s both` }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: card.glow }}>
                  <Icon className="w-5 h-5" style={{ color: card.accent }} />
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md tracking-wider"
                  style={{ background: card.glow, color: card.accent }}>
                  权重{card.weight}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold tracking-tight" style={{ color: 'var(--kpi-text-primary)' }}>{card.value}</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--kpi-text-muted)' }}>{card.unit}</span>
                  </div>
                  <p className="text-xs font-medium mt-1" style={{ color: 'var(--kpi-text-secondary)' }}>{card.name}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--kpi-text-muted)' }}>{card.desc}</p>
                </div>
                <RingProgress pct={pct} ringColor={card.ringColor} size={72} strokeWidth={5} />
              </div>

              <div className="mt-4 pt-3 flex items-center justify-between"
                style={{ borderTop: '1px solid var(--kpi-divider)' }}>
                <span className="text-[10px]" style={{ color: 'var(--kpi-text-muted)' }}>目标 {card.target}</span>
                <span className="text-[10px] font-medium" style={{ color: card.accent }}>● 当前值</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== KPI 详情手风琴 ===== */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-7 rounded-full" style={{ background: 'var(--kpi-gradient-blue)', backgroundSize: '200% 200%', animation: 'kpi-gradient-shift 3s ease infinite' }} />
          <div>
            <h2 className="text-lg font-bold tracking-tight" style={{ color: 'var(--kpi-text-primary)' }}>指标详情</h2>
            <p className="text-xs" style={{ color: 'var(--kpi-text-muted)' }}>4项核心KPI · 计算公式 · 数据来源 · 注意事项</p>
          </div>
        </div>

        <AccordionGroup variant="kpi" className="space-y-3">
          {kpiDetails.map((kpi, i) => {
            const pct = parseInt(kpi.current);

            return (
              <AccordionItem key={i} id={`kpi-${i}`} title={kpi.name}
                summary={`目标${kpi.target} · 权重${kpi.weight} · 当前${kpi.current}${kpi.unit}`}
                icon={<Gauge className="w-5 h-5" />}>
                <div className="flex flex-col md:flex-row items-start gap-6 mt-2">
                  <div className="flex items-center gap-5 shrink-0">
                    <RingProgress pct={pct} ringColor={`url(#kpiGrad${i === 0 ? 'Blue' : i === 1 ? 'Purple' : i === 2 ? 'Amber' : 'Emerald'})`} size={100} strokeWidth={7} />
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold" style={{ color: 'var(--kpi-text-primary)' }}>{kpi.current}</span>
                        <span className="text-sm" style={{ color: 'var(--kpi-text-muted)' }}>{kpi.unit}</span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--kpi-text-secondary)' }}>{kpi.target} / 权重{kpi.weight}</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--kpi-text-secondary)' }}>{kpi.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
                  <div className="rounded-xl p-4 transition-colors hover:bg-[rgba(255,255,255,0.02)]"
                    style={{ background: 'var(--kpi-glass-highlight)', border: '1px solid var(--kpi-glass-border)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--kpi-glow-blue)' }}>
                        <Target className="w-3.5 h-3.5" style={{ color: 'var(--kpi-accent-blue)' }} />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--kpi-accent-blue)' }}>计算公式</span>
                    </div>
                    <p className="text-sm font-medium" style={{ color: 'var(--kpi-text-primary)' }}>{kpi.calculation}</p>
                    <p className="text-xs mt-1.5" style={{ color: 'var(--kpi-text-muted)' }}>目标：{kpi.target} · 权重：{kpi.weight}</p>
                  </div>

                  <div className="rounded-xl p-4 transition-colors hover:bg-[rgba(255,255,255,0.02)]"
                    style={{ background: 'var(--kpi-glass-highlight)', border: '1px solid var(--kpi-glass-border)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--kpi-glow-blue)' }}>
                        <Database className="w-3.5 h-3.5" style={{ color: 'var(--kpi-accent-blue)' }} />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--kpi-accent-blue)' }}>数据来源</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--kpi-text-secondary)' }}>{kpi.dataSource}</p>
                    <p className="text-xs mt-1.5 font-medium" style={{ color: 'var(--kpi-text-primary)' }}>统计周期：{kpi.frequency}</p>
                  </div>

                  <div className="rounded-xl p-4 transition-colors hover:bg-[rgba(255,255,255,0.02)]"
                    style={{ background: 'var(--kpi-glass-highlight)', border: '1px solid var(--kpi-glass-border)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--kpi-glow-amber)' }}>
                        <Weight className="w-3.5 h-3.5" style={{ color: 'var(--kpi-accent-amber)' }} />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--kpi-accent-amber)' }}>注意事项</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--kpi-text-secondary)' }}>{kpi.note}</p>
                  </div>
                </div>

                <p className="text-[10px] mt-4" style={{ color: 'var(--kpi-text-muted)' }}>来源：《客户服务部管理制度》V2.0 考核指标表</p>
              </AccordionItem>
            );
          })}

          <AccordionItem id="system-modules" title="制度体系（12大模块）"
            summary="点击卡片查看每条制度的详细条款"
            icon={<BookOpen className="w-5 h-5" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
              {systemModules.map((mod, i) => (
                <button key={i} onClick={() => setSelectedModule(mod)}
                  className="text-left rounded-xl p-4 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                  style={{
                    background: 'var(--kpi-glass-highlight)',
                    border: '1px solid var(--kpi-glass-border)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--kpi-glass-border-active)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.25)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--kpi-glass-border)';
                    e.currentTarget.style.background = 'var(--kpi-glass-highlight)';
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = '';
                  }}>
                  <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(90deg, transparent, var(--kpi-accent-blue), transparent)' }} />
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                        style={{ background: 'var(--kpi-glow-blue)' }}>
                        <Zap className="w-3.5 h-3.5" style={{ color: 'var(--kpi-accent-blue)' }} />
                      </div>
                      <h4 className="text-sm font-semibold transition-colors group-hover:text-[var(--kpi-accent-blue)]"
                        style={{ color: 'var(--kpi-text-primary)' }}>{mod.name}</h4>
                    </div>
                    <ChevronRight className="w-4 h-4 shrink-0 transition-all duration-300 group-hover:translate-x-0.5"
                      style={{ color: 'var(--kpi-text-muted)' }} />
                  </div>
                  <p className="text-xs mb-3" style={{ color: 'var(--kpi-text-secondary)' }}>{mod.desc}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                      style={{ background: 'var(--kpi-glow-blue)', color: 'var(--kpi-accent-blue)' }}>
                      {mod.clauses.length}条细则
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--kpi-text-muted)' }}>{mod.source.split('》')[1]?.split(' ')[0] || ''}</span>
                  </div>
                </button>
              ))}
            </div>
          </AccordionItem>

          <AccordionItem id="penalty-table" title="考核标准"
            summary="6项违规行为及处罚金额"
            icon={<AlertCircle className="w-5 h-5" />}>
            <div className="overflow-x-auto mt-2 rounded-xl" style={{ border: '1px solid var(--kpi-glass-border)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'var(--kpi-glass-highlight)', borderBottom: '1px solid var(--kpi-glass-border)' }}>
                    <th className="text-left text-xs font-semibold px-5 py-3.5" style={{ color: 'var(--kpi-accent-blue)' }}>违规行为</th>
                    <th className="text-left text-xs font-semibold px-5 py-3.5" style={{ color: 'var(--kpi-accent-blue)' }}>处罚金额</th>
                    <th className="text-left text-xs font-semibold px-5 py-3.5" style={{ color: 'var(--kpi-accent-blue)' }}>严重程度</th>
                    <th className="text-left text-xs font-semibold px-5 py-3.5" style={{ color: 'var(--kpi-accent-blue)' }}>来源</th>
                  </tr>
                </thead>
                <tbody>
                  {penaltyStandards.map((p, i) => (
                    <tr key={i} className="transition-colors"
                      style={{ borderBottom: '1px solid var(--kpi-divider)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--kpi-glass-highlight)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '' }}>
                      <td className="px-5 py-3 text-xs" style={{ color: 'var(--kpi-text-secondary)' }}>{p.violation}</td>
                      <td className="px-5 py-3 text-xs font-semibold" style={{ color: 'var(--kpi-accent-rose)' }}>{p.penalty}</td>
                      <td className="px-5 py-3">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-medium border"
                          style={{
                            color: p.level === '严重' ? 'var(--kpi-accent-rose)' : 'var(--kpi-accent-amber)',
                            background: p.level === '严重' ? 'rgba(251,113,133,0.08)' : 'rgba(251,191,36,0.08)',
                            borderColor: p.level === '严重' ? 'rgba(251,113,133,0.18)' : 'rgba(251,191,36,0.18)',
                          }}>{p.level}</span>
                      </td>
                      <td className="px-5 py-3 text-[10px]" style={{ color: 'var(--kpi-text-muted)' }}>《管理制度》V2.0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AccordionItem>
        </AccordionGroup>
      </section>

      {selectedModule && <RegulationModal module={selectedModule} onClose={() => setSelectedModule(null)} />}
    </div>
  );
}
