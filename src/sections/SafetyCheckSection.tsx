import { AccordionGroup, AccordionItem, SubAccordion } from '../components/Accordion';
import { safetyCheckItems } from '../data/orgData';
import { Video, Lightbulb, AlertTriangle, CheckCircle, ShieldAlert, Wrench } from 'lucide-react';

const hazardDetails = [
  { level: 1, name: "一级隐患（重大）", color: "#E31837", borderColor: "rgba(227,24,55,0.3)", definition: "危害和整改难度较大，需要全部或局部停止供气，经过一定时间整改治理方能排除的隐患。此类隐患直接威胁用户生命财产安全，必须立即处置。", criteriaPlain: "新手判断口诀：能闻到明显煤气味、看到管道严重锈蚀穿孔、燃气表完全失效（直通表/反装）、热水器没有排烟管直接排在室内、灶具没有熄火保护装置。一句话：看到闻到就觉得'要出事'的，就是一级隐患。", process: "① 发现后立即现场处置（关阀/停气/疏散） → ② 30分钟内电话上报调度中心（3102277） → ③ 1小时内出具书面《隐患整改通知单》 → ④ CRM系统标记红色紧急状态 → ⑤ 每日跟踪整改进度 → ⑥ 整改完成后上门复查验收 → ⑦ 用户签字确认闭环", deadline: "1-7日内必须整改完毕，超期未整改的每日电话催收并上报站长", examples: ["漏气（能闻到气味或检漏仪报警）", "管道严重锈蚀穿孔", "燃气表直通表/反装/偷盗气", "灶具无熄火保护装置", "热水器直排式/无烟道", "连接软管穿墙/穿卧室"] },
  { level: 2, name: "二级隐患（较大）", color: "#F59E0B", borderColor: "rgba(245,158,11,0.3)", definition: "危害和整改难度较小，发现后能够限期整改排除的隐患。不立即威胁安全，但长期存在会逐步升级为重大隐患。", criteriaPlain: "新手判断口诀：软管用了好几年表面有裂纹但没漏气、灶具用了8年没坏但已经很旧、管道有锈迹但不严重、报警器安装位置不对。一句话：'有风险但暂时不会出事'，需要提醒用户限期整改。", process: "① 现场拍照记录隐患部位 → ② 向用户口头说明隐患危害 → ③ 签发《隐患整改通知单》一式两份（用户一份、公司存档一份） → ④ CRM系统录入隐患跟踪记录 → ⑤ 30日内安排复查 → ⑥ 用户签字确认整改完成", deadline: "30日内整改完毕，第15日电话提醒用户，第25日上门复查", examples: ["软管超期使用（超过2年）", "软管表面老化有裂纹", "灶具/灶前阀超期使用", "报警器未安装或安装位置错误", "开放式厨房", "燃气管道被暗埋暗封"] },
  { level: 3, name: "三级隐患（一般）", color: "#3B82F6", borderColor: "rgba(59,130,246,0.3)", definition: "未有实时危险，主要向用户进行现场安全宣传，提出改善建议。用户可以选择性整改，但安检员必须履行告知义务。", criteriaPlain: "新手判断口诀：管道表面有点浮锈但金属本体完好、灶具和墙壁距离只有5cm（标准是10cm）、没有安装报警器但不是强制要求区域。一句话：'建议改善'，不是强制整改，但必须告知用户。", process: "① 现场口头告知用户建议改善事项 → ② 发放安全用气宣传资料 → ③ 拍照留痕（隐患部位+宣传资料同框） → ④ CRM标记为三级隐患 → ⑤ 下次安检时优先关注是否改善", deadline: "建议30日内改善，不强求。但需在CRM中记录已告知", examples: ["管道轻微浮锈", "灶具安装不规范（与电器间距不足）", "灶具火盖变形/燃烧不良", "热水器安装不规范（无烟帽）", "燃气管道与电气设备安全间距不足"] },
];

