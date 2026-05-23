// 业务能力图谱数据模型 - 南宁中燃客户服务部业务网络
// 关联数据：orgHierarchy（岗位）、orgData/kpiData（指标）、safetyScore/serviceScore（红黄线）

export type BusinessNodeType =
  | 'strategic_goal'
  | 'business_segment'
  | 'business_task'
  | 'position'
  | 'metric'
  | 'data_source';

export interface BusinessNode {
  id: string;
  type: BusinessNodeType;
  label: string;
  description?: string;
  layer: 1 | 2 | 3 | 4 | 5 | 6;
  refId?: string;
  redYellowLine?: {
    hasRedLine: boolean;
    hasYellowLine: boolean;
    relatedScoreIds?: string[];
  };
  experienceTips?: string[];
  details?: {
    owner?: string;
    frequency?: string;
    formula?: string;
    source?: string;
    relatedDocs?: string[];
  };
}

export interface BusinessRelation {
  from: string;
  to: string;
  type: 'decomposes' | 'supports' | 'measures' | 'sources_from' | 'impacts' | 'assesses';
  label?: string;
}

// ==================== L1: 战略目标节点 ====================
const strategicGoalNodes: BusinessNode[] = [
  {
    id: 'goal_safety',
    type: 'strategic_goal',
    label: '保障运营安全',
    description: '通过严格的安全管理制度、隐患排查治理和应急响应体系，确保燃气运营零事故、零伤亡',
    layer: 1,
    details: {
      owner: '客户服务部经理',
      frequency: '年度目标，季度考核',
      source: '集团安全生产责任制考核要求',
      relatedDocs: ['安全生产责任书', 'HSE管理体系文件'],
    },
  },
  {
    id: 'goal_service',
    type: 'strategic_goal',
    label: '提升服务质量',
    description: '优化服务流程、缩短响应时效、提高用户满意度，打造优质燃气服务品牌',
    layer: 1,
    details: {
      owner: '客户服务部经理',
      frequency: '年度目标，月度考核',
      source: '集团服务目标考核要求',
      relatedDocs: ['客户服务承诺', '服务礼仪规范'],
    },
  },
  {
    id: 'goal_efficiency',
    type: 'strategic_goal',
    label: '提高经营效益',
    description: '提升抄收到位率和气费回收率，控制供销差率，推动增值业务增长，实现经营指标达标',
    layer: 1,
    details: {
      owner: '客户服务部经理',
      frequency: '年度目标，月度考核',
      source: '公司年度经营计划',
      relatedDocs: ['经营指标分解方案', '绩效考核办法'],
    },
  },
  {
    id: 'goal_digital',
    type: 'strategic_goal',
    label: '推动数智化转型',
    description: '落实集团数智化战略，推进AI智能客服、智能安检、数据分析等数字化工具在客服业务中的深度应用',
    layer: 1,
    details: {
      owner: '客服AI数智化岗',
      frequency: '年度规划，季度推进',
      source: '集团数智化转型战略',
      relatedDocs: ['数智化转型实施方案', 'AI应用规划'],
    },
  },
];

// ==================== L2: 业务板块节点 ====================
const businessSegmentNodes: BusinessNode[] = [
  {
    id: 'segment_service',
    type: 'business_segment',
    label: '服务管理',
    description: '涵盖工单流转、网厅运营、营业厅服务、服务监督等全渠道客户服务管理，确保用户诉求及时响应和处理',
    layer: 2,
    details: {
      owner: '客服部副经理（综合模块）',
      frequency: '日常持续',
      relatedDocs: ['《客户服务部管理制度》V2.0 第三章', '服务礼仪规范'],
    },
  },
  {
    id: 'segment_billing',
    type: 'business_segment',
    label: '抄收管理',
    description: '负责民商用户抄表收费、气费催收、合同管理、用气分析等，保障燃气销售回款和经营指标达成',
    layer: 2,
    details: {
      owner: '客服部副经理（服务站）',
      frequency: '日常持续',
      relatedDocs: ['《客户服务部管理制度》V2.0 第四章', '抄收管理制度'],
    },
  },
  {
    id: 'segment_inspection',
    type: 'business_segment',
    label: '安检管理',
    description: '按照国家标准和集团要求，对燃气用户开展定期入户安检，排查用气安全隐患，保障用户端用气安全',
    layer: 2,
    details: {
      owner: '客服部副经理（安检隐患）',
      frequency: '年度计划，日常执行',
      relatedDocs: ['《客户服务部安检管理制度》V2.0', '安检检查标准'],
    },
  },
  {
    id: 'segment_hazard',
    type: 'business_segment',
    label: '隐患管理',
    description: '对安检发现的隐患进行分级管理、整改跟踪和复查闭环，确保隐患整改到位，消除用气安全风险',
    layer: 2,
    details: {
      owner: '客服部副经理（安检隐患）',
      frequency: '日常持续',
      relatedDocs: ['《客户服务部隐患管理制度》V2.0', '隐患分级标准'],
    },
  },
  {
    id: 'segment_audit',
    type: 'business_segment',
    label: '稽查考核',
    description: '对内稽查员工履职和操作规范，对外稽查偷盗气和违规用气，开展服务质量抽查和安全记分考核',
    layer: 2,
    details: {
      owner: '安全稽查主管',
      frequency: '日常持续',
      relatedDocs: ['《客户服务部管理制度》V2.0 第九章', '红黄线记分管理规定'],
    },
  },
];

