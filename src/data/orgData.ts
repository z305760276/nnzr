// 南宁中燃客户服务部真实数据 - 来源：实际管理制度文件

export interface OrgPosition {
  id: string;
  title: string;
  category: string;
  responsibilities: string[];
  safetyDuties: string[];
  aiEnabled: boolean;
}

export interface HazardLevel {
  level: number;
  name: string;
  color: string;
  description: string;
  examples: string[];
  fixDeadline: string;
}

export interface SafetyCheckItem {
  category: string;
  items: string[];
}

export interface KPIData {
  name: string;
  value: string;
  target: string;
  unit: string;
}

export interface WorkFlow {
  step: number;
  title: string;
  description: string;
  duration: string;
}

// 组织架构岗位数据（来自附件1）
export const orgPositions: OrgPosition[] = [
  {
    id: "manager",
    title: "客户服务经理",
    category: "部门负责人",
    responsibilities: [
      "持续建立健全部门管理制度、人员配置、班组建设",
      "设立服务目标、抄收目标和安全管理目标",
      "建设部门培训体系，组织入职、转岗、专项培训",
      "负责抄表收费、户内安装、维修、改造、安检、增值业务规范化管理",
      "贯彻落实集团数智化转型战略，落地智能客服等创新服务",
      "组织服务质量检查和测评，不断优化服务体系"
    ],
    safetyDuties: [
      "本部门安全第一责任人",
      "贯彻安全法规，落实\"五同时\"",
      "健全管理体系，逐级分解责任",
      "定期组织全员安全教育",
      "编制突发事故抢险预案"
    ],
    aiEnabled: true
  },
  {
    id: "manager_station",
    title: "客户服务经理（服务站）",
    category: "分管领导",
    responsibilities: [
      "分管居民开通维修、增值业务",
      "完成燃气销售量、销售额、抄表到位率、气费回收率等指标",
      "负责组织居民用户开通点火、维修、置换、改装",
      "负责完善表具、材料等二级仓管理",
      "协助推动 AI 数智化服务落地，通过 AI 精准画像开展精准营销"
    ],
    safetyDuties: [
      "严格执行国家及公司安全规定",
      "每月不定期检查，排查隐患",
      "审批一级动火作业",
      "组织危险源辨识与评估"
    ],
    aiEnabled: true
  },
  {
    id: "manager_inspection",
    title: "客户服务经理（安检隐患）",
    category: "分管领导",
    responsibilities: [
      "分管居民安检、隐患管理",
      "负责组织与优化居民安检、隐患整改、安全宣传",
      "协助推动 AI 数智化服务落地",
      "利用 AI 进行安检质量审核，督促隐患整改"
    ],
    safetyDuties: [
      "组织用户安全用气宣传",
      "监督动火、置换、开通等作业",
      "确保试压、检漏及用户安检率100%"
    ],
    aiEnabled: true
  },
  {
    id: "station_chief",
    title: "客户服务管理岗（服务站站长）",
    category: "管理岗",
    responsibilities: [
      "制定班组工作计划与业务流程",
      "负责服务站全面管理，落实安全管理、计量管理、维修管理",
      "组织服务站内工单派发、信息录入",
      "完成质量指标、效率指标、效益指标",
      "协助推动 AI 数智化服务落地，开展智能化练兵"
    ],
    safetyDuties: [
      "建立并落实安全风险分级管控和隐患排查治理双重预防机制",
      "对高危作业会审或批准作业方案",
      "组织管辖范围内事故的抢修抢险"
    ],
    aiEnabled: true
  },
  {
    id: "grid_leader",
    title: "网格管理岗（网格长）",
    category: "执行岗",
    responsibilities: [
      "居民维修网格长：负责开通点火、维修、户内抢修任务分派",
      "居民安检网格长：负责安检计划管理，监督抽查安检员",
      "工商业抄收网格长：负责抄表任务分派，气费催收",
      "汇总分析数据，按时完成日周月报表",
      "安排重点用户的上门服务"
    ],
    safetyDuties: [
      "本班组安全第一责任人",
      "对新员工进行三级安全教育",
      "发现隐患及时上报"
    ],
    aiEnabled: false
  },
  {
    id: "ai_specialist",
    title: "客服AI数智化岗（数字化专员）",
    category: "技术岗",
    responsibilities: [
      "负责策划部门信息化方案及管理制度",
      "负责协助集团信息化项目的跟进推广",
      "负责部门需求调研、评估并出具开发可行性建议",
      "负责新增功能、新上线信息设备测试",
      "协助部门梳理关键业务数据，制定数据规范",
      "研究并推行 AI 智能客服及线上服务系统部署与优化"
    ],
    safetyDuties: [
      "保护用户隐私，防止用户信息泄露",
      "禁止非工作需要查询用户信息",
      "定期清理离职人员账号，确保账号安全"
    ],
    aiEnabled: true
  },
  {
    id: "inspector",
    title: "稽查员（安全稽查员/安全管理员）",
    category: "稽查岗",
    responsibilities: [
      "负责部门对内稽查及对外稽查管理",
      "依法监督检查违反燃气法律法规行为",
      "建立稽查检查制度，采用常规检查、抽查等",
      "利用 AI 工具自动分析用气异常数据",
      "精准捕捉偷盗气用户及各类违规违章行为"
    ],
    safetyDuties: [
      "检查本班组的安全生产状况",
      "及时排查事故隐患，制止三违行为",
      "督促落实整改措施"
    ],
    aiEnabled: true
  },
  {
    id: "grid_worker",
    title: "网格员（开通维修岗）",
    category: "一线岗",
    responsibilities: [
      "负责居民用户的置换、通气点火工作",
      "提供户内燃气管道设施的改装、维护、维修",
      "执行安全动火作业",
      "参与紧急情况的抢险抢修",
      "开展用气安全宣传及安全产品推广"
    ],
    safetyDuties: [
      "对本岗位内的安全生产负直接责任",
      "严格按照操作规程执行",
      "积极参加各种安全活动"
    ],
    aiEnabled: false
  },
  {
    id: "info_warehouse",
    title: "客服支持岗（信息仓储员）",
    category: "支持岗",
    responsibilities: [
      "负责服务站仓储管理，库存台账、出入库台账",
      "负责服务站系统各类工单归档管理",
      "负责服务站计件工资、绩效核算",
      "定期检查服务站应急物资品类、数量及有效期"
    ],
    safetyDuties: [
      "规范库房安全管理",
      "负责仓库防火、防盗、安全用电",
      "掌握消防四会技能"
    ],
    aiEnabled: false
  },
  {
    id: "net_hall",
    title: "客服支持岗（网厅运营专员）",
    category: "运营岗",
    responsibilities: [
      "负责掌上营业厅人工接待",
      "负责电子平台自助预约、信息审核与处理",
      "负责线上电子发票开具",
      "开展电话营销工作，增值产品营销外呼"
    ],
    safetyDuties: [
      "保护用户隐私，防止信息泄露",
      "用户报警工单及时转派"
    ],
    aiEnabled: false
  }
];

