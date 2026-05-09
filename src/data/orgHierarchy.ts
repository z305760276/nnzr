// ============================================
// 南宁中燃客户服务部 完整组织架构层级数据
// 来源：《客户服务部管理组织架构及岗位职责》V2.0
// 包含4级层级：经理 → 主管 → 班长/专员 → 执行岗
// ============================================

export interface OrgNode {
  id: string;
  title: string;
  level: number; // 1=经理, 2=主管/站长, 3=班长/专员, 4=执行岗
  category: string;
  parentId: string | null;
  responsibilities: string[];
  safetyDuties: string[];
  aiEnabled: boolean;
  staffCount?: number;
  keyMetrics?: string[];
  reportsTo?: string;
  manages?: string[];
}

export const orgHierarchy: OrgNode[] = [
  // ===== LEVEL 1: 部门负责人 =====
  {
    id: "manager",
    title: "客户服务经理",
    level: 1,
    category: "部门负责人",
    parentId: null,
    responsibilities: [
      "持续建立健全部门管理制度、人员配置、班组建设、各业务组目标考核管理",
      "设立服务目标、抄收目标和安全管理目标，建立服务质量与安全管理监督体系",
      "建设部门培训体系，组织入职、转岗、专项培训与持证上岗管理",
      "负责对抄表收费、户内安装、维修、改造、安检、增值等业务进行规范化管理",
      "贯彻落实集团数智化转型战略，加快推进人工智能技术应用，落地智能客服等创新服务",
      "组织服务质量检查和测评，不断优化服务体系，提高用户满意度",
      "负责客户服务部与其他部门、外包业务的沟通协调"
    ],
    safetyDuties: [
      "本部门安全第一责任人，对本部门的安全生产和员工劳动保护负全面责任",
      "贯彻安全法规，落实\"五同时\"（计划、布置、检查、总结、评比安全工作）",
      "健全管理体系，优化安全资源配置，完善部门安全生产管理系统",
      "定期组织全员安全、防火教育，落实新员工/换岗人员三级安全教育及考核",
      "编制突发事故抢险预案，按HSE要求组织应急演练"
    ],
    aiEnabled: true,
    staffCount: 68,
    keyMetrics: ["用户事故0", "安检到位率100%", "安检入户率≥72%", "一级隐患整改率100%"]
  },

  // ===== LEVEL 2: 分管领导（副经理级） =====
  {
    id: "mgr_station",
    title: "客户服务经理（服务站/综合模块）",
    level: 2,
    category: "分管领导",
    parentId: "manager",
    responsibilities: [
      "分管居民开通维修、增值业务/安检隐患/非居民抄收/综合业务",
      "负责分管服务站的全面管理工作，组织班组建设与团队目标管理",
      "完成燃气销售量、销售额、抄表到位率、抄表准确率、气费回收率等经营指标",
      "协助部门经理推动AI数智化服务落地，通过AI精准画像开展精准营销",
      "利用AI进行安检质量审核，督促隐患整改，提升安检入户率及隐患整改率"
    ],
    safetyDuties: [
      "严格执行国家及公司安全规定，确保责任书签订率、安全教育率、档案完整率均达100%",
      "每月不定期检查，排查隐患并监督整改",
      "审批一级动火作业，监督动火、置换、开通等作业",
      "组织危险源辨识与评估，落实重大危险源管控措施"
    ],
    aiEnabled: true,
    reportsTo: "客户服务经理",
    manages: ["服务站站长", "综合主管", "安全稽查主管"]
  },

  // ===== LEVEL 2: 主管 =====
  {
    id: "station_chief",
    title: "客户服务管理岗（服务站站长）",
    level: 2,
    category: "管理岗",
    parentId: "mgr_station",
    responsibilities: [
      "制定班组工作计划与业务流程，落实集团、公司及部门管理制度",
      "负责服务站全面管理，落实安全管理、计量管理、维修管理、经营指标和稽查管理",
      "组织服务站内工单派发、信息录入以及片区物资材料进出库管理",
      "完成质量指标（安全事故、停气事故、客户满意率）、效率指标（上门及时率、安检率等）、效益指标（用户ARPU值、网格毛利率等）",
      "协助推动AI数智化服务落地，开展智能化练兵，通过AI技术模拟实际工作场景"
    ],
    safetyDuties: [
      "建立并落实安全风险分级管控和隐患排查治理双重预防机制",
      "对高危作业会审或批准作业方案、现场签批作业票",
      "组织管辖范围内事故的抢修抢险工作，参与事故调查和处理",
      "每年组织收集业务所涉及的法律法规、技术标准规范，形成清单并进行动态管理"
    ],
    aiEnabled: true,
    reportsTo: "客户服务经理（服务站）",
    manages: ["网格长", "安全技术员"]
  },
  {
    id: "ops_supervisor",
    title: "客户服务管理岗（服务运营主管）",
    level: 2,
    category: "管理岗",
    parentId: "mgr_station",
    responsibilities: [
      "负责通过数据报表分析、监控，督办各业务部门按集团服务目标完成上门服务",
      "负责热线服务水平监督，通过应急处置、流程梳理等措施协同全国联络服务中心",
      "分析用户服务需求，查摆存在问题并制定服务提升计划",
      "负责南宁中燃微信公众号、\"中燃在线\"小程序、短信平台等线上平台统筹管理",
      "协助推动AI数智化服务落地，利用AI工具总结分析服务短板，优化服务流程"
    ],
    safetyDuties: [
      "对本班组安全工作负直接领导责任",
      "每年4月1日前组织班组人员与部门经理签订安全管理责任状",
      "每月组织一次综合性安全检查",
      "掌握灭火器等消防器材的使用"
    ],
    aiEnabled: true,
    reportsTo: "客户服务经理（综合）",
    manages: ["服务运营监督班长", "网厅运营班长"]
  },
  {
    id: "safety_supervisor",
    title: "客户服务管理岗（安全稽查主管）",
    level: 2,
    category: "管理岗",
    parentId: "mgr_station",
    responsibilities: [
      "建设部门安全管理体系和服务质量监督体系",
      "负责部门对内稽查及对外稽查管理工作",
      "对外稽查：监督检查违反燃气法律法规和规章、损坏公司合法权利的行为，打击偷盗燃气",
      "对内稽查：督促部门员工和外包业务单位严格执行各项管理规定、操作规范",
      "利用AI工具自动分析用气异常数据，精准捕捉偷盗气用户及违规违章行为"
    ],
    safetyDuties: [
      "督促落实部门业务安全风险分级管控和隐患排查治理双重预防机制",
      "组织制订部门HSE培训计划，编制安全教育培训教材并建立试题库",
      "负责落实本组新员工、转岗员工的安全教育与考核",
      "检查本班组员工岗位安全履职情况"
    ],
    aiEnabled: true,
    reportsTo: "客户服务经理（服务站）",
    manages: ["稽查班长"]
  },
  {
    id: "admin_supervisor",
    title: "客户服务管理岗（综合主管）",
    level: 2,
    category: "管理岗",
    parentId: "mgr_station",
    responsibilities: [
      "开展部门团队建设、制定员工培训及激励计划",
      "统筹部门日常各类总结、纪要撰写，审核部门各项方案",
      "负责客服部信息管理工作，推动完善CRM系统功能",
      "负责南宁中燃微信公众号、\"中燃在线\"缴费小程序统筹管理",
      "协助推动AI数智化服务落地，推行24小时AI智能客服"
    ],
    safetyDuties: [
      "督促落实客户服务人员的安全教育培训工作，确保二三级安全教育覆盖率达100%",
      "负责部门车辆、办公设备等设施安全管理工作",
      "组织并参与所管理班组全面开展风险辨识和评估工作",
      "掌握消防\"四会\"技能"
    ],
    aiEnabled: true,
    reportsTo: "客户服务经理（综合）"
  },

  // ===== LEVEL 3: 班长/专员 =====
  {
    id: "grid_leader_repair",
    title: "网格管理岗（居民维修网格长）",
    level: 3,
    category: "执行管理岗",
    parentId: "station_chief",
    responsibilities: [
      "负责用户开通点火、维修、户内抢修、改装、置换、停气、供气等工作任务分派",
      "负责班组所有员工的日常管理、考核与培训工作",
      "汇总分析维修数据与完成情况，按时完成日周月报表",
      "接收安排来自上级领导、话务中心、调度中心的消息转办",
      "安排重点用户的上门维修服务，根据应急预案对各级应急抢险工作出警组织人员抢修"
    ],
    safetyDuties: [
      "本班组安全第一责任人，组织员工学习和贯彻上级有关安全的方针、政策和制度",
      "负责对新员工和新调入员工进行三级安全、防火教育",
      "坚持班前讲安全，班中检查安全，班后总结安全和每周安全日活动",
      "发现不安全因素及时排除并向上级报告"
    ],
    aiEnabled: false,
    reportsTo: "服务站站长",
    manages: ["网格员（开通维修岗）"]
  },
  {
    id: "grid_leader_inspect",
    title: "网格管理岗（居民安检网格长）",
    level: 3,
    category: "执行管理岗",
    parentId: "station_chief",
    responsibilities: [
      "负责所在服务站安检计划管理，监督抽查安检员日常安检的制度、流程、标准落实情况",
      "负责安检外包队伍日常、抢险等业务对接和培训帮扶",
      "负责安检指标进度跟进和监督，督导外包队伍按进度完成安检计划",
      "汇总分析安检数据，按时完成日周月报表",
      "安排重点用户的上门安检服务，应急抢险工作出警组织"
    ],
    safetyDuties: [
      "本班组安全第一责任人",
      "对新员工进行三级安全教育",
      "督促员工正确检查和使用消防和劳动保护用品"
    ],
    aiEnabled: false,
    reportsTo: "服务站站长"
  },
  {
    id: "grid_leader_commercial",
    title: "网格管理岗（工商业抄收网格长）",
    level: 3,
    category: "执行管理岗",
    parentId: "station_chief",
    responsibilities: [
      "负责制定抄表任务分派，完成维修及时率、抄表到位率、气费回款率等经营指标",
      "负责燃气费、预付气费的催收业务",
      "负责班组员工的日常管理、考核与培训",
      "汇总分析抄收数据，按时完成日周月报表",
      "安排重点用户的上门维修、安检服务"
    ],
    safetyDuties: [
      "本班组安全第一责任人",
      "对新员工进行三级安全教育",
      "检查本班组员工岗位安全履职情况"
    ],
    aiEnabled: false,
    reportsTo: "服务站站长"
  },
  {
    id: "inspector_chief",
    title: "稽查班长",
    level: 3,
    category: "稽查管理岗",
    parentId: "safety_supervisor",
    responsibilities: [
      "落实组织部门监督检查工作，开展对内稽查及对外稽查管理",
      "监督气量异常稽查工作执行，组织查处并打击偷盗燃气行为",
      "组织各类专项稽查，对系统气量异常数据分析跟踪整改",
      "负责汇总和填写提报班组各类周报、月报数据",
      "每月对安全责任书内容进行履职考评"
    ],
    safetyDuties: [
      "具体负责本班组安全和消防管理工作",
      "负责对本班组员工和新调入员工的三级安全、消防教育",
      "检查本班组的安全生产状况，及时排查事故隐患",
      "组织或参与公司、部门的应急救援演练、消防演练"
    ],
    aiEnabled: true,
    reportsTo: "安全稽查主管",
    manages: ["对外稽查员", "安全稽查员"]
  },
  {
    id: "ops_monitor_chief",
    title: "客服支持岗（服务运营监督班长）",
    level: 3,
    category: "运营班长",
    parentId: "ops_supervisor",
    responsibilities: [
      "负责服务运营监督组的日常管理与考核",
      "负责接收审核全国服务联络中心及各业务部门信息转办",
      "收集网络舆情、95007及其他服务渠道各类问题进行调查处置",
      "负责按照《服务运营应急预案》对应急事件进行处置调配",
      "负责按照服务监督周、月报的编辑及上报"
    ],
    safetyDuties: [
      "组织并参与本部门安全生产宣传教育和培训",
      "定期参与应急救援演练",
      "掌握消防\"四会\"技能",
      "保护用户隐私，防止用户信息泄露"
    ],
    aiEnabled: false,
    reportsTo: "服务运营主管"
  },
  {
    id: "net_hall_chief",
    title: "客服支持岗（网厅运营班长）",
    level: 3,
    category: "运营班长",
    parentId: "ops_supervisor",
    responsibilities: [
      "负责网厅运营专员的日常管理与考核",
      "统筹短信平台、微信平台的运营管理工作",
      "负责掌上营业厅各项功能开发与维护",
      "负责电子平台的数据统计、分析、汇报工作",
      "对接行政管理部文宣模块，组织提报新媒体平台宣传稿件"
    ],
    safetyDuties: [
      "保护用户隐私，防止用户信息泄露",
      "接到用户报警及时派发工单",
      "做好生产区域内的防火、防盗工作"
    ],
    aiEnabled: true,
    reportsTo: "服务运营主管"
  },

  // ===== LEVEL 4: 执行岗位 =====
  {
    id: "safety_tech",
    title: "安全管理岗（安全技术员）",
    level: 4,
    category: "技术岗",
    parentId: "station_chief",
    responsibilities: [
      "负责服务站工程验收、燃气设施改造、抢修抢险设计预算",
      "负责服务站所有设备台账管理，跟踪设备故障情况",
      "负责居民安检和工商抄表各项数据进行分析，对异常情况组织核查",
      "负责服务站动火证办理及审核工作",
      "收集培训需求和素材，定期组织站内人员开展技能培训及考核",
      "负责服务站安全检查，重点对办公场所、仓库及动火现场等区域开展隐患排查"
    ],
    safetyDuties: [
      "对生产场所的安全、防火做到\"三懂、三会\"",
      "监察工程全过程，保证工程及人员安全",
      "对施工现场的安全施工进行监督检查",
      "配合、协助施工质量事故、工程安全事故的调查和处理"
    ],
    aiEnabled: false,
    reportsTo: "服务站站长"
  },
  {
    id: "ai_specialist",
    title: "客服AI数智化岗（数字化专员）",
    level: 4,
    category: "技术岗",
    parentId: "admin_supervisor",
    responsibilities: [
      "负责策划部门信息化方案及管理制度的制定",
      "负责协助集团信息化项目的跟进推广、项目实施",
      "负责部门需求调研、评估并出具开发可行性建议",
      "负责新增功能、新上线信息设备测试并拟定评估报告",
      "协助部门梳理关键业务数据，明确提取办法，制定数据规范",
      "研究并推行AI智能客服及线上服务系统部署与优化",
      "负责信息系统中的人员权限用户账号开通与维护",
      "利用AI工具整合分析各类报表，提升数据处理效率"
    ],
    safetyDuties: [
      "保护用户隐私，防止用户信息泄露",
      "禁止非工作需要查询用户信息，禁止私自拷贝用户信息",
      "定期做好CRM账号开通审核及权限分配管理",
      "定期清理离职人员账号，确保账号安全"
    ],
    aiEnabled: true,
    reportsTo: "综合主管",
    keyMetrics: ["系统可用率", "需求交付率", "AI客服接通率"]
  },
  {
    id: "grid_worker_repair",
    title: "网格员（开通维修岗）",
    level: 4,
    category: "一线执行岗",
    parentId: "grid_leader_repair",
    responsibilities: [
      "负责居民用户的置换、通气点火工作，对居民用户安全用气进行指导",
      "为居民用户提供户内燃气管道设施的改装、维护、维修、封堵、安全检查等服务",
      "按制度执行安全动火作业，负责用户停气、监火、恢复供气",
      "参与紧急情况的抢险抢修工作，配合管网事故应急处置",
      "收集、核对客户信息，开展用气安全宣传及安全产品推广",
      "按制度执行抄收管理工作，完成抄表到位率、抄表准确率、气费回款率指标"
    ],
    safetyDuties: [
      "对本岗位内的安全生产负直接责任",
      "必须按照国家安全生产规范告知用户存在的安全隐患",
      "进行安全检查作业时严格按照各项操作规程执行",
      "有权拒绝违章作业的指令",
      "按抢险时限参与紧急情况的抢修工作"
    ],
    aiEnabled: false,
    reportsTo: "居民维修网格长"
  },
  {
    id: "inspector_external",
    title: "稽查员（对外稽查员）",
    level: 4,
    category: "稽查岗",
    parentId: "inspector_chief",
    responsibilities: [
      "依法、按章监督检查是否有违反国家省市有关燃气法律法规和规章的行为",
      "及时追回透支气费损失，打击偷盗燃气和私拉乱接等违章行为",
      "维护公司合法权益、堵塞管理漏洞",
      "负责稽查部门员工与上门服务外包业务人员严格执行各项管理规定",
      "利用AI工具分析用气异常数据，精准捕捉偷盗气用户"
    ],
    safetyDuties: [
      "检查本班组的安全生产状况",
      "及时排查生产安全事故隐患，制止\"三违\"行为",
      "督促落实整改措施"
    ],
    aiEnabled: true,
    reportsTo: "稽查班长"
  },
  {
    id: "warehouse_admin",
    title: "客服支持岗（信息仓储员）",
    level: 4,
    category: "支持岗",
    parentId: "station_chief",
    responsibilities: [
      "负责服务站仓储管理，库存台账、出入库台账管理",
      "负责物资的申购、领用、发放、盘点、核销",
      "负责服务站系统各类工单系统归档及管理工作",
      "负责服务站计件工资、绩效的核算与统计汇总",
      "定期检查服务站应急物资的品类、数量及有效期，及时更换和补充"
    ],
    safetyDuties: [
      "规范库房安全管理工作，确保库房及所存放物资安全",
      "负责仓库防火、防盗、安全用电工作",
      "掌握消防\"四会\"技能（会报警、会使用消防器材、会扑灭初期火灾、会疏散逃生）"
    ],
    aiEnabled: false,
    reportsTo: "服务站站长"
  }
];

