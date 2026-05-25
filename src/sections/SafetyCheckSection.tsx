import { useState } from 'react';
import { safetyCheckItems } from '../data/orgData';
import {
  AlertTriangle, Wrench, ShieldAlert, CheckCircle,
  Lightbulb, Clock, Target, Video, ChevronDown, ChevronUp, X,
} from 'lucide-react';

const hazardDetails = [
  { level: 1, name: '一级隐患（重大）', color: '#DC2626', dim: 'rgba(220,38,38,0.08)', borderDim: 'rgba(220,38,38,0.20)', definition: '危害和整改难度较大，需要全部或局部停止供气，经过一定时间整改治理方能排除的隐患。此类隐患直接威胁用户生命财产安全，必须立即处置。', criteriaPlain: '新手判断口诀：能闻到明显煤气味、看到管道严重锈蚀穿孔、燃气表完全失效（直通表/反装）、热水器没有排烟管直接排在室内、灶具没有熄火保护装置。一句话：看到闻到就觉得"要出事"的，就是一级隐患。', process: '① 发现后立即现场处置（关阀/停气/疏散） → ② 30分钟内电话上报调度中心（3102277） → ③ 1小时内出具书面《隐患整改通知单》 → ④ CRM系统标记红色紧急状态 → ⑤ 每日跟踪整改进度 → ⑥ 整改完成后上门复查验收 → ⑦ 用户签字确认闭环', deadline: '1-7日内必须整改完毕', examples: ['漏气（能闻到气味或检漏仪报警）', '管道严重锈蚀穿孔', '燃气表直通表/反装/偷盗气', '灶具无熄火保护装置', '热水器直排式/无烟道', '连接软管穿墙/穿卧室'] },
  { level: 2, name: '二级隐患（较大）', color: '#D97706', dim: 'rgba(217,119,6,0.08)', borderDim: 'rgba(217,119,6,0.20)', definition: '危害和整改难度较小，发现后能够限期整改排除的隐患。不立即威胁安全，但长期存在会逐步升级为重大隐患。', criteriaPlain: '新手判断口诀：软管用了好几年表面有裂纹但没漏气、灶具用了8年没坏但已经很旧、管道有锈迹但不严重、报警器安装位置不对。一句话："有风险但暂时不会出事"，需要提醒用户限期整改。', process: '① 现场拍照记录隐患部位 → ② 向用户口头说明隐患危害 → ③ 签发《隐患整改通知单》一式两份（用户一份、公司存档一份） → ④ CRM系统录入隐患跟踪记录 → ⑤ 30日内安排复查 → ⑥ 用户签字确认整改完成', deadline: '30日内整改完毕', examples: ['软管超期使用（超过2年）', '软管表面老化有裂纹', '灶具/灶前阀超期使用', '报警器未安装或安装位置错误', '开放式厨房', '燃气管道被暗埋暗封'] },
  { level: 3, name: '三级隐患（一般）', color: '#2563EB', dim: 'rgba(37,99,235,0.08)', borderDim: 'rgba(37,99,235,0.20)', definition: '未有实时危险，主要向用户进行现场安全宣传，提出改善建议。用户可以选择性整改，但安检员必须履行告知义务。', criteriaPlain: '新手判断口诀：管道表面有点浮锈但金属本体完好、灶具和墙壁距离只有5cm（标准是10cm）、没有安装报警器但不是强制要求区域。一句话："建议改善"，不是强制整改，但必须告知用户。', process: '① 现场口头告知用户建议改善事项 → ② 发放安全用气宣传资料 → ③ 拍照留痕（隐患部位+宣传资料同框） → ④ CRM标记为三级隐患 → ⑤ 下次安检时优先关注是否改善', deadline: '建议30日内改善', examples: ['管道轻微浮锈', '灶具安装不规范（与电器间距不足）', '灶具火盖变形/燃烧不良', '热水器安装不规范（无烟帽）', '燃气管道与电气设备安全间距不足'] },
];