// ==================== L3: 业务执行节点 ====================
const businessTaskNodes: BusinessNode[] = [
  // --- 服务管理 ---
  {
    id: 'task_order_flow',
    type: 'business_task',
    label: '工单流转管理',
    description: '从用户报修/报装到工单派发、上门服务、归档回访的全流程管理，确保工单按时处理、闭环归档',
    layer: 3,
    experienceTips: [
      '工单派发后24小时内需确认接收，超时将自动升级至站长，务必在时效内处理',
      '用户报修工单首次回复质量很关键，一次解决率直接影响满意率评分',
      '抢险工单必须即时派发，不能走常规工单审核流程，建议设置专项绿色通道',
    ],
    details: {
      owner: '服务运营主管',
      frequency: '日常持续',
      source: 'CRM系统工单数据',
      relatedDocs: ['《客户服务部管理制度》V2.0 第三章-工单管理制度'],
    },
  },
  {
    id: 'task_online_ops',
    type: 'business_task',
    label: '网厅运营管理',
    description: '掌上营业厅、微信公众号、小程序等线上渠道的运营维护，提供在线咨询、业务办理和增值营销服务',
    layer: 3,
    experienceTips: [
      '节假日前后是线上咨询高峰期，建议提前储备常用回复话术和模板',
      '线上投诉用户的情绪通常比线下更激动，首次回复要体现共情和解决方案',
    ],
    details: {
      owner: '网厅运营班长',
      frequency: '日常持续',
      source: '微信公众号/小程序后台',
    },
  },
  {
    id: 'task_hall_service',
    type: 'business_task',
    label: '营业厅服务管理',
    description: '线下营业厅的燃气开户、缴费、咨询、移改等业务办理，提供标准化窗口服务',
    layer: 3,
    experienceTips: [
      '每月最后三天是缴费高峰期，建议增设临时窗口或引导用户使用线上渠道',
      '老年用户办业务时耐心指导，尽量一次告知所有所需材料避免跑第二趟',
    ],
    details: {
      owner: '营业厅督导岗',
      frequency: '日常持续',
      source: '营业厅收费系统',
    },
  },
  {
    id: 'task_service_monitor',
    type: 'business_task',
    label: '服务监督与回访',
    description: '通过短信回访、电话回访、舆情监控等方式监督服务质量，对不满意工单进行二次跟踪处理',
    layer: 3,
    experienceTips: [
      '回访发现用户不满意时要第一时间联系责任网格员，隔夜后再处理用户情绪会更差',
      '网络舆情工单需要在2小时内响应，超过4小时容易发酵升级',
    ],
    details: {
      owner: '服务运营监督班长',
      frequency: '日常持续',
      source: '95007热线/舆情监控平台',
    },
  },
  // --- 抄收管理 ---
  {
    id: 'task_meter_reading',
    type: 'business_task',
    label: '抄表到位',
    description: '按期完成民商用户的燃气表读数抄录，确保抄表到位率100%、抄表准确率达标',
    layer: 3,
    redYellowLine: {
      hasRedLine: true,
      hasYellowLine: true,
      relatedScoreIds: ['service_critical_3', 'service_major_3'],
    },
    experienceTips: [
      '遇到长期不在家的用户，建议在单元门禁处留下联系方式或与物业建立协助机制',
      '物联网表虽然自动回传数据，但仍需每季度抽查一次实物读数比对，防止表具传输异常',
      '抄表时注意观察表具运行状态，异常停走、倒转可能是偷盗气或表具故障的前兆',
    ],
    details: {
      owner: '网格长/网格员',
      frequency: '居民双月/工商按月',
      formula: '抄表到位率 = 实抄户数 / 应抄户数 × 100%',
      source: 'CRM抄表记录',
    },
  },
  {
    id: 'task_fee_collection',
    type: 'business_task',
    label: '气费催收',
    description: '对欠费用户进行短信提醒、电话催收、上门送达催缴通知，确保气费回收率达标',
    layer: 3,
    experienceTips: [
      '大额欠费用户（工商业）建议先了解经营状况再决定催收策略，避免逼太紧导致坏账',
      '连续三个月欠费的居民用户，上门催收时同步做一次安检，一举两得',
    ],
    details: {
      owner: '网格员/对外稽查员',
      frequency: '日常持续',
      formula: '气费回收率 = 实收气费 / 应收气费 × 100%',
      source: 'CRM收费系统',
    },
  },
  {
    id: 'task_contract_mgmt',
    type: 'business_task',
    label: '合同管理',
    description: '民商用户供用气合同的签订、续签、变更、归档管理，确保合同覆盖率100%',
    layer: 3,
    experienceTips: [
      '新开通用户必须在通气点火时同步签订合同，事后补签的追回成本很高',
      '工商业用户合同到期前30天就要启动续签流程，避免出现无合同用气的合规风险',
    ],
    details: {
      owner: '台账管理员',
      frequency: '日常持续',
      source: 'CRM合同管理模块',
    },
  },
  {
    id: 'task_gas_analysis',
    type: 'business_task',
    label: '用气分析',
    description: '对民商用户用气数据进行分析，识别用气异常、评估输差情况、为输差整治提供数据支撑',
    layer: 3,
    experienceTips: [
      '用气量突然下降50%以上的工商业用户，优先排查是否旁通偷气或表具故障',
      '居民用户连续两个抄表周期零用量，建议安排上门核查是否存在未通气或闲置情况',
    ],
    details: {
      owner: '核算专员',
      frequency: '月度分析',
      formula: '供销差率 = (购气量 - 销气量) / 购气量 × 100%',
      source: 'CRM用气数据/工业云平台',
    },
  },
  // --- 安检管理 ---
  {
    id: 'task_home_inspection',
    type: 'business_task',
    label: '入户安检执行',
    description: '按照安检计划入户开展六大类检查（用气环境、管道、表具、设备、安全装置、气密性），拍照记录并出具安检报告',
    layer: 3,
    redYellowLine: {
      hasRedLine: true,
      hasYellowLine: true,
      relatedScoreIds: ['service_critical_1', 'service_general_1'],
    },
    experienceTips: [
      '安检拍照时每张照片都要带定位水印和时间戳，否则容易被认定为造假',
      '和独居老人沟通安检问题时多一分耐心和细心，他们大多不懂燃气设施维护常识',
      '安检发现一级隐患时，现场就要指导用户紧急处理（关阀、通风），不要只拍照记录就走了',
      '安检时顺手帮用户检查一下报警器和自闭阀的工况，很多时候用户自己都不知道失效了',
    ],
    details: {
      owner: '网格员（安检岗）',
      frequency: '居民每年2次/工商每半年2次',
      source: '安检系统',
      relatedDocs: ['《客户服务部安检管理制度》V2.0'],
    },
  },
  {
    id: 'task_inspection_review',
    type: 'business_task',
    label: '安检复核审核',
    description: '对网格员提交的安检记录进行抽查复核，检查照片齐全性、隐患判定准确性、签名规范性',
    layer: 3,
    experienceTips: [
      '复核时重点看隐患照片是否和问题描述一致，这是造假的高发环节',
      '每月抽检比例不低于15%，覆盖不同网格员和不同小区类型',
    ],
    details: {
      owner: '安检网格长',
      frequency: '日常抽查',
      source: '安检系统审核记录',
    },
  },
  {
    id: 'task_safety_publicity',
    type: 'business_task',
    label: '用气安全宣传',
    description: '通过社区活动、入户宣传、新媒体推送等方式开展安全用气知识普及，提升用户安全意识',
    layer: 3,
    experienceTips: [
      '社区安全宣传活动最好选在周末上午，参与率最高',
      '安全宣传手册上的字不要太小，老年人是燃气事故的高风险群体',
    ],
    details: {
      owner: '安全稽查员/网格员',
      frequency: '每年不少于2次社区活动',
      source: '安全宣传活动记录',
    },
  },
  // --- 隐患管理 ---
  {
    id: 'task_hazard_grading',
    type: 'business_task',
    label: '隐患分级管理',
    description: '按照隐患分级标准（一级重大/二级一般/三级轻微）对发现的隐患进行分类定级，确定整改时限和方案',
    layer: 3,
    experienceTips: [
      '漏气隐患不论大小一律按一级处理，不要因为漏量小就降级',
      '开放式厨房和暗厨房在判定上容易和用户有争议，要有理有据地解释规范要求',
    ],
    details: {
      owner: '安检员/安全技术员',
      frequency: '日常',
      source: '安检系统隐患台账',
    },
  },
  {
    id: 'task_hazard_tracking',
    type: 'business_task',
    label: '隐患整改跟踪',
    description: '对已签发的隐患整改通知单进行跟踪管理，督促用户在整改期限内完成整改',
    layer: 3,
    redYellowLine: {
      hasRedLine: false,
      hasYellowLine: true,
      relatedScoreIds: ['service_major_1'],
    },
    experienceTips: [
      '一级隐患整改单开出后第3天必须电话回访确认进度，不要等到第7天截止期再来催',
      '用户自行找人整改的，必须上门复查拍照存档，仅靠电话确认风险极高',
      '对于长期推诿不整改的用户，及时升级上报站长介入，不要个人反复催办浪费时间',
    ],
    details: {
      owner: '网格员/安全稽查员',
      frequency: '按隐患等级（1-30日）',
      formula: '隐患整改率 = 已整改数 / 应整改数 × 100%',
      source: 'CRM隐患跟踪模块',
    },
  },
  {
    id: 'task_hazard_close',
    type: 'business_task',
    label: '整改复查闭环',
    description: '对已完成整改的隐患进行复查验收，确认整改合格后闭环归档，同步更新隐患台账',
    layer: 3,
    experienceTips: [
      '复查时一定要到现场，肉眼确认整改效果，不要只看照片就把闭环手续办了',
      '整改前后对比照片要同角度同光线拍摄，方便后期追溯审计时核验',
    ],
    details: {
      owner: '安全稽查员/安全技术员',
      frequency: '按隐患等级',
      source: '隐患整改复查记录',
    },
  },
  // --- 稽查考核 ---
  {
    id: 'task_safety_audit',
    type: 'business_task',
    label: '安全稽查',
    description: '对部门各业务模块进行安全履职检查，抽查安全卡掌握情况、操作规范执行情况，开展安全记分',
    layer: 3,
    redYellowLine: {
      hasRedLine: true,
      hasYellowLine: true,
      relatedScoreIds: ['safety_critical', 'safety_major', 'safety_general'],
    },
    experienceTips: [
      '稽查抽检要避免固定时间固定路线，否则员工会有应付检查的准备，达不到稽查的真实目的',
      '安全记分执行前要和当事人当面确认违规事实并签字，留有签字记录才能避免后续争议',
    ],
    details: {
      owner: '安全稽查员',
      frequency: '每月全覆盖',
      source: '安全稽查台账/记分记录',
      relatedDocs: ['红黄线记分管理规定'],
    },
  },
  {
    id: 'task_external_audit',
    type: 'business_task',
    label: '对外稽查（偷盗气）',
    description: '依法查处私拉乱接、偷盗燃气、破坏燃气设施等违法违规行为，追回气费损失，维护公司权益',
    layer: 3,
    redYellowLine: {
      hasRedLine: true,
      hasYellowLine: true,
      relatedScoreIds: ['service_critical_5', 'service_major_4'],
    },
    experienceTips: [
      '偷盗气判定必须现场拍照+视频记录取证，要有完整的证据链才能避免后续法律纠纷',
      '利用AI用气分析工具筛选异常用户，重点关注用气量突然下降或长期零用量的大户',
    ],
    details: {
      owner: '对外稽查员',
      frequency: '日常持续',
      source: 'CRM气量数据/现场稽查记录',
    },
  },
  {
    id: 'task_quality_spotcheck',
    type: 'business_task',
    label: '服务质量抽查',
    description: '对工单处理质量、安检质量、抄收质量等进行随机抽查，评估各模块工作质量是否达标',
    layer: 3,
    experienceTips: [
      '抽查比例要按业务量动态调整，新员工和外包单位的抽查比例应高于老员工',
      '抽查发现的问题要及时反馈给相关责任人，形成"检查-反馈-整改-复查"的闭环',
    ],
    details: {
      owner: '安全稽查员',
      frequency: '每周抽查',
      source: 'CRM系统/工单系统',
    },
  },
  {
    id: 'task_score_mgmt',
    type: 'business_task',
    label: '违规记分管理',
    description: '依据红黄线记分管理细则和负面清单，对员工违规行为进行记分、考核、奖惩管理',
    layer: 3,
    redYellowLine: {
      hasRedLine: true,
      hasYellowLine: true,
      relatedScoreIds: [
        'service_critical_1', 'service_critical_2', 'service_critical_3',
        'service_critical_4', 'service_critical_5', 'service_critical_6',
        'service_major_1', 'service_major_2', 'service_major_3',
        'service_major_4', 'service_major_5', 'service_major_6',
        'safety_critical', 'safety_major',
      ],
    },
    details: {
      owner: '安全稽查主管/安全稽查员',
      frequency: '日常持续',
      source: '红黄线记分台账',
      relatedDocs: ['附件1.红黄线记分管理规定.pdf', '附件2.红黄线考核细则.xlsx', '附件3.负面清单记分标准.xlsx'],
    },
  },
];

