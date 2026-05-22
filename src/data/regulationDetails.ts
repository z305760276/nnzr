// ============================================
// 南宁中燃客户服务部 制度条款详细内容
// 来源：《客户服务部管理制度》V2.0 + 《安检管理制度》+ 《隐患管理制度》
// ============================================

export interface RegulationClause {
  chapter: string;
  articles: {
    title: string;
    content: string[];
  }[];
}

export const serviceCommitment: RegulationClause = {
  chapter: "第一章 客户服务承诺",
  articles: [
    {
      title: "稳定供气",
      content: [
        "保证连续供气，每年连续供气的时间比率超过98%",
        "计划内停气提前48小时通知客户（紧急事故除外）",
        "计划内停气必须24小时内恢复供气（紧急事故除外）"
      ]
    },
    {
      title: "预约服务",
      content: [
        "户内安装：具备受理条件的，预约后5天内上门服务",
        "通气点火：具备安全通气条件并办结相关手续的客户，在3天内完成",
        "户内故障维修：非紧急事故维修的，接报后24小时之内处置"
      ]
    },
    {
      title: "紧急抢险",
      content: [
        "抢险热线3102277，24小时专人接听",
        "紧急抢险服务30分钟内到达现场（偏远地区40分钟）",
        "入户安全检查每1年提供2次服务"
      ]
    }
  ]
};

export const workOrderDeadlines = [
  { type: "点火工单-零星用户", dispatch: "24h", process: "48h", total: "72h" },
  { type: "点火工单-工商福用户", dispatch: "12h", process: "48h", total: "72h" },
  { type: "维修工单-燃烧异常", dispatch: "12h", process: "24h", total: "36h" },
  { type: "维修工单-无火维修", dispatch: "12h", process: "24h", total: "36h" },
  { type: "换表工单-故障换表", dispatch: "12h", process: "48h", total: "72h" },
  { type: "改装工单-户内改装", dispatch: "24h", process: "96h", total: "120h" },
  { type: "抢险工单-户内漏气", dispatch: "即时", process: "0.5h", total: "即时" },
  { type: "抢险工单-户外漏气", dispatch: "即时", process: "视情况", total: "即时" }
];

export const inspectionSystem: RegulationClause = {
  chapter: "安检管理制度",
  articles: [
    {
      title: "安检周期与频次",
      content: [
        "居民燃气用户：每年不少于2次燃气设施安全检查",
        "非居民燃气用户：每半年不少于2次燃气设施安全检查",
        "安检员配置标准：6500户配置1人（一年2检）",
        "非居用户：2000块计量表/人的标准配置专职安检人员"
      ]
    },
    {
      title: "安检工具配置",
      content: [
        "U型压力计、PPM级泵吸式可燃气体检漏仪",
        "三通、钳、螺丝刀、扳手、垫布、抹布及工具袋",
        "常用物料：波纹管、报警器、充值宝等",
        "工作证、安检工作单、隐患整改通知单、安检贴、到访不遇告知单"
      ]
    },
    {
      title: "入户安检拍照要求（至少8张）",
      content: [
        "用气环境全景：涵盖燃气表位置至用气设备处",
        "每个用气点各一张：包含用气设备、连接软管及阀门",
        "检漏仪读数清晰可见照片不少于一张",
        "灶具连接管与灶具进气接头连接处必须拍检漏检测照片",
        "燃气表两张：远景含表前表后管，近景含编号及机械字轮数",
        "隐患部位照片：能清晰识别隐患内容",
        "安全宣传记录照片：发放资料、用气警示贴、隐患整改通知单"
      ]
    },
    {
      title: "安检实施方式",
      content: [
        "计划性检查：提前3天发布安检通知，告知物业及用户",
        "坚持\"入户必安检\"原则",
        "手持检漏仪检测各接口部位",
        "U型压力计对燃气管道及用气设备进行气密性检测"
      ]
    }
  ]
};

// 隐患整改标准对照表（来自隐患管理制度表7）
export interface HazardFixStandard {
  item: string;
  hazardContent: string;
  fixStandard: string;
  level: number;
}