// 隐患分级数据（来自附件4）
export const hazardLevels: HazardLevel[] = [
  {
    level: 1,
    name: "一级隐患（重大）",
    color: "#EF4444",
    description: "危害和整改难度较大，需要全部或局部停止供气，经过一定时间整改治理方能排除的隐患",
    examples: [
      "漏气、多种气源混用",
      "户内管道生锈严重/私改/私接",
      "燃气表直通表/反装/偷盗气",
      "灶具无熄火保护装置",
      "热水器直排式/无烟道/烟道松脱",
      "连接软管穿卧室客厅/穿浴室"
    ],
    fixDeadline: "1-7日"
  },
  {
    level: 2,
    name: "二级隐患（一般）",
    color: "#F59E0B",
    description: "危害和整改难度较小，发现后能够限期整改排除的隐患",
    examples: [
      "户内管道经客厅/密闭空间",
      "燃气表高温/临近可燃物",
      "灶具/灶前阀超期使用",
      "连接软管非专用/超期/老化",
      "报警器安装不规范",
      "开放式厨房/暗厨房"
    ],
    fixDeadline: "30日"
  },
  {
    level: 3,
    name: "三级隐患（轻微）",
    color: "#3B82F6",
    description: "未有实时危险，向用户进行现场安全宣传，提出改善建议",
    examples: [
      "管道轻微生锈/中度生锈",
      "灶具安装不规范（相邻电器）",
      "灶具故障（火盖变形/燃烧不良）",
      "热水器安装不规范（无烟帽）",
      "燃气管道与电气设备安全间距不足"
    ],
    fixDeadline: "30日"
  }
];