// ==================== L4: 岗位支撑节点 ====================
const positionNodes: BusinessNode[] = [
  {
    id: 'pos_manager',
    type: 'position',
    label: '客户服务部经理',
    description: '部门全面负责人，统筹安全管理、服务管理、经营目标及数智化转型',
    layer: 4,
    refId: 'manager',
  },
  {
    id: 'pos_mgr_station',
    type: 'position',
    label: '客服部副经理（服务站）',
    description: '分管服务站全面工作，负责抄收管理、维修服务、经营指标达成',
    layer: 4,
    refId: 'mgr_station',
  },
  {
    id: 'pos_mgr_comprehensive',
    type: 'position',
    label: '客服部副经理（综合模块）',
    description: '分管综合模块，负责服务运营、网厅管理、信息化建设',
    layer: 4,
    refId: 'mgr_comprehensive',
  },
  {
    id: 'pos_safety_supervisor',
    type: 'position',
    label: '安全稽查主管',
    description: '负责部门安全管理体系建设、安全稽查和服务质量监督',
    layer: 4,
    refId: 'safety_supervisor',
    redYellowLine: {
      hasRedLine: false,
      hasYellowLine: true,
      relatedScoreIds: ['safety_general'],
    },
  },
  {
    id: 'pos_station_manager',
    type: 'position',
    label: '服务站站长',
    description: '全面管理服务站日常运营，统筹安检、抄收、维修、安全等工作',
    layer: 4,
    refId: 'station_manager',
  },
  {
    id: 'pos_accounting_supervisor',
    type: 'position',
    label: '核算主管',
    description: '负责部门数据统计分析、收款核算、抄收台账管理',
    layer: 4,
    refId: 'accounting_supervisor',
  },
  {
    id: 'pos_service_ops_supervisor',
    type: 'position',
    label: '服务运营主管',
    description: '负责服务监督、热线水平监控、服务质量提升',
    layer: 4,
    refId: 'service_ops_supervisor',
  },
  {
    id: 'pos_comprehensive_supervisor',
    type: 'position',
    label: '综合主管',
    description: '负责团队建设、绩效考核、数据统筹、综合事务管理',
    layer: 4,
    refId: 'comprehensive_supervisor',
  },
  {
    id: 'pos_inspection_leader',
    type: 'position',
    label: '稽查班长',
    description: '负责安全稽查和对外稽查的日常管理，监督气量异常稽查工作',
    layer: 4,
    refId: 'inspection_leader',
    redYellowLine: {
      hasRedLine: false,
      hasYellowLine: true,
      relatedScoreIds: ['safety_general'],
    },
  },
  {
    id: 'pos_grid_leader',
    type: 'position',
    label: '网格长',
    description: '负责网格内维修/安检/抄收任务分派、人员管理和质量监督',
    layer: 4,
    refId: 'grid_leader',
  },
  {
    id: 'pos_online_hall_leader',
    type: 'position',
    label: '网厅运营班长',
    description: '负责网厅运营团队管理，统筹线上平台运营和数据分析',
    layer: 4,
    refId: 'online_hall_leader',
  },
  {
    id: 'pos_service_supervision_leader',
    type: 'position',
    label: '服务运营监督班长',
    description: '负责服务监督团队管理，处理网络舆情和投诉纠纷',
    layer: 4,
    refId: 'service_supervision_leader',
  },
  {
    id: 'pos_info_warehouse',
    type: 'position',
    label: '信息仓储员',
    description: '负责服务站仓储管理、物资管控、信息系统维护',
    layer: 4,
    refId: 'info_warehouse',
  },
  {
    id: 'pos_safety_tech',
    type: 'position',
    label: '安全技术员',
    description: '负责工程验收、设备管理、技术方案编制、动火审批',
    layer: 4,
    refId: 'safety_tech',
  },
  {
    id: 'pos_meter_accounting',
    type: 'position',
    label: '核算专员',
    description: '负责CRM数据审核、各类统计报表填报、经营指标数据库维护',
    layer: 4,
    refId: 'meter_accounting',
  },
  {
    id: 'pos_meter_ledger',
    type: 'position',
    label: '台账管理员',
    description: '负责民商台账管理、合同管理、回款分析、报表编制',
    layer: 4,
    refId: 'meter_ledger',
  },
  {
    id: 'pos_ai_digital',
    type: 'position',
    label: '数字化专员',
    description: '负责信息化方案策划、系统运维、AI工具推广和数据规范制定',
    layer: 4,
    refId: 'ai_digital_specialist',
  },
  {
    id: 'pos_comprehensive_admin',
    type: 'position',
    label: '综合管理员',
    description: '负责员工异动、考勤绩效、招聘培训、资产管理等综合事务',
    layer: 4,
    refId: 'comprehensive_admin',
  },
  {
    id: 'pos_external_inspector',
    type: 'position',
    label: '对外稽查员',
    description: '负责偷盗气稽查、气费追缴、违规用气查处',
    layer: 4,
    refId: 'external_inspector',
    redYellowLine: {
      hasRedLine: true,
      hasYellowLine: false,
      relatedScoreIds: ['service_critical_5'],
    },
  },
  {
    id: 'pos_safety_inspector',
    type: 'position',
    label: '安全稽查员',
    description: '负责安全履职检查、安全记分、隐患排查治理监督',
    layer: 4,
    refId: 'safety_inspector',
    redYellowLine: {
      hasRedLine: false,
      hasYellowLine: true,
      relatedScoreIds: ['safety_general', 'service_major_1'],
    },
  },
  {
    id: 'pos_hall_supervisor',
    type: 'position',
    label: '营业厅督导岗',
    description: '负责营业厅服务质量监督、业务指导和数据稽查',
    layer: 4,
    refId: 'hall_supervisor',
  },
  {
    id: 'pos_online_hall_ops',
    type: 'position',
    label: '网厅运营专员',
    description: '负责掌上营业厅在线接待、工单审核、电子发票开具、电话营销',
    layer: 4,
    refId: 'online_hall_ops',
    redYellowLine: {
      hasRedLine: false,
      hasYellowLine: true,
      relatedScoreIds: ['service_major_5'],
    },
  },
  {
    id: 'pos_service_supervision_ops',
    type: 'position',
    label: '服务运营监督员',
    description: '负责网络舆情处置、投诉纠纷处理、服务回访跟踪',
    layer: 4,
    refId: 'service_supervision_ops',
  },
  {
    id: 'pos_grid_worker',
    type: 'position',
    label: '网格员',
    description: '负责入户安检、通气点火、维修抢险、抄表收费等一线服务工作，是最核心的执行岗位',
    layer: 4,
    refId: 'grid_worker',
    redYellowLine: {
      hasRedLine: true,
      hasYellowLine: true,
      relatedScoreIds: [
        'service_critical_1', 'service_critical_2', 'service_critical_3',
        'service_critical_4', 'service_major_1', 'service_major_2',
        'service_major_3', 'service_general_1', 'safety_major_4',
      ],
    },
    experienceTips: [
      '入户服务时安全宣传\u201C说一句是一句\u201D，要讲到用户听得懂记得住，不能走过场',
      '用户签字确认前务必让他看清整改通知书的内容，口头答应和书面确认是两回事',
    ],
  },
  {
    id: 'pos_gov_window_sales',
    type: 'position',
    label: '政务专窗营业员',
    description: '负责政务中心燃气服务窗口的前台服务和业务办理',
    layer: 4,
    refId: 'gov_window_sales',
  },
  {
    id: 'pos_hall_sales',
    type: 'position',
    label: '营业厅营业员',
    description: '负责营业厅开户、缴费、咨询等燃气业务办理',
    layer: 4,
    refId: 'hall_sales',
  },
  {
    id: 'pos_delivery_worker',
    type: 'position',
    label: '配送员',
    description: '负责服务站物资配送、材料管理、车辆管理',
    layer: 4,
    refId: 'delivery_worker',
  },
  {
    id: 'pos_gov_window_leader',
    type: 'position',
    label: '政务专窗班长',
    description: '负责政务中心燃气专窗团队管理和业务统筹',
    layer: 4,
    refId: 'gov_window_leader',
  },
];