export const hazardFixStandards: HazardFixStandard[] = [
  { item: "燃气表", hazardContent: "漏气", fixStandard: "更换燃气表", level: 1 },
  { item: "燃气表", hazardContent: "严重锈蚀", fixStandard: "截气或拆除", level: 1 },
  { item: "立管（表前管）", hazardContent: "漏气", fixStandard: "更换燃气表", level: 1 },
  { item: "立管（表前管）", hazardContent: "严重锈蚀", fixStandard: "截气或拆除", level: 1 },
  { item: "热水器", hazardContent: "直排式", fixStandard: "更换新的零配件（或符合安全要求的新燃具）", level: 1 },
  { item: "热水器", hazardContent: "漏气", fixStandard: "截气或拆除热水器", level: 1 },
  { item: "灶具、其他燃烧器", hazardContent: "漏气", fixStandard: "更换新的零配件（或符合安全要求的新燃具）", level: 1 },
  { item: "立管（表后管）", hazardContent: "漏气", fixStandard: "即时维修", level: 1 },
  { item: "立管（表后管）", hazardContent: "严重锈蚀", fixStandard: "更换管道", level: 1 },
  { item: "表前阀", hazardContent: "漏气", fixStandard: "即时修妥/更换表前阀，截气", level: 1 },
  { item: "灶前阀", hazardContent: "漏气", fixStandard: "即时修妥/更换灶前阀，截气", level: 1 },
  { item: "胶管", hazardContent: "漏气", fixStandard: "更换为软管（推荐使用不锈钢波纹管）", level: 1 },
  { item: "胶管", hazardContent: "窃气", fixStandard: "截气", level: 1 },
  { item: "其他", hazardContent: "私拉乱接", fixStandard: "重新设计安装，截气", level: 1 },
  { item: "烟管", hazardContent: "漏气", fixStandard: "修补、换新烟管或加装配件", level: 2 },
  { item: "燃气表", hazardContent: "显示异常（液晶不显示/显示错误）", fixStandard: "更换燃气表", level: 2 },
  { item: "燃气表", hazardContent: "表前阀/调压箱/表箱生锈严重", fixStandard: "更换或防腐处理", level: 2 },
  { item: "灶具", hazardContent: "无熄火保护装置", fixStandard: "更换灶具", level: 1 },
  { item: "连接软管", hazardContent: "非专用/超期/老化", fixStandard: "更换为不锈钢波纹管", level: 2 },
  { item: "报警器", hazardContent: "未安装/安装未启用", fixStandard: "安装或启用报警器", level: 1 }
];

// 管道锈蚀等级标准
export const rustLevels = [
  { level: 1, name: "正常", desc: "燃气管无锈蚀", action: "无需跟进" },
  { level: 2, name: "轻微生锈", desc: "燃气管锈蚀至呈黄色锈渍，镀锌管表层轻微脱落", action: "保持监察，待下次检查周期检测" },
  { level: 3, name: "中度生锈", desc: "燃气管锈蚀至呈现咖啡色，镀锌管表层部分脱落，管身开始起泡", action: "建议用户更换" },
  { level: 4, name: "严重生锈", desc: "燃气管锈蚀至呈现深咖啡色，部分表层出现龟裂及脱落，但没漏气", action: "建议用户尽快更换" },
  { level: 5, name: "极严重生锈", desc: "燃气管锈蚀至呈现深咖啡色，大部分表层出现龟裂及脱落，但没漏气", action: "停气通知，建议用户尽快更换" },
  { level: 6, name: "漏气", desc: "已发生燃气泄漏", action: "实时止漏后尽快上报户内抢修人员" }
];

// 培训认证要求
export const trainingRequirements = [
  {
    category: "安检人员培训",
    requirements: [
      "燃气基本知识",
      "用户燃气设施的功能、要求和燃气输配流程",
      "计量表结构和运行原理",
      "软管、灶具、报警器的质量标准、使用年限和安装要求",
      "用户燃气设施安全管理的基本要求",
      "燃气设施检漏和维护的基本技能",
      "燃气灶不应加装聚能环、防风罩等非原厂设计的配件"
    ],
    hours: "全年不少于48课时/人",
    certification: "需通过政府认可的资质证+中燃集团培训考核认证"
  },
  {
    category: "网格员培训",
    requirements: [
      "三级安全教育",
      "岗位安全操作规程",
      "应急处置技能",
      "消防器材使用"
    ],
    hours: "岗前培训+年度复训",
    certification: "持证上岗"
  }
];

// 安全检查标准（稽查）
export const inspectionAuditStandards = [
  { item: "线上稽查", frequency: "不低于当月安检计划数的2%", scope: "在岗人员全覆盖" },
  { item: "线下稽查", frequency: "每月完成10%人次现场作业检查", scope: "年度完成在岗人员100%全覆盖" },
  { item: "CRM系统审核", frequency: "100%比例线上审核", scope: "重点审核有无图片、图片真实性、工单完整性" },
  { item: "业务工单稽查", frequency: "不低于当月系统记录1%", scope: "业务工单" }
];
