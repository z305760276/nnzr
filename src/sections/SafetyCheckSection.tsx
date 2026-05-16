import { useState } from 'react';
import { safetyCheckItems } from '../data/orgData';
import {
  Video, AlertTriangle, CheckCircle, Clock, Target, ChevronRight
} from 'lucide-react';

const hazardDetails = [
  { level: 1, name: '一级隐患（重大）', color: '#DC2626', bgColor: 'var(--safety-danger-bg)', borderColor: 'var(--safety-danger-border)', definition: '危害和整改难度较大，需要全部或局部停止供气，经过一定时间整改治理方能排除的隐患。此类隐患直接威胁用户生命财产安全，必须立即处置。', criteriaPlain: '新手判断口诀：能闻到明显煤气味、看到管道严重锈蚀穿孔、燃气表完全失效（直通表/反装）、热水器没有排烟管直接排在室内、灶具没有熄火保护装置。一句话：看到闻到就觉得"要出事"的，就是一级隐患。', process: '① 发现后立即现场处置（关阀/停气/疏散） → ② 30分钟内电话上报调度中心（3102277） → ③ 1小时内出具书面《隐患整改通知单》 → ④ CRM系统标记红色紧急状态 → ⑤ 每日跟踪整改进度 → ⑥ 整改完成后上门复查验收 → ⑦ 用户签字确认闭环', deadline: '1-7日内必须整改完毕，超期未整改的每日电话催收并上报站长', examples: ['漏气（能闻到气味或检漏仪报警）', '管道严重锈蚀穿孔', '燃气表直通表/反装/偷盗气', '灶具无熄火保护装置', '热水器直排式/无烟道', '连接软管穿墙/穿卧室'] },
  { level: 2, name: '二级隐患（较大）', color: '#D4A017', bgColor: 'var(--safety-warning-bg)', borderColor: 'var(--safety-warning-border)', definition: '危害和整改难度较小，发现后能够限期整改排除的隐患。不立即威胁安全，但长期存在会逐步升级为重大隐患。', criteriaPlain: '新手判断口诀：软管用了好几年表面有裂纹但没漏气、灶具用了8年没坏但已经很旧、管道有锈迹但不严重、报警器安装位置不对。一句话："有风险但暂时不会出事"，需要提醒用户限期整改。', process: '① 现场拍照记录隐患部位 → ② 向用户口头说明隐患危害 → ③ 签发《隐患整改通知单》一式两份（用户一份、公司存档一份） → ④ CRM系统录入隐患跟踪记录 → ⑤ 30日内安排复查 → ⑥ 用户签字确认整改完成', deadline: '30日内整改完毕，第15日电话提醒用户，第25日上门复查', examples: ['软管超期使用（超过2年）', '软管表面老化有裂纹', '灶具/灶前阀超期使用', '报警器未安装或安装位置错误', '开放式厨房', '燃气管道被暗埋暗封'] },
  { level: 3, name: '三级隐患（一般）', color: '#5B8DEF', bgColor: 'var(--safety-info-bg)', borderColor: 'var(--safety-info-border)', definition: '未有实时危险，主要向用户进行现场安全宣传，提出改善建议。用户可以选择性整改，但安检员必须履行告知义务。', criteriaPlain: '新手判断口诀：管道表面有点浮锈但金属本体完好、灶具和墙壁距离只有5cm（标准是10cm）、没有安装报警器但不是强制要求区域。一句话："建议改善"，不是强制整改，但必须告知用户。', process: '① 现场口头告知用户建议改善事项 → ② 发放安全用气宣传资料 → ③ 拍照留痕（隐患部位+宣传资料同框） → ④ CRM标记为三级隐患 → ⑤ 下次安检时优先关注是否改善', deadline: '建议30日内改善，不强求。但需在CRM中记录已告知', examples: ['管道轻微浮锈', '灶具安装不规范（与电器间距不足）', '灶具火盖变形/燃烧不良', '热水器安装不规范（无烟帽）', '燃气管道与电气设备安全间距不足'] },
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
  { level: 1, name: '正常', desc: '燃气管无锈蚀，表面完好，镀锌层完整', action: '无需处理，正常安检', colorStop: '#10B981' },
  { level: 2, name: '轻微生锈', desc: '燃气管锈蚀至呈黄色锈渍，镀锌管表层轻微脱落，金属本体完好', action: '保持监察，待下次检查周期检测', colorStop: '#84CC16' },
  { level: 3, name: '中度生锈', desc: '燃气管锈蚀至呈现咖啡色，镀锌管表层部分脱落，管身开始起泡', action: '建议用户更换，列入二级隐患', colorStop: '#F59E0B' },
  { level: 4, name: '严重生锈', desc: '燃气管锈蚀至呈现深咖啡色，部分表层出现龟裂及脱落，管壁变薄但未漏气', action: '建议用户尽快更换，列入一级隐患', colorStop: '#F97316' },
  { level: 5, name: '极严重生锈', desc: '燃气管锈蚀至呈现深咖啡色，大部分表层出现龟裂及脱落，管壁严重变薄但未漏气', action: '停气通知，立即更换管道', colorStop: '#EF4444' },
  { level: 6, name: '漏气', desc: '已发生燃气泄漏，检漏仪报警或闻到气味', action: '实时止漏，立即上报户内抢修人员', colorStop: '#DC2626' },
];