// ==================== L5: 数据指标节点 ====================
const metricNodes: BusinessNode[] = [
  {
    id: 'metric_inspection_rate',
    type: 'metric',
    label: '安检入户率',
    description: '实际完成安检户数占计划安检户数的比率，目标≥72%',
    layer: 5,
    refId: 'kpi_inspection_rate',
    redYellowLine: {
      hasRedLine: false,
      hasYellowLine: true,
      relatedScoreIds: ['service_major_2'],
    },
    details: {
      frequency: '月度考核',
      formula: '安检入户率 = 实际安检户数 / 计划安检户数 × 100%',
      source: 'CRM安检系统',
    },
  },
  {
    id: 'metric_meter_reading_rate',
    type: 'metric',
    label: '抄表到位率',
    description: '实际抄表户数占应抄户数的比率，目标100%',
    layer: 5,
    refId: 'kpi_meter_reading_rate',
    redYellowLine: {
      hasRedLine: true,
      hasYellowLine: true,
      relatedScoreIds: ['service_critical_4', 'service_major_3'],
    },
    details: {
      frequency: '月度考核',
      formula: '抄表到位率 = 实抄户数 / 应抄户数 × 100%',
      source: 'CRM抄表记录',
    },
  },
  {
    id: 'metric_hazard_fix_rate',
    type: 'metric',
    label: '隐患整改率',
    description: '已完成整改隐患数占应整改隐患数的比率，目标100%',
    layer: 5,
    refId: 'kpi_hazard_fix_rate',
    redYellowLine: {
      hasRedLine: false,
      hasYellowLine: true,
      relatedScoreIds: ['service_major_1'],
    },
    details: {
      frequency: '月度考核',
      formula: '隐患整改率 = 已整改数 / 应整改数 × 100%',
      source: 'CRM隐患跟踪模块',
    },
  },
  {
    id: 'metric_fee_collection_rate',
    type: 'metric',
    label: '气费回收率',
    description: '实收气费占应收气费的比率，目标≥95%',
    layer: 5,
    refId: 'kpi_fee_collection_rate',
    details: {
      frequency: '月度考核',
      formula: '气费回收率 = 实收气费 / 应收气费 × 100%',
      source: 'CRM收费系统',
    },
  },
  {
    id: 'metric_repair_timely_rate',
    type: 'metric',
    label: '维修及时率',
    description: '在规定时限内完成维修工单的比率，目标≥98%',
    layer: 5,
    refId: 'kpi_repair_timely_rate',
    details: {
      frequency: '月度考核',
      formula: '维修及时率 = 按时完成工单数 / 总工单数 × 100%',
      source: 'CRM工单系统',
    },
  },
  {
    id: 'metric_customer_satisfaction',
    type: 'metric',
    label: '客户满意率',
    description: '用户对服务评价满意及以上的比率，目标≥90%',
    layer: 5,
    refId: 'kpi_customer_satisfaction',
    details: {
      frequency: '月度考核',
      formula: '客户满意率 = 满意工单数 / 回访工单总数 × 100%',
      source: '95007回访系统',
    },
  },
  {
    id: 'metric_meter_accuracy',
    type: 'metric',
    label: '抄表准确率',
    description: '抄表读数与实际用量一致的比率，反映抄表质量',
    layer: 5,
    redYellowLine: {
      hasRedLine: true,
      hasYellowLine: true,
      relatedScoreIds: ['service_critical_4', 'service_major_3'],
    },
    details: {
      frequency: '月度考核',
      formula: '抄表准确率 = 准确抄表户数 / 抽检户数 × 100%',
      source: 'CRM抄表复核记录',
    },
  },
  {
    id: 'metric_inspection_completion',
    type: 'metric',
    label: '安检完成率',
    description: '年度安检计划完成进度的比率',
    layer: 5,
    details: {
      frequency: '月度考核',
      formula: '安检完成率 = 累计安检户数 / 年度计划户数 × 100%',
      source: '安检系统',
    },
  },
  {
    id: 'metric_complaint_response',
    type: 'metric',
    label: '投诉响应时效',
    description: '从用户投诉到首次响应的平均耗时，衡量服务响应速度',
    layer: 5,
    details: {
      frequency: '日常监控',
      formula: '平均响应时长 = 投诉响应总时长 / 投诉工单总数',
      source: '95007热线/舆情平台',
    },
  },
  {
    id: 'metric_audit_rate',
    type: 'metric',
    label: '稽查到位率',
    description: '按计划完成稽查任务的比率',
    layer: 5,
    details: {
      frequency: '月度考核',
      formula: '稽查到位率 = 实际完成稽查项 / 计划稽查项 × 100%',
      source: '稽查台账',
    },
  },
  {
    id: 'metric_violation_score',
    type: 'metric',
    label: '违规记分',
    description: '员工红黄线记分和负面清单记分的累计值，反映安全服务质量水平',
    layer: 5,
    redYellowLine: {
      hasRedLine: true,
      hasYellowLine: true,
      relatedScoreIds: [
        'service_critical_1', 'service_critical_2', 'service_critical_3',
        'service_critical_4', 'service_critical_5', 'service_critical_6',
        'service_major_1', 'service_major_2', 'service_major_3',
        'service_major_4', 'service_major_5', 'service_major_6',
        'safety_critical', 'safety_major', 'safety_general', 'safety_minor',
      ],
    },
    details: {
      frequency: '实时记录',
      formula: '违规记分 = 12分×红线次数 + 6分×黄线次数 + 3分×一般违章 + 1分×轻微违章 + 2分×轻微违规',
      source: '红黄线记分台账',
      relatedDocs: ['附件1.红黄线记分管理规定.pdf', '附件2.红黄线考核细则.xlsx', '附件3.负面清单记分标准.xlsx'],
    },
  },
  {
    id: 'metric_fee_collection_amount',
    type: 'metric',
    label: '气费回收金额',
    description: '燃气销售气费的实际回收金额，反映资金回笼情况',
    layer: 5,
    details: {
      frequency: '月度统计',
      source: 'CRM收费系统',
    },
  },
  {
    id: 'metric_gas_sales_volume',
    type: 'metric',
    label: '销气量',
    description: '燃气销售总量，反映经营规模的关键指标',
    layer: 5,
    details: {
      frequency: '月度统计',
      formula: '销气量 = 购气量 - 输差损失',
      source: '工业云平台/CRM系统',
    },
  },
  {
    id: 'metric_value_added_revenue',
    type: 'metric',
    label: '增值业务收入',
    description: '燃气具、波纹管、报警器、保险等增值产品的销售收入',
    layer: 5,
    details: {
      frequency: '月度统计',
      source: 'CRM增值业务模块',
    },
  },
  {
    id: 'metric_order_timely_rate',
    type: 'metric',
    label: '工单处理及时率',
    description: '在承诺时限内完成处理的工单占比',
    layer: 5,
    details: {
      frequency: '日常监控',
      formula: '工单处理及时率 = 按时处理工单数 / 总工单数 × 100%',
      source: 'CRM工单系统',
    },
  },
  {
    id: 'metric_arpu',
    type: 'metric',
    label: '用户ARPU值',
    description: '每用户平均收入，衡量用户价值和经营效益',
    layer: 5,
    details: {
      frequency: '月度统计',
      formula: 'ARPU = 总收入 / 总用户数',
      source: 'CRM经营分析模块',
    },
  },
  {
    id: 'metric_grid_margin',
    type: 'metric',
    label: '网格毛利率',
    description: '网格的毛利率水平，反映网格经营效益',
    layer: 5,
    details: {
      frequency: '月度统计',
      formula: '网格毛利率 = (网格收入 - 网格成本) / 网格收入 × 100%',
      source: '服务站经营报表',
    },
  },
  {
    id: 'metric_door_timely_rate',
    type: 'metric',
    label: '上门及时率',
    description: '网格员按约定时间上门的比率',
    layer: 5,
    details: {
      frequency: '日常监控',
      formula: '上门及时率 = 按时上门工单数 / 需上门工单总数 × 100%',
      source: 'CRM工单系统',
    },
  },
];