// 安检检查内容（来自附件3）
export const safetyCheckItems: SafetyCheckItem[] = [
  {
    category: "用气环境",
    items: [
      "燃气设施周围无易燃易爆物",
      "不存在双火源和双气源",
      "厨房类型（非开放式/非暗式）",
      "燃气引入管不得设置在卫生间内"
    ]
  },
  {
    category: "室内燃气管道",
    items: [
      "管道不存在私改、私接、腐蚀锈蚀",
      "不存在暗埋暗封、搭挂重物",
      "安全间距符合GB50028要求",
      "引入管防腐措施符合要求"
    ]
  },
  {
    category: "燃气表具",
    items: [
      "外观状况良好（无损坏、非法挂载）",
      "通风情况良好，便于操作维修",
      "表具及表前阀安装位置无暗封",
      "燃气表编号清晰可识别"
    ]
  },
  {
    category: "用气设备",
    items: [
      "灶具有熄火保护装置",
      "热水器烟道安装正确且未破损",
      "禁止使用国家明令淘汰的热水器",
      "灶具与墙面净距不小于10cm"
    ]
  },
  {
    category: "安全装置",
    items: [
      "探测器安装位置正确",
      "自闭阀功能正常",
      "连接管使用不锈钢波纹管",
      "报警器在有效期内"
    ]
  },
  {
    category: "气密性检测",
    items: [
      "手持检漏仪检测各接口",
      "U型压力计气密性检测",
      "检测室内管道是否漏气",
      "检测用气设备各接口"
    ]
  }
];

// KPI数据
export const kpiData: KPIData[] = [
  { name: "安检入户率", value: "72", target: "≥72%", unit: "%" },
  { name: "抄表到位率", value: "100", target: "100%", unit: "%" },
  { name: "隐患整改率", value: "100", target: "100%", unit: "%" },
  { name: "气费回收率", value: "95", target: "≥95%", unit: "%" },
  { name: "维修及时率", value: "98", target: "≥98%", unit: "%" },
  { name: "客户满意率", value: "90", target: "≥90%", unit: "%" }
];

// 工单处理时限（来自附件2）
export const workFlowSteps: WorkFlow[] = [
  {
    step: 1,
    title: "工单发起",
    description: "用户通过95007热线、微信公众号、营业厅等渠道提交服务请求，系统自动生成CRM工单",
    duration: "即时"
  },
  {
    step: 2,
    title: "工单派发",
    description: "服务运营监督组审核工单信息，根据服务类型和地理位置派发至对应服务站或网格员",
    duration: "24小时"
  },
  {
    step: 3,
    title: "上门服务",
    description: "网格员按约定时间上门，执行标准化作业流程（安检/维修/通气点火），全程CRM记录",
    duration: "按服务类型"
  },
  {
    step: 4,
    title: "隐患处理",
    description: "发现隐患按分级标准处理：一级隐患立即处理，二三级隐患签发整改通知单并跟踪",
    duration: "1-30日"
  },
  {
    step: 5,
    title: "服务回访",
    description: "服务完成后系统自动触发短信回访，服务运营监督组对不满意工单进行二次跟踪",
    duration: "48小时"
  }
];

