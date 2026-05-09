import { AccordionGroup, AccordionItem, SubAccordion } from '../components/Accordion';
import { Cpu, Clock, User, Monitor, Lightbulb, FileText } from 'lucide-react';

const workSteps = [
  { step: 1, title: "工单发起", description: "用户通过95007热线、微信公众号、营业厅、全国联络中心等渠道提交服务请求，系统自动生成CRM工单并记录诉求详情。所有诉求信息（用户姓名、地址、联系电话、问题描述、预约时间）必须在系统中完整录入。", responsible: "全国联络中心接线员 / 网厅运营专员 / 营业厅前台", systemOps: "① CRM系统自动建单 → ② 诉求分类标记（维修/安检/通气/投诉） → ③ 关联用户档案调取历史记录 → ④ 生成工单编号并短信通知用户", deadline: "即时生成，平均3分钟内完成建单" },
  { step: 2, title: "工单派发", description: "服务运营监督组审核工单信息完整性，检查用户地址、联系方式、问题描述是否齐全。根据服务类型和地理位置，匹配最近的服务站或网格员。派发前需确认网格员当日负荷，避免超负荷派单。", responsible: "服务运营监督班长 / 服务站站长 / 网格长", systemOps: "① CRM派单至服务站 → ② 服务站匹配最近网格员（按GPS距离+技能标签） → ③ 网格员移动端接收工单提醒 → ④ 系统自动发送预约短信给用户", deadline: "普通工单24小时内派发，抢险工单即时派发" },
  { step: 3, title: "上门服务", description: "网格员按约定时间上门，提前30分钟致电用户确认。到达后出示工作证，穿戴鞋套进入。执行标准化作业流程，全程使用手持终端记录，关键节点拍照上传CRM。", responsible: "网格员（开通维修岗 / 安检员） / 安全技术员（复杂作业）", systemOps: "① 手持终端签到（GPS定位） → ② 作业执行（按标准SOP） → ③ 关键节点拍照上传（至少8张） → ④ 用户电子签名确认 → ⑤ 离场关阀检查", deadline: "安检：预约后3日内上门 / 维修：24h内上门 / 抢险：30分钟内到场" },
  { step: 4, title: "隐患处理", description: "发现隐患按三级分级标准处理。一级隐患（重大）如漏气、直通表，立即关阀或停气，30分钟内上报调度中心。二级隐患（一般）如软管老化，现场签发整改通知单，用户签字确认。三级隐患（轻微）现场口头告知并发放宣传资料。", responsible: "网格员 / 安全技术员（技术判定） / 安检网格长（审核）", systemOps: "① 隐患分级判定 → ② 一级隐患：CRM标记红色紧急+自动上报 → ③ 二级隐患：生成整改通知单+跟踪记录 → ④ 三级隐患：拍照留痕+下次安检关注 → ⑤ 复查确认闭环", deadline: "一级：1-7日内整改完毕 / 二级：30日内整改完毕 / 三级：建议30日内改善" },
  { step: 5, title: "服务回访", description: "服务完成后系统自动触发短信回访，询问用户满意度（1-5分）。不满意工单（评分≤3分）自动转入二次跟踪队列，由服务运营监督组人工回访了解具体问题。所有回访记录存档备查。", responsible: "服务运营监督组 / 系统自动触发短信", systemOps: "① 服务完成标记后自动触发短信回访 → ② 满意度统计（1-5分） → ③ 差评（≤3分）自动标记红色预警 → ④ 人工二次回访 → ⑤ 归档生成服务质量周报", deadline: "短信回访：服务完成后即时发送 / 人工二次回访：48小时内" },
];

const expertTips = [
  { id: 1, scene: "老旧小区户内管道锈蚀判定", trick: "用硬币轻刮锈蚀表面，若锈层脱落露出金属光泽为'中度锈蚀'；若刮后呈坑洼状且管壁变薄为'严重锈蚀'，需立即建议用户更换。切勿仅凭外观判断。", regulation: "《隐患管理制度》表5 锈蚀等级3-4级标准", risk: "误判为轻微锈蚀可能导致后期漏气事故，造成人身伤亡。锈蚀判定错误属于严重工作失误。" },
  { id: 2, scene: "用户不在家时的安检处理", trick: "粘贴《到访不遇告知单》后拍照上传CRM（含门牌号、告知单张贴位置），同时在门口张贴安全用气宣传单。下次安检时此类用户优先安排，提前电话确认。", regulation: "《安检管理制度》第三章第2条：到访不遇处理规范", risk: "未留痕可能导致安检入户率统计失真，外包结算产生争议。用户后续投诉未通知到门，公司需承担举证责任。" },
  { id: 3, scene: "CRM系统卡顿时的工单处理", trick: "手机端APP可离线缓存最近30条工单数据，网络恢复后自动同步。若抢修工单无法及时录入，可先电话直报调度中心（3102277），调度中心代为补录，网格员返岗后24小时内补全系统记录。", regulation: "《管理制度》第六章 信息系统管理第12条：系统故障应急处理", risk: "离线操作须当日补录，超期未补录按工单缺失考核（50元/次）。抢险工单未录入导致事故追溯困难，责任由网格员承担。" },
];

export default function WorkFlowSection() {

  return (
    <div className="space-y-6">
        
        <AccordionGroup className="space-y-3">
          {workSteps.map((step) => (
            <AccordionItem key={step.step} id={`step-${step.step}`} title={`Step ${step.step}：${step.title}`} summary={step.deadline} icon={<Cpu className="w-5 h-5" />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="dark-card bg-[var(--card-inner-bg)] rounded-lg p-3">
                  <h4 className="text-[var(--accent)] text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> 步骤说明</h4>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.description}</p>
                </div>
                <div className="dark-card bg-[var(--card-inner-bg)] rounded-lg p-3">
                  <h4 className="text-[var(--accent)] text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> 责任岗位</h4>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.responsible}</p>
                </div>
                <div className="dark-card bg-[var(--card-inner-bg)] rounded-lg p-3">
                  <h4 className="text-[var(--accent)] text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5"><Monitor className="w-3.5 h-3.5" /> 系统操作要点</h4>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.systemOps}</p>
                </div>
                <div className="dark-card bg-[var(--card-inner-bg)] rounded-lg p-3">
                  <h4 className="text-[#E31837] text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 时限要求</h4>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.deadline}</p>
                </div>
              </div>
              <p className="text-white text-[10px] mt-3">来源：《客户服务部管理制度》V2.0 第三章 工单管理制度 第{step.step}条</p>
            </AccordionItem>
          ))}

          <AccordionItem id="expert-tips" title="专家经验（老师傅传帮带）" summary={`${expertTips.length}条实操经验 · 场景+土办法+制度依据+风险提示`} icon={<Lightbulb className="w-5 h-5" />}>
            <div className="space-y-3">
              {expertTips.map(tip => (
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