// ==================== L6: 数据来源节点 ====================
const dataSourceNodes: BusinessNode[] = [
  {
    id: 'source_crm',
    type: 'data_source',
    label: 'CRM客户管理系统',
    description: '全集团统一客户关系管理系统，记录工单流转、用户信息、合同信息、收费记录等核心业务数据',
    layer: 6,
    details: {
      source: '集团信息系统',
      relatedDocs: ['CRM系统操作规范'],
    },
  },
  {
    id: 'source_inspection_system',
    type: 'data_source',
    label: '安检管理系统',
    description: '记录安检计划、安检执行记录、安检照片、隐患台账等安检全流程数据',
    layer: 6,
    details: {
      source: '集团信息系统',
      relatedDocs: ['安检管理制度', '安检操作规范'],
    },
  },
  {
    id: 'source_95007',
    type: 'data_source',
    label: '95007热线系统',
    description: '24小时客服热线系统，记录用户报修、投诉、咨询等来电信息和服务回访记录',
    layer: 6,
    details: {
      source: '全国联络服务中心',
    },
  },
  {
    id: 'source_hall_system',
    type: 'data_source',
    label: '营业厅收费系统',
    description: '营业厅前台收费业务系统，处理燃气缴费、开户、业务变更等线下交易数据',
    layer: 6,
    details: {
      source: '营业厅',
    },
  },
  {
    id: 'source_wechat',
    type: 'data_source',
    label: '微信公众号/小程序',
    description: '南宁中燃微信公众号和小程序，提供在线缴费、业务预约、安全宣传等线上服务',
    layer: 6,
    details: {
      source: '线上运营平台',
    },
  },
  {
    id: 'source_red_yellow',
    type: 'data_source',
    label: '红黄线考核细则',
    description: '中燃集团客服条口红黄线考核细则文件，定义红线（12分）和黄线（6分）的违规行为和记分标准',
    layer: 6,
    details: {
      source: '集团客服管理部',
      relatedDocs: ['附件1.红黄线记分管理规定.pdf', '附件2.红黄线考核细则.xlsx'],
    },
  },
  {
    id: 'source_negative_list',
    type: 'data_source',
    label: '负面清单记分标准',
    description: '客户服务部负面清单记分标准文件，细化各类违规行为的记分细则',
    layer: 6,
    details: {
      source: '客户服务部',
      relatedDocs: ['附件3.负面清单记分标准.xlsx'],
    },
  },
  {
    id: 'source_smart_gas',
    type: 'data_source',
    label: '智慧燃气数据中心',
    description: '工业云数据平台，采集物联网表数据、用气分析、输差监控等智能燃气数据',
    layer: 6,
    details: {
      source: '集团信息中心',
    },
  },
  {
    id: 'source_order_system',
    type: 'data_source',
    label: '工单处理系统',
    description: '整合CRM工单数据的专项分析系统，监控工单流转效率和处理质量',
    layer: 6,
    details: {
      source: '集团信息系统',
    },
  },
  {
    id: 'source_audit_ledger',
    type: 'data_source',
    label: '稽查台账系统',
    description: '记录安全稽查和对外稽查的检查台账、问题整改跟踪和奖惩记录',
    layer: 6,
    details: {
      source: '客户服务部',
      relatedDocs: ['稽查管理制度'],
    },
  },
];