const hazardFixList = [
  { item: '燃气表', hazard: '漏气', fix: '立即更换燃气表，旧表回收送检', level: 1 },
  { item: '燃气表', hazard: '严重锈蚀', fix: '截气或拆除锈蚀表具，更换新表', level: 1 },
  { item: '燃气表', hazard: '直通表（旁通）', fix: '拆除旁通管道，重新规范安装', level: 1 },
  { item: '燃气表', hazard: '表前阀/调压箱生锈严重', fix: '更换阀门或防腐处理', level: 2 },
  { item: '燃气表', hazard: '显示异常', fix: '更换燃气表，旧表送计量检定', level: 2 },
  { item: '立管（表前管）', hazard: '漏气', fix: '更换整段锈蚀管道', level: 1 },
  { item: '立管（表前管）', hazard: '严重锈蚀', fix: '截气或拆除，重新安装新管道', level: 1 },
  { item: '立管（表后管）', hazard: '漏气', fix: '即时维修或更换', level: 1 },
  { item: '立管（表后管）', hazard: '严重锈蚀', fix: '更换管道', level: 1 },
  { item: '灶具', hazard: '无熄火保护装置', fix: '必须更换符合国家标准的新灶具', level: 1 },
  { item: '灶具', hazard: '漏气', fix: '更换新的零配件或新燃具', level: 1 },
  { item: '灶具', hazard: '安装不规范', fix: '调整安装位置，确保与墙面净距≥10cm', level: 3 },
  { item: '灶具', hazard: '火盖变形/燃烧不良', fix: '更换火盖或整灶', level: 3 },
  { item: '热水器', hazard: '直排式', fix: '更换强排式或平衡式热水器', level: 1 },
  { item: '热水器', hazard: '漏气', fix: '截气或拆除热水器', level: 1 },
  { item: '热水器', hazard: '烟道破损/松脱', fix: '修补、换新烟管或加装配件', level: 2 },
  { item: '热水器', hazard: '无烟帽', fix: '加装防风帽', level: 3 },
  { item: '连接软管', hazard: '漏气', fix: '立即更换为不锈钢波纹管', level: 1 },
  { item: '连接软管', hazard: '非专用/超期/老化', fix: '更换为不锈钢波纹管', level: 2 },
  { item: '连接软管', hazard: '穿墙/穿卧室/穿客厅', fix: '重新布管，禁止软管穿越', level: 1 },
  { item: '表前阀', hazard: '漏气', fix: '即时修妥或更换表前阀', level: 1 },
  { item: '灶前阀', hazard: '漏气', fix: '即时修妥或更换灶前阀', level: 1 },
  { item: '报警器', hazard: '未安装', fix: '安装可燃气体报警器', level: 2 },
  { item: '报警器', hazard: '安装位置错误', fix: '按规范重新安装', level: 2 },
  { item: '户内管道', hazard: '私改/私接', fix: '恢复原状或重新设计安装', level: 1 },
  { item: '户内管道', hazard: '暗埋暗封', fix: '拆除暗封物，恢复明管', level: 1 },
  { item: '户内管道', hazard: '搭挂重物', fix: '移除重物，加固管道', level: 2 },
];

const rustLevels = [
  { level: 1, name: '正常', desc: '燃气管无锈蚀，表面完好，镀锌层完整', action: '无需处理，正常安检', color: '#10B981' },
  { level: 2, name: '轻微生锈', desc: '燃气管锈蚀至呈黄色锈渍，镀锌管表层轻微脱落，金属本体完好', action: '保持监察，待下次检查周期检测', color: '#84CC16' },
  { level: 3, name: '中度生锈', desc: '燃气管锈蚀至呈现咖啡色，镀锌管表层部分脱落，管身开始起泡', action: '建议用户更换，列入二级隐患', color: '#F59E0B' },
  { level: 4, name: '严重生锈', desc: '燃气管锈蚀至呈现深咖啡色，部分表层出现龟裂及脱落，管壁变薄但未漏气', action: '建议用户尽快更换，列入一级隐患', color: '#F97316' },
  { level: 5, name: '极严重生锈', desc: '燃气管锈蚀至呈现深咖啡色，大部分表层出现龟裂及脱落，管壁严重变薄但未漏气', action: '停气通知，立即更换管道', color: '#EF4444' },
  { level: 6, name: '漏气', desc: '已发生燃气泄漏，检漏仪报警或闻到气味', action: '实时止漏，立即上报户内抢修人员', color: '#DC2626' },
];