const hazardFixList = [
  { item: "燃气表", hazard: "漏气", fix: "立即更换燃气表，旧表回收送检", level: 1 },
  { item: "燃气表", hazard: "严重锈蚀", fix: "截气或拆除锈蚀表具，更换新表", level: 1 },
  { item: "燃气表", hazard: "直通表（旁通）", fix: "拆除旁通管道，重新规范安装", level: 1 },
  { item: "燃气表", hazard: "表前阀/调压箱生锈严重", fix: "更换阀门或防腐处理", level: 2 },
  { item: "燃气表", hazard: "显示异常", fix: "更换燃气表，旧表送计量检定", level: 2 },
  { item: "立管（表前管）", hazard: "漏气", fix: "更换整段锈蚀管道", level: 1 },
  { item: "立管（表前管）", hazard: "严重锈蚀", fix: "截气或拆除，重新安装新管道", level: 1 },
  { item: "立管（表后管）", hazard: "漏气", fix: "即时维修或更换", level: 1 },
  { item: "立管（表后管）", hazard: "严重锈蚀", fix: "更换管道", level: 1 },
  { item: "灶具", hazard: "无熄火保护装置", fix: "必须更换符合国家标准的新灶具", level: 1 },
  { item: "灶具", hazard: "漏气", fix: "更换新的零配件或新燃具", level: 1 },
  { item: "灶具", hazard: "安装不规范", fix: "调整安装位置，确保与墙面净距≥10cm", level: 3 },
  { item: "灶具", hazard: "火盖变形/燃烧不良", fix: "更换火盖或整灶", level: 3 },
  { item: "热水器", hazard: "直排式", fix: "更换强排式或平衡式热水器", level: 1 },
  { item: "热水器", hazard: "漏气", fix: "截气或拆除热水器", level: 1 },
  { item: "热水器", hazard: "烟道破损/松脱", fix: "修补、换新烟管或加装配件", level: 2 },
  { item: "热水器", hazard: "无烟帽", fix: "加装防风帽", level: 3 },
  { item: "连接软管", hazard: "漏气", fix: "立即更换为不锈钢波纹管", level: 1 },
  { item: "连接软管", hazard: "非专用/超期/老化", fix: "更换为不锈钢波纹管", level: 2 },
  { item: "连接软管", hazard: "穿墙/穿卧室/穿客厅", fix: "重新布管，禁止软管穿越", level: 1 },
  { item: "表前阀", hazard: "漏气", fix: "即时修妥或更换表前阀", level: 1 },
  { item: "灶前阀", hazard: "漏气", fix: "即时修妥或更换灶前阀", level: 1 },
  { item: "报警器", hazard: "未安装", fix: "安装可燃气体报警器", level: 2 },
  { item: "报警器", hazard: "安装位置错误", fix: "按规范重新安装", level: 2 },
  { item: "户内管道", hazard: "私改/私接", fix: "恢复原状或重新设计安装", level: 1 },
  { item: "户内管道", hazard: "暗埋暗封", fix: "拆除暗封物，恢复明管", level: 1 },
  { item: "户内管道", hazard: "搭挂重物", fix: "移除重物，加固管道", level: 2 },
];

const rustLevels = [
  { level: 1, name: "正常", desc: "燃气管无锈蚀，表面完好，镀锌层完整", action: "无需处理，正常安检" },
  { level: 2, name: "轻微生锈", desc: "燃气管锈蚀至呈黄色锈渍，镀锌管表层轻微脱落，金属本体完好", action: "保持监察，待下次检查周期检测" },
  { level: 3, name: "中度生锈", desc: "燃气管锈蚀至呈现咖啡色，镀锌管表层部分脱落，管身开始起泡", action: "建议用户更换，列入二级隐患" },
  { level: 4, name: "严重生锈", desc: "燃气管锈蚀至呈现深咖啡色，部分表层出现龟裂及脱落，管壁变薄但未漏气", action: "建议用户尽快更换，列入一级隐患" },
  { level: 5, name: "极严重生锈", desc: "燃气管锈蚀至呈现深咖啡色，大部分表层出现龟裂及脱落，管壁严重变薄但未漏气", action: "停气通知，立即更换管道" },
  { level: 6, name: "漏气", desc: "已发生燃气泄漏，检漏仪报警或闻到气味", action: "实时止漏，立即上报户内抢修人员" },
];