const safetyExpertTips = [
  { id: 1, scene: '用户拒不配合安检时的处理', trick: '第一步：耐心解释《城镇燃气管理条例》第27条，告知用户配合安检是法定义务。第二步：如仍不配合，联系物业或社区工作人员陪同上门协调。第三步：全程开启执法记录仪录音录像，留存证据。第四步：填写《到访不遇告知单》并拍照上传CRM。', regulation: '《隐患管理制度》第二章第4条：用户不配合安检的处理流程', risk: '强行入户可能引发冲突。必须两人以上同行并携带执法记录仪。禁止与用户发生肢体冲突，如遇激烈反抗立即撤离并报警。' },
  { id: 2, scene: '冬季用气高峰期安检效率提升', trick: '提前一周通过短信+微信双通道预约，告知用户具体上门时间段。选择周末上午9-11点、下午14-16点用户在家率最高的时段集中安排。老旧小区优先安排白天，新建小区可延长至晚上20点。', regulation: '《安检管理制度》第三章第3条：安检预约与时段安排', risk: '集中安排可能导致工单积压，需提前协调外包队伍增派人手。超负荷派单会导致安检质量下降，漏检隐患。' },
  { id: 3, scene: '智能表具读数异常判定', trick: '智能表具出现机械字轮与液晶显示不一致时，以机械字轮读数为准（机械字轮为法定计量依据）。记录两者差值并拍照，差值超过10立方米必须启动计量检定流程，填写《计量异常申报单》上报计量管理岗。', regulation: '《抄收管理制度》第四章第2条：计量异常处理', risk: '以液晶显示为准向用户收取气费，可能引发计量纠纷。差值超过10方未申报属于工作失职，按50元/次考核。' },
];

const videoPlaceholders = [
  { title: '智能表具更换标准操作', duration: '12:34', status: '待录制' },
  { title: '一级隐患现场处置示范', duration: '08:56', status: '待录制' },
  { title: 'CRM工单派发演示', duration: '06:21', status: '待录制' }
];

const level1Count = hazardFixList.filter(h => h.level === 1).length;
const level2Count = hazardFixList.filter(h => h.level === 2).length;
const level3Count = hazardFixList.filter(h => h.level === 3).length;

const STAT_CARDS = [
  { label: '一级隐患项', value: level1Count, unit: '项', icon: AlertTriangle, color: 'var(--safety-danger)', bg: 'var(--safety-danger-bg)', desc: '须立即停气处置' },
  { label: '二级隐患项', value: level2Count, unit: '项', icon: Clock, color: 'var(--safety-warning)', bg: 'var(--safety-warning-bg)', desc: '30日内限期整改' },
  { label: '三级隐患项', value: level3Count, unit: '项', icon: CheckCircle, color: 'var(--safety-info)', bg: 'var(--safety-info-bg)', desc: '建议改善告知' },
  { label: '安检检查项', value: safetyCheckItems.reduce((s, c) => s + c.items.length, 0), unit: '项', icon: Target, color: 'var(--safety-accent)', bg: 'var(--safety-accent-bg)', desc: '覆盖6大类别' },
];