const safetyExpertTips = [
  { id: 1, scene: '用户拒不配合安检时的处理', trick: '第一步：耐心解释《城镇燃气管理条例》第27条，告知用户配合安检是法定义务。第二步：如仍不配合，联系物业或社区工作人员陪同上门协调。第三步：全程开启执法记录仪录音录像，留存证据。第四步：填写《到访不遇告知单》并拍照上传CRM。', regulation: '《隐患管理制度》第二章第4条：用户不配合安检的处理流程', risk: '强行入户可能引发冲突。必须两人以上同行并携带执法记录仪。禁止与用户发生肢体冲突，如遇激烈反抗立即撤离并报警。' },
  { id: 2, scene: '冬季用气高峰期安检效率提升', trick: '提前一周通过短信+微信双通道预约，告知用户具体上门时间段。选择周末上午9-11点、下午14-16点用户在家率最高的时段集中安排。老旧小区优先安排白天，新建小区可延长至晚上20点。', regulation: '《安检管理制度》第三章第3条：安检预约与时段安排', risk: '集中安排可能导致工单积压，需提前协调外包队伍增派人手。超负荷派单会导致安检质量下降，漏检隐患。' },
  { id: 3, scene: '智能表具读数异常判定', trick: '智能表具出现机械字轮与液晶显示不一致时，以机械字轮读数为准（机械字轮为法定计量依据）。记录两者差值并拍照，差值超过10立方米必须启动计量检定流程，填写《计量异常申报单》上报计量管理岗。', regulation: '《抄收管理制度》第四章第2条：计量异常处理', risk: '以液晶显示为准向用户收取气费，可能引发计量纠纷。差值超过10方未申报属于工作失职，按50元/次考核。' },
];

const videoPlaceholders = [
  { title: '智能表具更换标准操作', duration: '12:34', status: '待录制' },
  { title: '一级隐患现场处置示范', duration: '08:56', status: '待录制' },
  { title: 'CRM工单派发演示', duration: '06:21', status: '待录制' },
];

const level1Count = hazardFixList.filter(h => h.level === 1).length;
const level2Count = hazardFixList.filter(h => h.level === 2).length;
const level3Count = hazardFixList.filter(h => h.level === 3).length;
const totalCheckItems = safetyCheckItems.reduce((s, c) => s + c.items.length, 0);

const statCards = [
  { label: '一级隐患项', value: level1Count, unit: '项', icon: AlertTriangle, color: 'var(--score-critical)', bg: 'var(--score-critical-bg)', desc: '须立即停气处置' },
  { label: '二级隐患项', value: level2Count, unit: '项', icon: Clock, color: 'var(--score-major)', bg: 'var(--score-major-bg)', desc: '30日内限期整改' },
  { label: '三级隐患项', value: level3Count, unit: '项', icon: CheckCircle, color: 'var(--score-general)', bg: 'var(--score-general-bg)', desc: '建议改善告知' },
  { label: '安检检查项', value: totalCheckItems, unit: '项', icon: Target, color: 'var(--score-minor)', bg: 'var(--score-minor-bg)', desc: '覆盖6大类别' },
];

function SectionDivider({ label, color = 'var(--score-critical)', icon: Icon }: { label: string; color?: string; icon?: React.FC<{ className?: string }> }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      <span
        className="text-xs font-bold uppercase tracking-widest shrink-0 px-3 py-1 rounded-full border inline-flex items-center gap-1.5"
        style={{ color, borderColor: color + '40', background: color + '12' }}
      >
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </span>
      <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
    </div>
  );
}

