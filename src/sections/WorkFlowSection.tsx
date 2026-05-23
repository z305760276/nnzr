import { useState } from 'react';
import { Cpu, Clock, User, Monitor, FileText, AlertTriangle, ShieldAlert, Wrench, MessageSquare, Lightbulb, ChevronDown, ChevronUp, Layers, Users } from 'lucide-react';

const stepColors = {
  1: { accent: '#2563eb', dim: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.20)', icon: FileText },
  2: { accent: '#0891b2', dim: 'rgba(6,182,212,0.10)', border: 'rgba(6,182,212,0.20)', icon: Cpu },
  3: { accent: '#059669', dim: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.20)', icon: Wrench },
  4: { accent: '#d97706', dim: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.20)', icon: ShieldAlert },
  5: { accent: '#7c3aed', dim: 'rgba(139,92,246,0.10)', border: 'rgba(139,92,246,0.20)', icon: MessageSquare },
};

const workSteps = [
  { step: 1, title: "工单发起", titleShort: "即时生成≤3分钟", description: "用户通过95007热线、微信公众号、营业厅、全国联络中心等渠道提交服务请求，系统自动生成CRM工单并记录诉求详情。所有诉求信息（用户姓名、地址、联系电话、问题描述、预约时间）必须在系统中完整录入。", responsible: "全国联络中心接线员 / 网厅运营专员 / 营业厅前台", systemOps: "① CRM系统自动建单 → ② 诉求分类标记（维修/安检/通气/投诉） → ③ 关联用户档案调取历史记录 → ④ 生成工单编号并短信通知用户", deadline: "即时生成，平均3分钟内完成建单" },
  { step: 2, title: "工单派发", titleShort: "普通24h内 / 抢险即时", description: "服务运营监督组审核工单信息完整性，检查用户地址、联系方式、问题描述是否齐全。根据服务类型和地理位置，匹配最近的服务站或网格员。派发前需确认网格员当日负荷，避免超负荷派单。", responsible: "服务运营监督班长 / 服务站站长 / 网格长", systemOps: "① CRM派单至服务站 → ② 服务站匹配最近网格员（按GPS距离+技能标签） → ③ 网格员移动端接收工单提醒 → ④ 系统自动发送预约短信给用户", deadline: "普通工单24小时内派发，抢险工单即时派发" },
  { step: 3, title: "上门服务", titleShort: "安检3日 / 维修24h / 抢险30分钟", description: "网格员按约定时间上门，提前30分钟致电用户确认。到达后出示工作证，穿戴鞋套进入。执行标准化作业流程，全程使用手持终端记录，关键节点拍照上传CRM。", responsible: "网格员（开通维修岗 / 安检员） / 安全技术员（复杂作业）", systemOps: "① 手持终端签到（GPS定位） → ② 作业执行（按标准SOP） → ③ 关键节点拍照上传（至少8张） → ④ 用户电子签名确认 → ⑤ 离场关阀检查", deadline: "安检：预约后3日内上门 / 维修：24h内上门 / 抢险：30分钟内到场" },
  { step: 4, title: "隐患处理", titleShort: "一级1~7日 / 二级30日 / 三级30日", description: "发现隐患按三级分级标准处理。一级隐患（重大）如漏气、直通表，立即关阀或停气，30分钟内上报调度中心。二级隐患（一般）如软管老化，现场签发整改通知单，用户签字确认。三级隐患（轻微）现场口头告知并发放宣传资料。", responsible: "网格员 / 安全技术员（技术判定） / 安检网格长（审核）", systemOps: "① 隐患分级判定 → ② 一级隐患：CRM标记红色紧急+自动上报 → ③ 二级隐患：生成整改通知单+跟踪记录 → ④ 三级隐患：拍照留痕+下次安检关注 → ⑤ 复查确认闭环", deadline: "一级：1-7日内整改完毕 / 二级：30日内整改完毕 / 三级：建议30日内改善" },
  { step: 5, title: "服务回访", titleShort: "短信即时 / 人工48h", description: "服务完成后系统自动触发短信回访，询问用户满意度（1-5分）。不满意工单（≤3分）自动转入二次跟踪队列，由服务运营监督组人工回访了解具体问题。所有回访记录存档备查。", responsible: "服务运营监督组 / 系统自动触发短信", systemOps: "① 服务完成标记后自动触发短信回访 → ② 满意度统计（1-5分） → ③ 差评（≤3分）自动标记红色预警 → ④ 人工二次回访 → ⑤ 归档生成服务质量周报", deadline: "短信回访：服务完成后即时发送 / 人工二次回访：48小时内" },
];