function ExpertTipPanel({ tip }: { tip: typeof safetyExpertTips[number] }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all duration-300"
      style={{
        background: 'var(--safety-card)',
        borderColor: open ? 'var(--safety-border-active)' : 'var(--safety-border)',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
        style={{ background: open ? 'var(--safety-accent-bg)' : 'transparent' }}
      >
        <span className="text-sm font-medium" style={{ color: open ? 'var(--safety-accent)' : 'var(--text-primary)' }}>
          {tip.id}. {tip.scene}
        </span>
        <ChevronRight
          className="w-4 h-4 shrink-0 transition-transform duration-300"
          style={{ color: open ? 'var(--safety-accent)' : 'var(--text-muted)', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-400 ease-in-out"
        style={{ maxHeight: open ? '2000px' : '0px', opacity: open ? 1 : 0 }}
      >
        <div className="px-5 pb-5 pt-1" style={{ borderTop: '1px solid var(--safety-divider)' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <div className="rounded-xl p-4" style={{ background: 'var(--safety-warning-bg)', border: '1px solid var(--safety-warning-border)' }}>
              <span className="text-[10px] font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--safety-warning)' }}>
                实操技巧
              </span>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{tip.trick}</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: 'var(--safety-accent-bg)', border: '1px solid var(--safety-accent-border)' }}>
              <span className="text-[10px] font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--safety-accent)' }}>
                制度依据
              </span>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{tip.regulation}</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: 'var(--safety-danger-bg)', border: '1px solid var(--safety-danger-border)' }}>
              <span className="text-[10px] font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--safety-danger)' }}>
                风险提示
              </span>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{tip.risk}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SafetyCheckSection() {
  return (
    <div className="space-y-8">

      {/* ===== 统计概览卡片 ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STAT_CARDS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: 'var(--safety-stat-bg)',
                borderColor: 'var(--safety-stat-border)',
              }}
            >
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

      {/* ===== 三级隐患分级详情 ===== */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 rounded-full" style={{ background: 'var(--safety-danger)' }} />
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>三级隐患分级体系</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>来源：《隐患管理制度》V2.0 第三章</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {hazardDetails.map((h) => (
            <div
              key={h.level}
              className="relative overflow-hidden rounded-2xl border transition-all duration-300 hover:scale-[1.01]"
              style={{ background: 'var(--safety-card)', borderColor: 'var(--safety-border)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: h.color }} />

              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{ background: h.bgColor, color: h.color }}>
                    {h.level}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{h.name}</h3>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{h.deadline}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-xl p-3" style={{ background: 'var(--safety-glass)', border: '1px solid var(--safety-divider)' }}>
                    <span className="text-[10px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: h.color }}>定义</span>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{h.definition}</p>
                  </div>

                  <div className="rounded-xl p-3" style={{ background: 'var(--safety-glass)', border: '1px solid var(--safety-divider)' }}>
                    <span className="text-[10px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: h.color }}>判定标准（白话版）</span>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{h.criteriaPlain}</p>
                  </div>

                  <div className="rounded-xl p-3" style={{ background: 'var(--safety-glass)', border: '1px solid var(--safety-divider)' }}>
                    <span className="text-[10px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: h.color }}>处置流程</span>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{h.process}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--safety-divider)' }}>
                  <span className="text-[10px] font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>典型隐患示例</span>
                  <div className="flex flex-wrap gap-1.5">
                    {h.examples.map((ex, j) => (
                      <span key={j} className="px-2.5 py-1 rounded-lg text-[10px] transition-colors"
                        style={{ background: h.bgColor, border: `1px solid ${h.borderColor}`, color: 'var(--text-secondary)' }}>
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 隐患整改对照表 ===== */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 rounded-full" style={{ background: 'var(--safety-accent)' }} />
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>隐患整改标准对照表</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>27项 · 设备/部位 → 隐患内容 → 整改标准 → 等级</p>
          </div>
        </div>

        <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--safety-card)', borderColor: 'var(--safety-border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--safety-divider)' }}>
                  <th className="text-left text-xs font-semibold px-5 py-3.5" style={{ color: 'var(--text-muted)' }}>设备/部位</th>
                  <th className="text-left text-xs font-semibold px-5 py-3.5" style={{ color: 'var(--text-muted)' }}>隐患内容</th>
                  <th className="text-left text-xs font-semibold px-5 py-3.5" style={{ color: 'var(--text-muted)' }}>整改标准</th>
                  <th className="text-center text-xs font-semibold px-5 py-3.5 w-20" style={{ color: 'var(--text-muted)' }}>等级</th>
                </tr>
              </thead>
              <tbody>
                {hazardFixList.map((h, i) => (
                  <tr key={i} className="transition-colors"
                    style={{ borderBottom: '1px solid var(--safety-divider)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--safety-accent-bg)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '' }}
                  >
                    <td className="px-5 py-3 text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{h.item}</td>
                    <td className="px-5 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{h.hazard}</td>
                    <td className="px-5 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{h.fix}</td>
                    <td className="px-5 py-3 text-center">
                      <span className="text-[10px] px-2 py-1 rounded-full font-bold inline-block min-w-[36px]"
                        style={{
                          background: h.level === 1 ? 'var(--safety-danger-bg)' : h.level === 2 ? 'var(--safety-warning-bg)' : 'var(--safety-info-bg)',
                          color: h.level === 1 ? 'var(--safety-danger)' : h.level === 2 ? 'var(--safety-warning)' : 'var(--safety-info)',
                        }}>
                        {h.level}级
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== 管道锈蚀等级判定 ===== */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 rounded-full" style={{ background: 'var(--safety-warning)' }} />
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>管道锈蚀等级判定标准</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>6级递进 · 从正常到漏气的完整判定逻辑</p>
          </div>
        </div>

        <div className="rounded-2xl border p-6" style={{ background: 'var(--safety-card)', borderColor: 'var(--safety-border)' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {rustLevels.map((r) => (
              <div key={r.level} className="rounded-xl p-4 text-center transition-all duration-300 hover:scale-[1.03]"
                style={{ background: 'var(--safety-glass)', border: '1px solid var(--safety-divider)' }}>
                <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-lg font-bold mb-3"
                  style={{ background: `${r.colorStop}18`, color: r.colorStop }}>
                  {r.level}
                </div>
                <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{r.name}</h4>
                <p className="text-[10px] leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>{r.desc}</p>
                <div className="pt-2" style={{ borderTop: '1px solid var(--safety-divider)' }}>
                  <p className="text-[10px] font-medium" style={{ color: r.colorStop }}>{r.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 安检检查内容 ===== */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 rounded-full" style={{ background: 'var(--safety-success)' }} />
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>安检检查内容</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>6大类 · {safetyCheckItems.reduce((s, c) => s + c.items.length, 0)}项检查 · 来源：《安检管理制度》V2.0</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safetyCheckItems.map((cat, i) => (
            <div key={i} className="rounded-2xl border p-5 transition-all duration-300 hover:scale-[1.01]"
              style={{ background: 'var(--safety-card)', borderColor: 'var(--safety-border)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{ background: 'var(--safety-accent-bg)', color: 'var(--safety-accent)' }}>
                  {i + 1}
                </div>
                <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{cat.category}</h4>
              </div>
              <ul className="space-y-2">
                {cat.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: 'var(--safety-success)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 实操视频库 ===== */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 rounded-full" style={{ background: 'var(--safety-accent)' }} />
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>实操视频库</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>标准操作视频教程 · 录制完成后替换占位</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {videoPlaceholders.map((video, i) => (
            <div key={i} className="rounded-2xl border overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              style={{ background: 'var(--safety-card)', borderColor: 'var(--safety-border)' }}>
              <div className="relative aspect-video flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.04) 100%)' }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--safety-accent-bg)', border: '1px solid var(--safety-accent-border)' }}>
                  <Video className="w-6 h-6" style={{ color: 'var(--safety-accent)' }} />
                </div>
                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg text-[10px] font-medium"
                  style={{ background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)' }}>
                  {video.duration}
                </div>
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg text-[10px] font-medium"
                  style={{ background: 'var(--safety-warning-bg)', color: 'var(--safety-warning)' }}>
                  {video.status}
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{video.title}</h4>
                <span className="text-[10px] font-medium" style={{ color: 'var(--safety-danger)' }}>
                  【待补充】视频录制后替换占位
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 专家经验 ===== */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 rounded-full" style={{ background: '#F59E0B' }} />
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>专家经验（老师傅传帮带）</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{safetyExpertTips.length}条 · 场景 + 实操技巧 + 制度依据 + 风险提示</p>
          </div>
        </div>

        <div className="space-y-3">
          {safetyExpertTips.map(tip => (
            <ExpertTipPanel key={tip.id} tip={tip} />
          ))}
        </div>
      </section>

    </div>
  );
}