export default function SafetyCheckSection() {
  const [fixDrawerOpen, setFixDrawerOpen] = useState(false);

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

      {/* ===== 1. 三级隐患分级体系 ===== */}
      <div id="safety-hazards" style={{ scrollMarginTop: 80 }}>
        <SectionDivider label="三级隐患分级体系" color="var(--score-critical)" icon={AlertTriangle} />
        <div className="space-y-3">
          {hazardDetails.map((h) => (
            <HazardDetailPanel key={h.level} hazard={h} />
          ))}
        </div>
      </div>

      {/* ===== 2. 隐患整改标准对照表 ===== */}
      <div id="safety-hazard-fix" style={{ scrollMarginTop: 80 }}>
        <SectionDivider label={`隐患整改标准对照表（${hazardFixList.length}项）`} color="var(--score-major)" icon={Wrench} />
        <button
          onClick={() => setFixDrawerOpen(true)}
          className="w-full rounded-2xl border p-5 text-left transition-all duration-300 hover:brightness-110"
          style={{ borderColor: 'var(--score-panel-border)', background: 'var(--score-gradient-panel)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--score-major-bg)' }}>
                <Wrench className="w-5 h-5" style={{ color: 'var(--score-major)' }} />
              </div>
              <div>
                <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>点击查看完整对照表</h3>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  覆盖{hazardFixList.length}项隐患类型，含设备部位、隐患内容、整改标准、等级
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] px-2 py-1 rounded-full font-medium"
                style={{ background: 'var(--score-critical-bg)', color: 'var(--score-critical)' }}>
                一级 {level1Count}项
              </span>
              <span className="text-[10px] px-2 py-1 rounded-full font-medium"
                style={{ background: 'var(--score-major-bg)', color: 'var(--score-major)' }}>
                二级 {level2Count}项
              </span>
              <span className="text-[10px] px-2 py-1 rounded-full font-medium"
                style={{ background: 'var(--score-general-bg)', color: 'var(--score-general)' }}>
                三级 {level3Count}项
              </span>
              <span className="text-lg" style={{ color: 'var(--text-muted)' }}>→</span>
            </div>
          </div>
        </button>
      </div>
      {fixDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end" onClick={() => setFixDrawerOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-2xl h-full overflow-y-auto"
            style={{
              background: 'var(--kpi-glass-bg-strong, #1a1a2e)',
              backdropFilter: 'blur(24px) saturate(180%)',
              borderLeft: '1px solid var(--kpi-glass-border, rgba(255,255,255,0.08))',
              boxShadow: '0 0 64px rgba(0,0,0,0.4)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4"
              style={{
                background: 'var(--kpi-glass-bg-strong, #1a1a2e)',
                backdropFilter: 'blur(24px) saturate(180%)',
                borderBottom: '1px solid var(--kpi-divider, rgba(255,255,255,0.06))',
              }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--score-major-bg)' }}>
                  <Wrench className="w-4.5 h-4.5" style={{ color: 'var(--score-major)' }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--kpi-text-primary, var(--text-primary))' }}>
                    隐患整改标准对照表
                  </h3>
                  <p className="text-[10px]" style={{ color: 'var(--kpi-text-muted, var(--text-muted))' }}>
                    {hazardFixList.length}项 · 覆盖燃气表/立管/灶具/热水器/软管等
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFixDrawerOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="p-5">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--kpi-divider, rgba(255,255,255,0.06))' }}>
                    <th className="text-left text-[11px] font-semibold px-3 py-3" style={{ color: 'var(--kpi-text-muted, var(--text-muted))' }}>设备/部位</th>
                    <th className="text-left text-[11px] font-semibold px-3 py-3" style={{ color: 'var(--kpi-text-muted, var(--text-muted))' }}>隐患内容</th>
                    <th className="text-left text-[11px] font-semibold px-3 py-3" style={{ color: 'var(--kpi-text-muted, var(--text-muted))' }}>整改标准</th>
                    <th className="text-center text-[11px] font-semibold px-3 py-3 w-16" style={{ color: 'var(--kpi-text-muted, var(--text-muted))' }}>等级</th>
                  </tr>
                </thead>
                <tbody>
                  {hazardFixList.map((h, i) => {
                    const lvlColor = h.level === 1 ? 'var(--score-critical)' : h.level === 2 ? 'var(--score-major)' : 'var(--score-general)';
                    const lvlBg = h.level === 1 ? 'var(--score-critical-bg)' : h.level === 2 ? 'var(--score-major-bg)' : 'var(--score-general-bg)';
                    const rowBg = i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent';
                    return (
                      <tr key={i} className="transition-colors"
                        style={{ background: rowBg }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = rowBg; }}
                      >
                        <td className="px-3 py-2.5 text-xs font-medium" style={{ color: 'var(--kpi-text-primary, var(--text-primary))' }}>{h.item}</td>
                        <td className="px-3 py-2.5 text-xs" style={{ color: 'var(--kpi-text-secondary, var(--text-secondary))' }}>{h.hazard}</td>
                        <td className="px-3 py-2.5 text-xs" style={{ color: 'var(--kpi-text-secondary, var(--text-secondary))' }}>{h.fix}</td>
                        <td className="px-3 py-2.5 text-center">
                          <span className="text-[10px] px-2 py-1 rounded-full font-bold inline-block min-w-[36px]"
                            style={{ background: lvlBg, color: lvlColor }}>
                            {h.level}级
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===== 3. 管道锈蚀等级判定标准 ===== */}
      <div id="safety-rust-levels" style={{ scrollMarginTop: 80 }}>
        <SectionDivider label="管道锈蚀等级判定标准（6级）" color="#10B981" icon={ShieldAlert} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {rustLevels.map((r) => (
            <div key={r.level} className="rounded-2xl border p-4 text-center transition-all duration-300 glass-shimmer"
              style={{ background: 'var(--score-gradient-panel)', borderColor: 'var(--score-panel-border)' }}>
              <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-lg font-bold mb-3"
                style={{ background: r.color + '18', color: r.color }}>{r.level}</div>
              <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{r.name}</h4>
              <p className="text-[10px] leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>{r.desc}</p>
              <div className="pt-2" style={{ borderTop: '1px solid var(--score-divider)' }}>
                <p className="text-[10px] font-medium" style={{ color: r.color }}>{r.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 4. 安检检查内容 ===== */}
      <div id="safety-check-items" style={{ scrollMarginTop: 80 }}>
        <SectionDivider label={`安检检查内容（6大类 · ${totalCheckItems}项）`} color="var(--score-general)" icon={CheckCircle} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {safetyCheckItems.map((cat, i) => (
            <div key={i} className="rounded-2xl border p-4 transition-all duration-300 glass-shimmer"
              style={{ background: 'var(--score-gradient-panel)', borderColor: 'var(--score-panel-border)' }}>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold"
                  style={{ background: 'var(--score-minor-bg)', color: 'var(--score-minor)' }}>{i + 1}</div>
                <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{cat.category}</h4>
              </div>
              <ul className="space-y-1.5">
                {cat.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#10B981' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 5. 实操视频库 ===== */}
      <div>
        <SectionDivider label="实操视频库" color="#7c3aed" icon={Video} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {videoPlaceholders.map((video, i) => (
            <div key={i} className="rounded-2xl border overflow-hidden transition-all duration-300 glass-shimmer"
              style={{ background: 'var(--score-gradient-panel)', borderColor: 'var(--score-panel-border)' }}>
              <div className="relative aspect-video flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.04) 100%)' }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--score-minor-bg)', border: '1px solid var(--score-panel-border)' }}>
                  <Video className="w-6 h-6" style={{ color: 'var(--score-minor)' }} />
                </div>
                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg text-[10px] font-medium"
                  style={{ background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)' }}>{video.duration}</div>
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg text-[10px] font-medium"
                  style={{ background: 'var(--score-major-bg)', color: 'var(--score-major)' }}>{video.status}</div>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{video.title}</h4>
                <span className="text-[10px] font-medium" style={{ color: 'var(--score-critical)' }}>【待补充】视频录制后替换占位</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 6. 专家经验 ===== */}
      <div>
        <SectionDivider label={`专家经验（老师傅传帮带 · ${safetyExpertTips.length}条）`} color="#d97706" icon={Lightbulb} />
        <div className="space-y-3">
          {safetyExpertTips.map((tip) => (
            <ExpertTipPanel key={tip.id} tip={tip} />
          ))}
        </div>
      </div>

    </div>
  );
}

function HazardDetailPanel({ hazard }: { hazard: typeof hazardDetails[0] }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all duration-300 glass-shimmer"
      style={{ background: 'var(--score-gradient-panel)', borderColor: 'var(--score-panel-border)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors"
        style={{ background: open ? 'var(--score-panel-hover)' : 'transparent' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--score-panel-hover)'; }}
        onMouseLeave={(e) => { if (!open) e.currentTarget.style.background = 'transparent'; }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-base"
            style={{ background: `linear-gradient(135deg, ${hazard.color}, ${hazard.color}dd)` }}>
            {hazard.level}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{hazard.name}</h3>
              <span className="text-xs font-semibold" style={{ color: hazard.color }}>
                {hazard.deadline}
              </span>
            </div>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {hazard.examples.length}个典型隐患示例
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{ background: hazard.dim, color: hazard.color }}
          >
            {hazard.examples.length}例
          </span>
          {open ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
        </div>
      </button>

      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: open ? '4000px' : '0px', opacity: open ? 1 : 0 }}
      >
        <div className="px-5 pb-5 pt-1" style={{ borderTop: '1px solid var(--score-divider)' }}>
          <div className="space-y-3 mt-4">
            {[
              { label: '定义', content: hazard.definition, color: hazard.color },
              { label: '判定标准（白话版）', content: hazard.criteriaPlain, color: hazard.color },
              { label: '处置流程', content: hazard.process, color: hazard.color },
            ].map(f => (
              <div key={f.label} className="rounded-lg p-3.5" style={{ background: hazard.dim }}>
                <span className="text-[10px] font-semibold uppercase tracking-wider block mb-1" style={{ color: f.color }}>{f.label}</span>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.content}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--score-divider)' }}>
            <span className="text-[10px] font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>典型隐患示例</span>
            <div className="flex flex-wrap gap-1.5">
              {hazard.examples.map((ex, j) => (
                <span key={j} className="px-2.5 py-1 rounded-lg text-xs" style={{ background: hazard.dim, border: `1px solid ${hazard.borderDim}`, color: 'var(--text-secondary)' }}>{ex}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpertTipPanel({ tip }: { tip: typeof safetyExpertTips[0] }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all duration-300 glass-shimmer"
      style={{ background: 'var(--score-gradient-panel)', borderColor: 'var(--score-panel-border)' }}
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
            <div className="rounded-lg p-3.5" style={{ background: 'rgba(245,158,11,0.06)' }}>
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#b45309' }}>实操技巧</span>
              <p className="text-sm mt-1.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{tip.trick}</p>
            </div>
            <div className="rounded-lg p-3.5" style={{ background: 'rgba(99,102,241,0.06)' }}>
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#4f46e5' }}>制度依据</span>
              <p className="text-sm mt-1.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{tip.regulation}</p>
            </div>
            <div className="rounded-lg p-3.5" style={{ background: 'rgba(239,68,68,0.06)' }}>
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#dc2626' }}>风险提示</span>
              <p className="text-sm mt-1.5 leading-relaxed" style={{ color: '#b45309' }}>{tip.risk}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