// 制度体系（含详细条款）
export const systemModules = [
  {
    name: "服务总则",
    desc: "客户服务承诺、工单处理时限标准",
    clauses: [
      { title: "稳定供气承诺", content: "保证连续供气，每年连续供气时间比率超过98%。计划内停气提前48小时通知客户（紧急事故除外），计划内停气24小时内恢复供气。" },
      { title: "预约服务承诺", content: "户内安装预约后5天内上门服务；通气点火办结手续后3天内完成；非紧急维修接报后24小时处置。" },
      { title: "紧急抢险承诺", content: "抢险热线3102277，24小时专人接听。紧急抢险30分钟内到达现场（偏远地区40分钟）。入户安全检查每年提供2次。" },
    ],
    source: "《客户服务部管理制度》V2.0 第一章第1-3条"
  },
  {
    name: "服务礼仪规范",
    desc: "上门服务礼仪、窗口服务礼仪",
    clauses: [
      { title: "上门服务礼仪", content: "统一着装、佩戴工牌、预约确认后准时上门。入户前穿戴鞋套，作业完毕清理现场。" },
      { title: "窗口服务礼仪", content: "营业厅服务做到来有迎声、问有答声、走有送声。业务办理限时办结。" },
      { title: "电话服务规范", content: "接听95007热线三声内接听，使用规范服务用语，准确记录用户信息及诉求。" },
    ],
    source: "《客户服务部管理制度》V2.0 第二章"
  },
  {
    name: "信息系统管理",
    desc: "CRM系统规范、账号权限管理",
    clauses: [
      { title: "CRM账号管理", content: "一人一号，禁止共用账号。离职人员账号24小时内完成冻结清理。新员工账号开通须经站长审批。" },
      { title: "数据安全管理", content: "禁止非工作需要查询用户信息，禁止私自拷贝导出用户数据。敏感操作需二次认证。" },
      { title: "系统故障上报", content: "CRM系统故障30分钟内上报数字化专员，紧急故障直接联系集团IT运维。" },
    ],
    source: "《客户服务部管理制度》V2.0 第六章"
  },
  {
    name: "工单管理制度",
    desc: "工单发起、派发、归档流程",
    clauses: [
      { title: "工单发起", content: "用户诉求通过95007、微信公众号、营业厅等渠道录入，CRM自动建单。" },
      { title: "工单派发", content: "服务运营监督组审核后24小时内派发至对应服务站。抢险工单即时派发。" },
      { title: "工单归档", content: "服务完成后48小时内完成回访，用户确认满意后归档。不满意工单二次跟踪。" },
    ],
    source: "《客户服务部管理制度》V2.0 第三章"
  },
  {
    name: "通气点火管理",
    desc: "通气点火前置条件、作业要求",
    clauses: [
      { title: "前置条件", content: "工程竣工验收合格、用户已签订合同并缴费、燃气设施安装符合设计规范。" },
      { title: "作业流程", content: "气密性检测 → 逐户通气 → 点火试烧 → 安全用气告知 → 用户签字确认。" },
      { title: "安全要求", content: "通气作业须两人以上同行，携带检漏仪和灭火器。发现漏气立即停止通气。" },
    ],
    source: "《客户服务部管理制度》V2.0 第五章"
  },
  {
    name: "抄收管理制度",
    desc: "非居民/居民抄收、物联网表管理",
    clauses: [
      { title: "抄表周期", content: "居民用户双月抄表，工商业用户按月抄表，物联网表每日自动回传。" },
      { title: "抄表到位率", content: "抄表到位率必须达到100%，未抄到户的须注明原因并二次上门。" },
      { title: "气费催收", content: "欠费用户短信提醒后3日内未缴费的，启动电话催收。工商业大额欠费上门送达催缴通知。" },
    ],
    source: "《客户服务部管理制度》V2.0 第四章"
  },
  {
    name: "安检管理制度",
    desc: "安检流程、检查内容、隐患分级",
    clauses: [
      { title: "安检频次", content: "居民用户每年不少于2次入户安检，非居民用户每半年不少于2次。" },
      { title: "检查内容", content: "用气环境、室内管道、燃气表具、用气设备、安全装置、气密性检测六大类。" },
      { title: "拍照要求", content: "每户安检至少拍摄8张照片，含用气环境全景、各用气点、检漏仪读数、燃气表、隐患部位、安全宣传记录。" },
    ],
    source: "《客户服务部安检管理制度》V2.0"
  },
  {
    name: "户内维抢修管理",
    desc: "应急调度、户内抢修处置方案",
    clauses: [
      { title: "应急响应", content: "用户报修漏气等紧急情况，30分钟内到达现场。调度中心24小时值守。" },
      { title: "抢修流程", content: "现场关阀止漏 → 疏散人员 → 通风 → 查找漏点 → 修复 → 复检 → 恢复供气。" },
      { title: "安全监护", content: "抢修作业须设专人监护，动火作业须办理动火票，配备灭火器材。" },
    ],
    source: "《客户服务部管理制度》V2.0 第八章"
  },
  {
    name: "稽查管理制度",
    desc: "对外稽查、对内稽查、偷盗气处置",
    clauses: [
      { title: "对外稽查", content: "依法查处私拉乱接、偷盗燃气、破坏燃气设施等违法违规行为，维护公司合法权益。" },
      { title: "对内稽查", content: "检查员工和外包单位是否严格执行管理规定和操作规范，查处违规行为。" },
      { title: "气量异常稽查", content: "利用AI工具分析用气异常数据，精准捕捉偷盗气用户。" },
    ],
    source: "《客户服务部管理制度》V2.0 第九章"
  },
  {
    name: "隐患管理制度",
    desc: "隐患分级、排查要求、整改标准",
    clauses: [
      { title: "隐患分级", content: "一级（重大）：需停气整改；二级（一般）：30日内整改；三级（轻微）：建议改善。" },
      { title: "排查要求", content: "安检员每次入户必须按检查表逐项排查，发现隐患立即记录并分级。" },
      { title: "整改跟踪", content: "一级隐患1-7日整改，二级30日整改。CRM系统建立跟踪记录，复查确认闭环。" },
    ],
    source: "《客户服务部隐患管理制度》V2.0"
  },
  {
    name: "安全类管理",
    desc: "安全风险管理、应急演练、安全宣传",
    clauses: [
      { title: "安全风险管理", content: "建立安全风险分级管控和隐患排查治理双重预防机制，每季度更新风险清单。" },
      { title: "应急演练", content: "每年至少组织2次综合应急演练，覆盖户内漏气、火灾、爆炸等场景。" },
      { title: "安全宣传", content: "每年不少于2次社区安全宣传活动，发放宣传资料，普及安全用气知识。" },
    ],
    source: "《客户服务部管理制度》V2.0 第十章"
  },
  {
    name: "综合类管理",
    desc: "台账、培训、档案、车辆、仓库管理",
    clauses: [
      { title: "培训管理", content: "新员工三级安全教育，在岗人员每年不少于48课时培训。特种作业人员持证上岗。" },
      { title: "档案管理", content: "用户档案、工单档案、安检档案分类归档保存期限不少于3年。" },
      { title: "仓库管理", content: "服务站仓库实行分类分区管理，定期检查应急物资有效期，及时补充更换。" },
    ],
    source: "《客户服务部管理制度》V2.0 第十一章"
  }
];

// 考核标准
export const penaltyStandards = [
  { violation: "隐患排查不到位", penalty: "50元/次", level: "一般" },
  { violation: "隐患整改弄虚作假", penalty: "100元/次", level: "严重" },
  { violation: "拒不配合安全检查", penalty: "100元/次", level: "严重" },
  { violation: "隐患治理不及时", penalty: "50元/次", level: "一般" },
  { violation: "安检照片缺失/造假", penalty: "按负面清单记分", level: "严重" },
  { violation: "工单超期未处理", penalty: "按绩效扣罚", level: "一般" }
];