const safetyExpertTips = [
  { id: 1, scene: "用户拒不配合安检时的处理", trick: "第一步：耐心解释《城镇燃气管理条例》第27条，告知用户配合安检是法定义务。第二步：如仍不配合，联系物业或社区工作人员陪同上门协调。第三步：全程开启执法记录仪录音录像，留存证据。第四步：填写《到访不遇告知单》并拍照上传CRM。", regulation: "《隐患管理制度》第二章第4条：用户不配合安检的处理流程", risk: "强行入户可能引发冲突。必须两人以上同行并携带执法记录仪。禁止与用户发生肢体冲突，如遇激烈反抗立即撤离并报警。" },
  { id: 2, scene: "冬季用气高峰期安检效率提升", trick: "提前一周通过短信+微信双通道预约，告知用户具体上门时间段。选择周末上午9-11点、下午14-16点用户在家率最高的时段集中安排。老旧小区优先安排白天，新建小区可延长至晚上20点。", regulation: "《安检管理制度》第三章第3条：安检预约与时段安排", risk: "集中安排可能导致工单积压，需提前协调外包队伍增派人手。超负荷派单会导致安检质量下降，漏检隐患。" },
  { id: 3, scene: "智能表具读数异常判定", trick: "智能表具出现机械字轮与液晶显示不一致时，以机械字轮读数为准（机械字轮为法定计量依据）。记录两者差值并拍照，差值超过10立方米必须启动计量检定流程，填写《计量异常申报单》上报计量管理岗。", regulation: "《抄收管理制度》第四章第2条：计量异常处理", risk: "以液晶显示为准向用户收取气费，可能引发计量纠纷。差值超过10方未申报属于工作失职，按50元/次考核。" },
];

const videoPlaceholders = [
  { title: "智能表具更换标准操作", duration: "12:34", status: "待录制" },
  { title: "一级隐患现场处置示范", duration: "08:56", status: "待录制" },
  { title: "CRM工单派发演示", duration: "06:21", status: "待录制" }
];