// ==================== 导出完整节点列表 ====================
export const businessNodes: BusinessNode[] = [
  ...strategicGoalNodes,
  ...businessSegmentNodes,
  ...businessTaskNodes,
  ...positionNodes,
  ...metricNodes,
  ...dataSourceNodes,
];

// ==================== 业务关系数据 ====================
export const businessRelations: BusinessRelation[] = [
  // ========== L1→L2: 战略目标分解到业务板块 ==========
  { from: 'goal_safety', to: 'segment_inspection', type: 'decomposes', label: '安全目标分解' },
  { from: 'goal_safety', to: 'segment_hazard', type: 'decomposes', label: '安全目标分解' },
  { from: 'goal_safety', to: 'segment_audit', type: 'decomposes', label: '安全目标分解' },
  { from: 'goal_service', to: 'segment_service', type: 'decomposes', label: '服务目标分解' },
  { from: 'goal_service', to: 'segment_inspection', type: 'decomposes', label: '服务目标分解' },
  { from: 'goal_efficiency', to: 'segment_billing', type: 'decomposes', label: '经营目标分解' },
  { from: 'goal_efficiency', to: 'segment_service', type: 'decomposes', label: '经营目标分解' },
  { from: 'goal_digital', to: 'segment_service', type: 'decomposes', label: '数智化目标分解' },
  { from: 'goal_digital', to: 'segment_audit', type: 'decomposes', label: '数智化目标分解' },

  // ========== L2→L3: 业务板块分解到业务执行 ==========
  // 服务管理
  { from: 'segment_service', to: 'task_order_flow', type: 'decomposes', label: '服务流程分解' },
  { from: 'segment_service', to: 'task_online_ops', type: 'decomposes', label: '服务流程分解' },
  { from: 'segment_service', to: 'task_hall_service', type: 'decomposes', label: '服务流程分解' },
  { from: 'segment_service', to: 'task_service_monitor', type: 'decomposes', label: '服务流程分解' },
  // 抄收管理
  { from: 'segment_billing', to: 'task_meter_reading', type: 'decomposes', label: '抄收流程分解' },
  { from: 'segment_billing', to: 'task_fee_collection', type: 'decomposes', label: '抄收流程分解' },
  { from: 'segment_billing', to: 'task_contract_mgmt', type: 'decomposes', label: '抄收流程分解' },
  { from: 'segment_billing', to: 'task_gas_analysis', type: 'decomposes', label: '抄收流程分解' },
  // 安检管理
  { from: 'segment_inspection', to: 'task_home_inspection', type: 'decomposes', label: '安检流程分解' },
  { from: 'segment_inspection', to: 'task_inspection_review', type: 'decomposes', label: '安检流程分解' },
  { from: 'segment_inspection', to: 'task_safety_publicity', type: 'decomposes', label: '安检流程分解' },
  // 隐患管理
  { from: 'segment_hazard', to: 'task_hazard_grading', type: 'decomposes', label: '隐患流程分解' },
  { from: 'segment_hazard', to: 'task_hazard_tracking', type: 'decomposes', label: '隐患流程分解' },
  { from: 'segment_hazard', to: 'task_hazard_close', type: 'decomposes', label: '隐患流程分解' },
  // 稽查考核
  { from: 'segment_audit', to: 'task_safety_audit', type: 'decomposes', label: '稽查流程分解' },
  { from: 'segment_audit', to: 'task_external_audit', type: 'decomposes', label: '稽查流程分解' },
  { from: 'segment_audit', to: 'task_quality_spotcheck', type: 'decomposes', label: '稽查流程分解' },
  { from: 'segment_audit', to: 'task_score_mgmt', type: 'decomposes', label: '稽查流程分解' },

  // ========== L3→L4: 业务执行由岗位支撑 ==========
  // 服务管理 - 岗位支撑
  { from: 'task_order_flow', to: 'pos_service_ops_supervisor', type: 'supports', label: '流程管控' },
  { from: 'task_order_flow', to: 'pos_service_supervision_leader', type: 'supports', label: '工单督办' },
  { from: 'task_order_flow', to: 'pos_service_supervision_ops', type: 'supports', label: '工单处理' },
  { from: 'task_order_flow', to: 'pos_grid_worker', type: 'supports', label: '上门服务' },
  { from: 'task_online_ops', to: 'pos_online_hall_leader', type: 'supports', label: '团队管理' },
  { from: 'task_online_ops', to: 'pos_online_hall_ops', type: 'supports', label: '日常运营' },
  { from: 'task_online_ops', to: 'pos_ai_digital', type: 'supports', label: '技术支持' },
  { from: 'task_hall_service', to: 'pos_hall_supervisor', type: 'supports', label: '督导管理' },
  { from: 'task_hall_service', to: 'pos_hall_sales', type: 'supports', label: '窗口服务' },
  { from: 'task_hall_service', to: 'pos_gov_window_leader', type: 'supports', label: '政务窗口' },
  { from: 'task_hall_service', to: 'pos_gov_window_sales', type: 'supports', label: '政务服务' },
  { from: 'task_service_monitor', to: 'pos_service_supervision_leader', type: 'supports', label: '监督统筹' },
  { from: 'task_service_monitor', to: 'pos_service_supervision_ops', type: 'supports', label: '舆情处理' },
  // 抄收管理 - 岗位支撑
  { from: 'task_meter_reading', to: 'pos_grid_leader', type: 'supports', label: '任务分派' },
  { from: 'task_meter_reading', to: 'pos_grid_worker', type: 'supports', label: '现场抄表' },
  { from: 'task_meter_reading', to: 'pos_meter_ledger', type: 'supports', label: '数据核验' },
  { from: 'task_fee_collection', to: 'pos_grid_worker', type: 'supports', label: '现场催收' },
  { from: 'task_fee_collection', to: 'pos_external_inspector', type: 'supports', label: '法律催缴' },
  { from: 'task_fee_collection', to: 'pos_meter_ledger', type: 'supports', label: '回款分析' },
  { from: 'task_contract_mgmt', to: 'pos_meter_ledger', type: 'supports', label: '合同归档' },
  { from: 'task_contract_mgmt', to: 'pos_grid_worker', type: 'supports', label: '现场签约' },
  { from: 'task_gas_analysis', to: 'pos_meter_accounting', type: 'supports', label: '数据分析' },
  { from: 'task_gas_analysis', to: 'pos_safety_tech', type: 'supports', label: '输差整治' },
  // 安检管理 - 岗位支撑
  { from: 'task_home_inspection', to: 'pos_grid_leader', type: 'supports', label: '计划管理' },
  { from: 'task_home_inspection', to: 'pos_grid_worker', type: 'supports', label: '入户安检' },
  { from: 'task_inspection_review', to: 'pos_grid_leader', type: 'supports', label: '质量审核' },
  { from: 'task_inspection_review', to: 'pos_safety_inspector', type: 'supports', label: '抽检复核' },
  { from: 'task_safety_publicity', to: 'pos_grid_worker', type: 'supports', label: '入户宣传' },
  { from: 'task_safety_publicity', to: 'pos_safety_inspector', type: 'supports', label: '社区活动' },
  // 隐患管理 - 岗位支撑
  { from: 'task_hazard_grading', to: 'pos_grid_worker', type: 'supports', label: '隐患初判' },
  { from: 'task_hazard_grading', to: 'pos_safety_tech', type: 'supports', label: '技术定级' },
  { from: 'task_hazard_tracking', to: 'pos_grid_worker', type: 'supports', label: '跟踪督促' },
  { from: 'task_hazard_tracking', to: 'pos_safety_inspector', type: 'supports', label: '监督复查' },
  { from: 'task_hazard_close', to: 'pos_safety_inspector', type: 'supports', label: '验收闭环' },
  { from: 'task_hazard_close', to: 'pos_safety_tech', type: 'supports', label: '技术确认' },
  // 稽查考核 - 岗位支撑
  { from: 'task_safety_audit', to: 'pos_safety_supervisor', type: 'supports', label: '体系管理' },
  { from: 'task_safety_audit', to: 'pos_inspection_leader', type: 'supports', label: '稽查组织' },
  { from: 'task_safety_audit', to: 'pos_safety_inspector', type: 'supports', label: '现场稽查' },
  { from: 'task_external_audit', to: 'pos_inspection_leader', type: 'supports', label: '稽查组织' },
  { from: 'task_external_audit', to: 'pos_external_inspector', type: 'supports', label: '现场稽查' },
  { from: 'task_quality_spotcheck', to: 'pos_safety_inspector', type: 'supports', label: '质量抽检' },
  { from: 'task_score_mgmt', to: 'pos_safety_supervisor', type: 'supports', label: '制度管理' },
  { from: 'task_score_mgmt', to: 'pos_safety_inspector', type: 'supports', label: '记分执行' },
  // 管理层级岗位支撑
  { from: 'task_order_flow', to: 'pos_station_manager', type: 'supports', label: '站点管理' },
  { from: 'task_meter_reading', to: 'pos_station_manager', type: 'supports', label: '站点管理' },
  { from: 'task_home_inspection', to: 'pos_station_manager', type: 'supports', label: '站点管理' },
  { from: 'task_hazard_tracking', to: 'pos_station_manager', type: 'supports', label: '站点管理' },

  // ========== L4→L5: 岗位被指标衡量 ==========
  { from: 'pos_grid_worker', to: 'metric_inspection_rate', type: 'measures', label: '安检质量' },
  { from: 'pos_grid_worker', to: 'metric_meter_reading_rate', type: 'measures', label: '抄表到位' },
  { from: 'pos_grid_worker', to: 'metric_hazard_fix_rate', type: 'measures', label: '隐患整改' },
  { from: 'pos_grid_worker', to: 'metric_fee_collection_rate', type: 'measures', label: '气费回收' },
  { from: 'pos_grid_worker', to: 'metric_repair_timely_rate', type: 'measures', label: '维修时效' },
  { from: 'pos_grid_worker', to: 'metric_customer_satisfaction', type: 'measures', label: '服务质量' },
  { from: 'pos_grid_worker', to: 'metric_meter_accuracy', type: 'measures', label: '抄表质量' },
  { from: 'pos_grid_worker', to: 'metric_door_timely_rate', type: 'measures', label: '上门时效' },
  { from: 'pos_grid_leader', to: 'metric_inspection_rate', type: 'measures', label: '安检管理' },
  { from: 'pos_grid_leader', to: 'metric_meter_reading_rate', type: 'measures', label: '抄收管理' },
  { from: 'pos_grid_leader', to: 'metric_inspection_completion', type: 'measures', label: '安检进度' },
  { from: 'pos_station_manager', to: 'metric_inspection_rate', type: 'measures', label: '站点安检' },
  { from: 'pos_station_manager', to: 'metric_hazard_fix_rate', type: 'measures', label: '站点隐患' },
  { from: 'pos_station_manager', to: 'metric_fee_collection_rate', type: 'measures', label: '站点回收' },
  { from: 'pos_station_manager', to: 'metric_grid_margin', type: 'measures', label: '站点效益' },
  { from: 'pos_safety_inspector', to: 'metric_audit_rate', type: 'measures', label: '稽查到位' },
  { from: 'pos_safety_inspector', to: 'metric_violation_score', type: 'measures', label: '记分执行' },
  { from: 'pos_external_inspector', to: 'metric_fee_collection_amount', type: 'measures', label: '追回金额' },
  { from: 'pos_external_inspector', to: 'metric_audit_rate', type: 'measures', label: '稽查到位' },
  { from: 'pos_service_supervision_ops', to: 'metric_complaint_response', type: 'measures', label: '响应时效' },
  { from: 'pos_service_supervision_ops', to: 'metric_customer_satisfaction', type: 'measures', label: '用户满意' },
  { from: 'pos_service_ops_supervisor', to: 'metric_complaint_response', type: 'measures', label: '服务时效' },
  { from: 'pos_service_ops_supervisor', to: 'metric_customer_satisfaction', type: 'measures', label: '服务质量' },
  { from: 'pos_service_ops_supervisor', to: 'metric_order_timely_rate', type: 'measures', label: '工单时效' },
  { from: 'pos_online_hall_ops', to: 'metric_customer_satisfaction', type: 'measures', label: '线上满意' },
  { from: 'pos_hall_sales', to: 'metric_customer_satisfaction', type: 'measures', label: '窗口满意' },
  { from: 'pos_meter_accounting', to: 'metric_gas_sales_volume', type: 'measures', label: '数据准确' },
  { from: 'pos_meter_accounting', to: 'metric_value_added_revenue', type: 'measures', label: '增值统计' },
  { from: 'pos_meter_ledger', to: 'metric_fee_collection_rate', type: 'measures', label: '回款跟踪' },
  { from: 'pos_meter_ledger', to: 'metric_fee_collection_amount', type: 'measures', label: '回款金额' },
  { from: 'pos_accounting_supervisor', to: 'metric_gas_sales_volume', type: 'measures', label: '数据审核' },
  { from: 'pos_accounting_supervisor', to: 'metric_fee_collection_rate', type: 'measures', label: '回收审核' },

  // ========== L4→L5: 指标衡量业务执行 ==========
  { from: 'task_home_inspection', to: 'metric_inspection_rate', type: 'measures', label: '安检入户考核' },
  { from: 'task_home_inspection', to: 'metric_inspection_completion', type: 'measures', label: '安检进度考核' },
  { from: 'task_meter_reading', to: 'metric_meter_reading_rate', type: 'measures', label: '抄表到位考核' },
  { from: 'task_meter_reading', to: 'metric_meter_accuracy', type: 'measures', label: '抄表准确考核' },
  { from: 'task_fee_collection', to: 'metric_fee_collection_rate', type: 'measures', label: '气费回收考核' },
  { from: 'task_hazard_tracking', to: 'metric_hazard_fix_rate', type: 'measures', label: '隐患整改考核' },
  { from: 'task_service_monitor', to: 'metric_customer_satisfaction', type: 'measures', label: '满意率考核' },
  { from: 'task_service_monitor', to: 'metric_complaint_response', type: 'measures', label: '响应时效考核' },
  { from: 'task_order_flow', to: 'metric_order_timely_rate', type: 'measures', label: '工单时效考核' },
  { from: 'task_order_flow', to: 'metric_repair_timely_rate', type: 'measures', label: '维修时效考核' },
  { from: 'task_safety_audit', to: 'metric_audit_rate', type: 'measures', label: '稽查到位考核' },
  { from: 'task_score_mgmt', to: 'metric_violation_score', type: 'measures', label: '记分考核' },
  { from: 'task_gas_analysis', to: 'metric_gas_sales_volume', type: 'measures', label: '销气量考核' },

  // ========== L5→L6: 指标数据来源于数据来源 ==========
  { from: 'metric_inspection_rate', to: 'source_inspection_system', type: 'sources_from', label: '数据来源' },
  { from: 'metric_inspection_completion', to: 'source_inspection_system', type: 'sources_from', label: '数据来源' },
  { from: 'metric_meter_reading_rate', to: 'source_crm', type: 'sources_from', label: '数据来源' },
  { from: 'metric_meter_accuracy', to: 'source_crm', type: 'sources_from', label: '数据来源' },
  { from: 'metric_fee_collection_rate', to: 'source_crm', type: 'sources_from', label: '数据来源' },
  { from: 'metric_fee_collection_amount', to: 'source_crm', type: 'sources_from', label: '数据来源' },
  { from: 'metric_hazard_fix_rate', to: 'source_crm', type: 'sources_from', label: '数据来源' },
  { from: 'metric_repair_timely_rate', to: 'source_crm', type: 'sources_from', label: '数据来源' },
  { from: 'metric_order_timely_rate', to: 'source_crm', type: 'sources_from', label: '数据来源' },
  { from: 'metric_door_timely_rate', to: 'source_crm', type: 'sources_from', label: '数据来源' },
  { from: 'metric_customer_satisfaction', to: 'source_95007', type: 'sources_from', label: '数据来源' },
  { from: 'metric_complaint_response', to: 'source_95007', type: 'sources_from', label: '数据来源' },
  { from: 'metric_customer_satisfaction', to: 'source_crm', type: 'sources_from', label: '数据来源' },
  { from: 'metric_gas_sales_volume', to: 'source_smart_gas', type: 'sources_from', label: '数据来源' },
  { from: 'metric_gas_sales_volume', to: 'source_crm', type: 'sources_from', label: '数据来源' },
  { from: 'metric_value_added_revenue', to: 'source_crm', type: 'sources_from', label: '数据来源' },
  { from: 'metric_arpu', to: 'source_crm', type: 'sources_from', label: '数据来源' },
  { from: 'metric_grid_margin', to: 'source_crm', type: 'sources_from', label: '数据来源' },
  { from: 'metric_audit_rate', to: 'source_audit_ledger', type: 'sources_from', label: '数据来源' },
  { from: 'metric_violation_score', to: 'source_red_yellow', type: 'sources_from', label: '数据来源' },
  { from: 'metric_violation_score', to: 'source_negative_list', type: 'sources_from', label: '数据来源' },
  { from: 'metric_violation_score', to: 'source_audit_ledger', type: 'sources_from', label: '数据来源' },

  // ========== 同级影响关系 ==========
  { from: 'segment_inspection', to: 'segment_hazard', type: 'impacts', label: '安检输出隐患' },
  { from: 'segment_hazard', to: 'segment_inspection', type: 'impacts', label: '隐患反馈安检' },
  { from: 'segment_audit', to: 'segment_service', type: 'impacts', label: '稽查促进服务' },
  { from: 'segment_audit', to: 'segment_inspection', type: 'impacts', label: '稽查促进安检' },
  { from: 'segment_audit', to: 'segment_billing', type: 'impacts', label: '稽查促进抄收' },
  { from: 'task_home_inspection', to: 'task_hazard_grading', type: 'impacts', label: '安检发现隐患' },
  { from: 'task_hazard_tracking', to: 'task_hazard_close', type: 'impacts', label: '整改后复查' },
  { from: 'task_meter_reading', to: 'task_gas_analysis', type: 'impacts', label: '抄表数据用于分析' },
  { from: 'task_meter_reading', to: 'task_fee_collection', type: 'impacts', label: '抄表支撑催收' },
  { from: 'task_order_flow', to: 'task_service_monitor', type: 'impacts', label: '工单进入回访' },

  // ========== 红黄线考核关系：岗位被考核项评估 ==========
  { from: 'pos_grid_worker', to: 'task_score_mgmt', type: 'assesses', label: '红黄线记分考核' },
  { from: 'pos_safety_inspector', to: 'task_score_mgmt', type: 'assesses', label: '记分执行者' },
  { from: 'pos_external_inspector', to: 'task_score_mgmt', type: 'assesses', label: '红黄线记分考核' },
  { from: 'pos_grid_leader', to: 'task_score_mgmt', type: 'assesses', label: '管理责任追溯' },

  // ========== 管理层级关系 ==========
  { from: 'pos_manager', to: 'pos_mgr_station', type: 'supports', label: '直接管理' },
  { from: 'pos_manager', to: 'pos_mgr_comprehensive', type: 'supports', label: '直接管理' },
  { from: 'pos_manager', to: 'pos_safety_supervisor', type: 'supports', label: '直接管理' },
  { from: 'pos_mgr_station', to: 'pos_station_manager', type: 'supports', label: '直接管理' },
  { from: 'pos_mgr_station', to: 'pos_accounting_supervisor', type: 'supports', label: '直接管理' },
  { from: 'pos_mgr_comprehensive', to: 'pos_service_ops_supervisor', type: 'supports', label: '直接管理' },
  { from: 'pos_mgr_comprehensive', to: 'pos_comprehensive_supervisor', type: 'supports', label: '直接管理' },
  { from: 'pos_safety_supervisor', to: 'pos_inspection_leader', type: 'supports', label: '直接管理' },
  { from: 'pos_station_manager', to: 'pos_grid_leader', type: 'supports', label: '直接管理' },
  { from: 'pos_inspection_leader', to: 'pos_external_inspector', type: 'supports', label: '直接管理' },
  { from: 'pos_inspection_leader', to: 'pos_safety_inspector', type: 'supports', label: '直接管理' },

  // ========== 战略目标考核板块 ==========
  { from: 'goal_safety', to: 'metric_violation_score', type: 'measures', label: '安全目标衡量' },
  { from: 'goal_safety', to: 'metric_hazard_fix_rate', type: 'measures', label: '安全目标衡量' },
  { from: 'goal_service', to: 'metric_customer_satisfaction', type: 'measures', label: '服务目标衡量' },
  { from: 'goal_service', to: 'metric_complaint_response', type: 'measures', label: '服务目标衡量' },
  { from: 'goal_efficiency', to: 'metric_fee_collection_rate', type: 'measures', label: '经营目标衡量' },
  { from: 'goal_efficiency', to: 'metric_gas_sales_volume', type: 'measures', label: '经营目标衡量' },
  { from: 'goal_efficiency', to: 'metric_value_added_revenue', type: 'measures', label: '经营目标衡量' },
  { from: 'goal_digital', to: 'segment_service', type: 'measures', label: '数智化衡量' },
  { from: 'goal_digital', to: 'segment_audit', type: 'measures', label: '数智化衡量' },
];