const expertTips = [
  { id: 1, scene: "老旧小区户内管道锈蚀判定", trick: "用硬币轻刮锈蚀表面，若锈层脱落露出金属光泽为'中度锈蚀'；若刮后呈坑洼状且管壁变薄为'严重锈蚀'，需立即建议用户更换。切勿仅凭外观判断。", regulation: "《隐患管理制度》表5 锈蚀等级3-4级标准", risk: "误判为轻微锈蚀可能导致后期漏气事故，造成人身伤亡。锈蚀判定错误属于严重工作失误。" },
  { id: 2, scene: "用户不在家时的安检处理", trick: "粘贴《到访不遇告知单》后拍照上传CRM（含门牌号、告知单张贴位置），同时在门口张贴安全用气宣传单。下次安检时此类用户优先安排，提前电话确认。", regulation: "《安检管理制度》第三章第2条：到访不遇处理规范", risk: "未留痕可能导致安检入户率统计失真，外包结算产生争议。用户后续投诉未通知到门，公司需承担举证责任。" },
  { id: 3, scene: "CRM系统卡顿时的工单处理", trick: "手机端APP可离线缓存最近30条工单数据，网络恢复后自动同步。若抢修工单无法及时录入，可先电话直报调度中心（3102277），调度中心代为补录，网格员返岗后24小时内补全系统记录。", regulation: "《管理制度》第六章 信息系统管理第12条：系统故障应急处理", risk: "离线操作须当日补录，超期未补录按工单缺失考核（50元/次）。抢险工单未录入导致事故追溯困难，责任由网格员承担。" },
];

const hazardLevels = [
  { level: '一级', label: '重大隐患', desc: '漏气、直通表等严重隐患。立即关阀或停气，30分钟内上报调度中心。', time: '1-7日内整改完毕', accent: '#dc2626', dim: 'rgba(220,38,38,0.08)' },
  { level: '二级', label: '一般隐患', desc: '软管老化等常规隐患。现场签发整改通知单，用户签字确认。', time: '30日内整改完毕', accent: '#d97706', dim: 'rgba(217,119,6,0.08)' },
  { level: '三级', label: '轻微隐患', desc: '轻微问题现场口头告知，拍照留痕并发放宣传资料，下次安检重点关注。', time: '建议30日内改善', accent: '#2563eb', dim: 'rgba(37,99,235,0.08)' },
];

const statCards = [
  { label: '工单步骤', value: 5, unit: '步', icon: Layers, color: 'var(--score-general)', bg: 'var(--score-general-bg)', desc: '五步闭环流程' },
  { label: '责任岗位', value: 4, unit: '类', icon: Users, color: 'var(--score-critical)', bg: 'var(--score-critical-bg)', desc: '全链路覆盖' },
  { label: '隐患等级', value: 3, unit: '级', icon: AlertTriangle, color: 'var(--score-major)', bg: 'var(--score-major-bg)', desc: '三级分级处置' },
  { label: '专家经验', value: 3, unit: '条', icon: Lightbulb, color: 'var(--score-minor)', bg: 'var(--score-minor-bg)', desc: '老师傅传帮带' },
];