export default function SafetyCheckSection() {

  return (
    <div className="space-y-6">
        
        <AccordionGroup className="space-y-3">
          {hazardDetails.map((h, i) => (
            <AccordionItem key={h.level} id={`hazard-${h.level}`} title={h.name} summary={`整改时限：${h.deadline}`} icon={<AlertTriangle className="w-5 h-5" style={{ color: h.color }} />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { label: '定义', content: h.definition },
                  { label: '判定标准白话版', content: h.criteriaPlain },
                  { label: '处置流程', content: h.process },
                  { label: '整改时限', content: h.deadline },
                ].map(f => (
                  <div key={f.label} className="dark-card bg-[var(--card-inner-bg)] rounded-lg p-3 border-l-2" style={{ borderColor: h.color }}>
                    <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: h.color }}>{f.label}</h4>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.content}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <h4 className="text-xs text-white font-semibold uppercase tracking-wider mb-2">典型隐患示例（新手对照用）</h4>
                <div className="flex flex-wrap gap-2">
                  {h.examples.map((ex, j) => (
                    <span key={j} className="px-3 py-1.5 rounded-lg text-xs text-[var(--text-secondary)] border" style={{ borderColor: `${h.color}20`, background: `${h.color}06` }}>{ex}</span>
                  ))}
                </div>
              </div>
              <p className="text-white text-[10px] mt-3">来源：《客户服务部隐患管理制度》V2.0 第三章第{i + 1}条</p>
            </AccordionItem>
          ))}

          <AccordionItem id="hazard-fix-table" title={`隐患整改标准对照表（${hazardFixList.length}项）`} summary="设备/部位 → 隐患内容 → 整改标准 → 等级" icon={<Wrench className="w-5 h-5" />}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(200,16,46,0.08)] bg-[rgba(200,16,46,0.03)]">
                    <th className="text-left text-[var(--accent)] text-xs font-semibold px-3 py-2">设备/部位</th>
                    <th className="text-left text-[var(--accent)] text-xs font-semibold px-3 py-2">隐患内容</th>
                    <th className="text-left text-[var(--accent)] text-xs font-semibold px-3 py-2">整改标准</th>
                    <th className="text-center text-[var(--accent)] text-xs font-semibold px-3 py-2">等级</th>
                  </tr>
                </thead>
                <tbody>
                  {hazardFixList.map((h, i) => (
                    <tr key={i} className="border-b border-[rgba(200,16,46,0.03)] hover:bg-[rgba(200,16,46,0.02)] transition-colors">
                      <td className="px-3 py-2 text-[var(--text-primary)] text-xs">{h.item}</td>
                      <td className="px-3 py-2 text-[var(--text-secondary)] text-xs">{h.hazard}</td>
                      <td className="px-3 py-2 text-[var(--accent)] text-xs">{h.fix}</td>
                      <td className="px-3 py-2 text-center">
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ background: h.level === 1 ? 'rgba(227,24,55,0.1)' : 'rgba(59,130,246,0.08)', color: h.level === 1 ? '#E31837' : '#3B82F6' }}>{h.level}级</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-white text-[10px] mt-2">来源：《客户服务部隐患管理制度》V2.0 附录表7</p>
          </AccordionItem>

          <AccordionItem id="rust-levels" title="管道锈蚀等级判定标准（6级）" summary="正常→轻微→中度→严重→极严重→漏气" icon={<ShieldAlert className="w-5 h-5" />}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {rustLevels.map((r) => (
                <div key={r.level} className="dark-card bg-[var(--card-inner-bg-strong)] border border-[rgba(200,16,46,0.06)] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: r.level >= 4 ? 'rgba(227,24,55,0.1)' : r.level >= 2 ? 'rgba(245,158,11,0.08)' : 'rgba(59,130,246,0.08)', color: r.level >= 4 ? '#E31837' : r.level >= 2 ? '#F59E0B' : '#3B82F6' }}>{r.level}</span>
                    <span className="text-sm font-bold text-[var(--text-primary)]">{r.name}</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mb-2 leading-relaxed">{r.desc}</p>
                  <p className="text-[10px] text-[var(--accent)]">{r.action}</p>
                </div>
              ))}
            </div>
          </AccordionItem>

          <AccordionItem id="check-items" title={`安检检查内容（6大类 · ${safetyCheckItems.reduce((s, c) => s + c.items.length, 0)}项）`} summary="用气环境/室内管道/燃气表具/用气设备/安全装置/气密性检测" icon={<CheckCircle className="w-5 h-5" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {safetyCheckItems.map((cat, i) => (
                <div key={i} className="dark-card bg-[var(--card-inner-bg)] border border-[rgba(200,16,46,0.06)] rounded-xl p-4">
                  <h4 className="text-[var(--accent)] text-sm font-semibold mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-[var(--brand-bg)] flex items-center justify-center text-[10px] text-[#C8102E] font-bold">{i + 1}</span>
                    {cat.category}
                  </h4>
                  <ul className="space-y-1.5">
                    {cat.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                        <span className="w-1 h-1 rounded-full bg-[#C8102E] mt-1.5 shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="text-white text-[10px] mt-3">来源：《客户服务部安检管理制度》V2.0 第三章</p>
          </AccordionItem>

          <AccordionItem id="video-lib" title="实操视频库" summary="智能表具更换 / 一级隐患处置 / CRM工单派发" icon={<Video className="w-5 h-5" />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {videoPlaceholders.map((video, i) => (
                <div key={i} className="dark-card bg-[var(--card-inner-bg-strong)] border border-[rgba(200,16,46,0.06)] rounded-xl overflow-hidden">
                  <div className="relative aspect-video bg-[rgba(5,10,20,0.6)] flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[var(--brand-bg)] border border-[var(--border-subtle)] flex items-center justify-center">
                      <Video className="w-6 h-6 text-[#C8102E]" />
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-[var(--text-primary)]">{video.duration}</div>
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[rgba(245,158,11,0.12)] text-[10px] text-[#F59E0B]">{video.status}</div>
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm text-[var(--text-primary)] font-medium mb-1">{video.title}</h4>
                    <span className="text-[#E31837] text-xs font-medium">【待补充】视频录制后替换占位</span>
                  </div>
                </div>
              ))}
            </div>
          </AccordionItem>

          <AccordionItem id="expert-tips" title="专家经验（老师傅传帮带）" summary={`${safetyExpertTips.length}条 · 场景+土办法+制度依据+风险提示`} icon={<Lightbulb className="w-5 h-5" />}>
            <div className="space-y-3">
              {safetyExpertTips.map(tip => (
                <SubAccordion key={tip.id} title={`${tip.id}. ${tip.scene}`}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-[rgba(245,158,11,0.03)] rounded-lg p-3">
                      <span className="text-[10px] text-[#F59E0B] font-semibold uppercase">土办法 / 实操技巧</span>
                      <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{tip.trick}</p>
                    </div>
                    <div className="bg-[rgba(200,16,46,0.03)] rounded-lg p-3">
                      <span className="text-[10px] text-[var(--accent)] font-semibold uppercase">制度依据</span>
                      <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{tip.regulation}</p>
                    </div>
                    <div className="bg-[rgba(239,68,68,0.03)] rounded-lg p-3">
                      <span className="text-[10px] text-[#EF4444] font-semibold uppercase">风险提示</span>
                      <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{tip.risk}</p>
                    </div>
                  </div>
                </SubAccordion>
              ))}
            </div>
          </AccordionItem>
        </AccordionGroup>
      </div>
  );
}