// 岗位关系映射（汇报线 + 协作线）
export interface OrgRelation {
  from: string;
  to: string;
  type: 'reports' | 'collaborates' | 'manages';
}

export const orgRelations: OrgRelation[] = [
  { from: "mgr_station", to: "manager", type: "reports" },
  { from: "station_chief", to: "mgr_station", type: "reports" },
  { from: "ops_supervisor", to: "mgr_station", type: "reports" },
  { from: "safety_supervisor", to: "mgr_station", type: "reports" },
  { from: "admin_supervisor", to: "mgr_station", type: "reports" },
  { from: "grid_leader_repair", to: "station_chief", type: "reports" },
  { from: "grid_leader_inspect", to: "station_chief", type: "reports" },
  { from: "grid_leader_commercial", to: "station_chief", type: "reports" },
  { from: "inspector_chief", to: "safety_supervisor", type: "reports" },
  { from: "ops_monitor_chief", to: "ops_supervisor", type: "reports" },
  { from: "net_hall_chief", to: "ops_supervisor", type: "reports" },
  { from: "safety_tech", to: "station_chief", type: "reports" },
  { from: "ai_specialist", to: "admin_supervisor", type: "reports" },
  { from: "grid_worker_repair", to: "grid_leader_repair", type: "reports" },
  { from: "inspector_external", to: "inspector_chief", type: "reports" },
  { from: "warehouse_admin", to: "station_chief", type: "reports" },
  // 协作关系
  { from: "ai_specialist", to: "ops_supervisor", type: "collaborates" },
  { from: "safety_tech", to: "safety_supervisor", type: "collaborates" },
  { from: "inspector_chief", to: "station_chief", type: "collaborates" }
];

// 按层级分组
export function getNodesByLevel(level: number): OrgNode[] {
  return orgHierarchy.filter(n => n.level === level);
}

// 获取子节点
export function getChildren(parentId: string): OrgNode[] {
  return orgHierarchy.filter(n => n.parentId === parentId);
}

// 获取汇报线
export function getReportLine(nodeId: string): OrgNode[] {
  const line: OrgNode[] = [];
  let current = orgHierarchy.find(n => n.id === nodeId);
  while (current) {
    line.unshift(current);
    current = current.parentId ? orgHierarchy.find(n => n.id === current!.parentId) : undefined;
  }
  return line;
}
