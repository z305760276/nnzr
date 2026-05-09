import { useState } from 'react';
import { AccordionGroup, AccordionItem } from '../components/Accordion';
import { penaltyStandards, systemModules } from '../data/orgData';
import { AlertCircle, BookOpen, ChevronRight, Gauge, Target, Weight, Database, X } from 'lucide-react';

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

function RegulationModal({ module, onClose }: { module: typeof systemModules[0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[80vh] bg-[var(--card-solid)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-light)] bg-[rgba(200,16,46,0.05)]">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-[#C8102E]" />
            <h3 className="text-[var(--text-primary)] font-bold text-base">{module.name}</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[var(--text-secondary)]"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <p className="text-sm text-[var(--text-secondary)] mb-5">{module.desc}</p>
          <div className="space-y-3">
            {module.clauses.map((clause, i) => (
              <div key={i} className="dark-card bg-[var(--card-inner-bg-strong)] border border-[rgba(200,16,46,0.06)] rounded-lg p-4">
                <h4 className="text-[var(--accent)] text-sm font-semibold mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-[var(--brand-bg)] flex items-center justify-center text-[10px] text-[#C8102E] font-bold">{i + 1}</span>
                  {clause.title}
                </h4>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{clause.content}</p>
              </div>
            ))}
          </div>
          <p className="text-[var(--text-muted)] text-[10px] mt-5">{module.source}</p>
        </div>
      </div>
    </div>
  );
}

export default function KpiDashboardSection() {
  const [selectedModule, setSelectedModule] = useState<typeof systemModules[0] | null>(null);

  return (
    <div className="space-y-6">
        
        <AccordionGroup className="space-y-3">
          {kpiDetails.map((kpi, i) => {
            const pct = parseInt(kpi.current);
            return (
              <AccordionItem key={i} id={`kpi-${i}`} title={kpi.name} summary={`目标${kpi.target} · 权重${kpi.weight} · 当前${kpi.current}${kpi.unit}`} icon={<Gauge className="w-5 h-5" />}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-14 h-14 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(13,25,48,0.6)" strokeWidth="7" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#C8102E" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${(pct / 100) * 251} 251`} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-sm font-bold text-[var(--text-primary)]">{kpi.current}</span>
                      <span className="text-[8px] text-[var(--text-secondary)]">{kpi.unit}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">{kpi.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="dark-card bg-[var(--card-inner-bg)] rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2"><Target className="w-4 h-4 text-[var(--accent)]" /><span className="text-[10px] text-[var(--accent)] font-semibold uppercase tracking-wider">计算公式</span></div>
                    <p className="text-sm text-[var(--text-primary)] font-medium">{kpi.calculation}</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">目标：{kpi.target} · 权重：{kpi.weight}</p>
                  </div>
                  <div className="dark-card bg-[var(--card-inner-bg)] rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2"><Database className="w-4 h-4 text-[var(--accent)]" /><span className="text-[10px] text-[var(--accent)] font-semibold uppercase tracking-wider">数据来源</span></div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{kpi.dataSource}</p>
                    <p className="text-xs text-white mt-1">统计周期：{kpi.frequency}</p>
                  </div>
                  <div className="dark-card bg-[var(--card-inner-bg)] rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2"><Weight className="w-4 h-4 text-[var(--accent)]" /><span className="text-[10px] text-[var(--accent)] font-semibold uppercase tracking-wider">注意事项</span></div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{kpi.note}</p>
                  </div>
                </div>
                <p className="text-white text-[10px] mt-3">来源：《客户服务部管理制度》V2.0 考核指标表</p>
              </AccordionItem>
            );
          })}

          <AccordionItem id="system-modules" title="制度体系（12大模块）" summary="点击卡片查看每条制度的详细条款" icon={<BookOpen className="w-5 h-5" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {systemModules.map((mod, i) => (
                <button key={i} onClick={() => setSelectedModule(mod)} className="dark-card text-left bg-[var(--card-inner-bg-strong)] border border-[rgba(200,16,46,0.06)] rounded-xl p-4 hover:border-[var(--border-subtle)] hover:bg-[rgba(200,16,46,0.03)] active:scale-[0.98] transition-all cursor-pointer group">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">{mod.name}</h4>
                    <ChevronRight className="w-4 h-4 text-white group-hover:text-[#C8102E] group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-xs text-white mb-2">{mod.desc}</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--brand-bg)] text-[var(--accent)]">{mod.clauses.length}条细则</span>
                  <p className="text-white text-[10px] mt-2">{mod.source}</p>
                </button>
              ))}
            </div>
          </AccordionItem>

          <AccordionItem id="penalty-table" title="考核标准" summary="6项违规行为及处罚金额" icon={<AlertCircle className="w-5 h-5" />}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(200,16,46,0.08)] bg-[rgba(200,16,46,0.03)]">
                    <th className="text-left text-[var(--accent)] text-xs font-semibold px-4 py-3">违规行为</th>
                    <th className="text-left text-[var(--accent)] text-xs font-semibold px-4 py-3">处罚金额</th>
                    <th className="text-left text-[var(--accent)] text-xs font-semibold px-4 py-3">严重程度</th>
                    <th className="text-left text-[var(--accent)] text-xs font-semibold px-4 py-3">来源</th>
                  </tr>
                </thead>
                <tbody>
                  {penaltyStandards.map((p, i) => (
                    <tr key={i} className="border-b border-[rgba(200,16,46,0.03)] hover:bg-[rgba(200,16,46,0.02)] transition-colors">
                      <td className="px-4 py-3 text-[var(--text-secondary)] text-xs">{p.violation}</td>
                      <td className="px-4 py-3 text-[#E31837] font-medium text-xs">{p.penalty}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${p.level === '严重' ? 'bg-[rgba(227,24,55,0.06)] text-[#E31837] border-[rgba(227,24,55,0.12)]' : 'bg-[rgba(245,158,11,0.06)] text-[#F59E0B] border-[rgba(245,158,11,0.12)]'}`}>{p.level}</span>
                      </td>
                      <td className="px-4 py-3 text-white text-[10px]">《管理制度》V2.0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AccordionItem>
        </AccordionGroup>

        {selectedModule && <RegulationModal module={selectedModule} onClose={() => setSelectedModule(null)} />}
      </div>
  );
}