function WorkStepPanel({ step, idx }: { step: typeof workSteps[0]; idx: number }) {
  const [open, setOpen] = useState(idx === 0);
  const color = stepColors[step.step as keyof typeof stepColors];
  const StepIcon = color.icon;

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all duration-300 glass-shimmer"
      style={{
        background: 'var(--score-gradient-panel)',
        borderColor: 'var(--score-panel-border)',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors"
        style={{ background: open ? 'var(--score-panel-hover)' : 'transparent' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--score-panel-hover)'; }}
        onMouseLeave={(e) => { if (!open) e.currentTarget.style.background = 'transparent'; }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-base"
            style={{ background: `linear-gradient(135deg, ${color.accent}, ${color.accent}dd)` }}
          >
            {step.step}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <StepIcon className="w-4 h-4 shrink-0" style={{ color: color.accent }} />
              <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
              <span className="text-xs font-semibold" style={{ color: color.accent }}>
                {step.titleShort}
              </span>
            </div>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              来源：《客户服务部管理制度》V2.0 第三章 第{step.step}条
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{ background: color.dim, color: color.accent }}
          >
            {step.responsible.split(' / ').length}岗
          </span>
          {open ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
        </div>
      </button>

      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: open ? '4000px' : '0px', opacity: open ? 1 : 0 }}
      >
        <div className="px-5 pb-5 pt-1" style={{ borderTop: '1px solid var(--score-divider)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <FileText className="w-3.5 h-3.5" style={{ color: color.accent }} />
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>步骤说明</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{step.description}</p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <User className="w-3.5 h-3.5" style={{ color: color.accent }} />
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>责任岗位</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {step.responsible.split(' / ').map((role, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full text-xs border"
                    style={{ borderColor: color.dim, color: 'var(--text-primary)', background: color.dim }}>
                    {role.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Monitor className="w-3.5 h-3.5" style={{ color: color.accent }} />
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>系统操作要点</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{step.systemOps}</p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Clock className="w-3.5 h-3.5" style={{ color: color.accent }} />
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: color.accent }}>时限要求</span>
              </div>
              <p className="text-sm font-semibold" style={{ color: color.accent }}>
                {step.deadline}
              </p>
            </div>
          </div>

          {step.step === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5 pt-4" style={{ borderTop: '1px solid var(--score-divider)' }}>
              {hazardLevels.map((h) => (
                <div key={h.level} className="rounded-lg p-3.5 border border-l-[3px]"
                  style={{ background: h.dim, borderColor: h.dim, borderLeftColor: h.accent }}>
                  <div className="text-xs font-bold mb-1.5 flex items-center gap-1.5" style={{ color: h.accent }}>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {h.level}级 · {h.label}
                  </div>
                  <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>{h.desc}</p>
                  <p className="text-xs font-semibold" style={{ color: h.accent }}>⏱ {h.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ExpertTipPanel({ tip }: { tip: typeof expertTips[0] }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all duration-300 glass-shimmer"
      style={{
        background: 'var(--score-gradient-panel)',
        borderColor: 'var(--score-panel-border)',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors"
        style={{ background: open ? 'var(--score-panel-hover)' : 'transparent' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--score-panel-hover)'; }}
        onMouseLeave={(e) => { if (!open) e.currentTarget.style.background = 'transparent'; }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg font-bold"
            style={{ background: 'rgba(217,119,6,0.10)', color: '#d97706' }}
          >
            {String(tip.id).padStart(2, '0')}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{tip.scene}</h3>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} /> : <ChevronDown className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />}
      </button>

      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: open ? '2000px' : '0px', opacity: open ? 1 : 0 }}
      >
        <div className="px-5 pb-5 pt-1" style={{ borderTop: '1px solid var(--score-divider)' }}>
          <div className="space-y-3 mt-4">
            <div className="rounded-lg p-3" style={{ background: 'rgba(245,158,11,0.06)' }}>
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#b45309' }}>土办法 / 实操技巧</span>
              <p className="text-sm mt-1.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{tip.trick}</p>
            </div>
            <div className="rounded-lg p-3" style={{ background: 'rgba(99,102,241,0.06)' }}>
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#4f46e5' }}>制度依据</span>
              <p className="text-sm mt-1.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{tip.regulation}</p>
            </div>
            <div className="rounded-lg p-3" style={{ background: 'rgba(239,68,68,0.06)' }}>
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#dc2626' }}>风险提示</span>
              <p className="text-sm mt-1.5 leading-relaxed" style={{ color: '#b45309' }}>{tip.risk}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkFlowSection() {
  return (
    <div className="space-y-8">

      {/* ===== 统计卡片 ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const StatIcon = stat.icon;
          return (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border p-5 transition-all duration-500 glass-shimmer"
              style={{
                background: 'var(--score-gradient-stat-' + (i + 1) + ')',
                borderColor: 'var(--score-panel-border)',
              }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: stat.bg }}>
                <StatIcon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.unit}</span>
              </div>
              <p className="text-xs mt-1 font-medium" style={{ color: 'var(--text-primary)' }}>{stat.label}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{stat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* ===== 工单流转步骤 ===== */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, var(--score-critical), transparent)' }} />
          <span
            className="text-xs font-bold uppercase tracking-widest shrink-0 px-3 py-1 rounded-full border"
            style={{
              color: 'var(--score-critical)',
              borderColor: 'var(--score-critical-border)',
              background: 'var(--score-critical-soft)',
            }}
          >
            五步闭环流程
          </span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, var(--score-critical), transparent)' }} />
        </div>

        <div className="space-y-3">
          {workSteps.map((step, idx) => (
            <WorkStepPanel key={step.step} step={step} idx={idx} />
          ))}
        </div>
      </div>

      {/* ===== 专家经验 ===== */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, #d97706, transparent)' }} />
          <span
            className="text-xs font-bold uppercase tracking-widest shrink-0 px-3 py-1 rounded-full border flex items-center gap-1.5"
            style={{
              color: '#d97706',
              borderColor: 'rgba(217,119,6,0.3)',
              background: 'rgba(217,119,6,0.08)',
            }}
          >
            <Lightbulb className="w-3 h-3" />
            专家经验 · 老师傅传帮带
          </span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, #d97706, transparent)' }} />
        </div>

        <div className="space-y-3">
          {expertTips.map((tip) => (
            <ExpertTipPanel key={tip.id} tip={tip} />
          ))}
        </div>
      </div>
    </div>
  );
}
