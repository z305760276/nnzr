// ============================================
// 全局搜索索引 - 聚合所有可搜索内容
// ============================================

import { orgHierarchy } from './orgHierarchy';
import { hazardFixStandards, rustLevels, workOrderDeadlines, inspectionSystem, serviceCommitment, trainingRequirements, inspectionAuditStandards } from './regulationDetails';
import { hazardLevels, safetyCheckItems, kpiData, penaltyStandards, systemModules } from './orgData';

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  category: string;
  categoryColor: string;
  section: string; // 用于跳转定位
  highlight?: string;
}

let searchIndex: SearchResult[] | null = null;

export function buildSearchIndex(): SearchResult[] {
  if (searchIndex) return searchIndex;

  const results: SearchResult[] = [];

  // 1. 组织架构岗位
  orgHierarchy.forEach((node) => {
    results.push({
      id: `org-${node.id}`,
      title: node.title,
      content: [...node.responsibilities, ...node.safetyDuties].join(' '),
      category: node.category,
      categoryColor: node.aiEnabled ? '#3B82F6' : '#94A3B8',
      section: 'org-hierarchy',
      highlight: node.aiEnabled ? 'AI赋能岗位' : undefined
    });
  });

  // 2. 岗位职责单独索引
  orgHierarchy.forEach((node) => {
    node.responsibilities.forEach((resp, j) => {
      results.push({
        id: `resp-${node.id}-${j}`,
        title: `${node.title} - 职责`,
        content: resp,
        category: '岗位职责',
        categoryColor: '#60A5FA',
        section: 'org-hierarchy'
      });
    });
    node.safetyDuties.forEach((duty, j) => {
      results.push({
        id: `safe-${node.id}-${j}`,
        title: `${node.title} - 安全职责`,
        content: duty,
        category: '安全职责',
        categoryColor: '#EF4444',
        section: 'org-hierarchy'
      });
    });
  });

  // 3. 隐患分级
  hazardLevels.forEach((hl, i) => {
    results.push({
      id: `hazard-level-${i}`,
      title: hl.name,
      content: `${hl.description}。整改期限：${hl.fixDeadline}。${hl.examples.join('，')}`,
      category: '隐患分级',
      categoryColor: hl.color,
      section: 'safety-check'
    });
    hl.examples.forEach((ex, j) => {
      results.push({
        id: `hazard-ex-${i}-${j}`,
        title: `${hl.name} - ${ex}`,
        content: ex,
        category: '隐患示例',
        categoryColor: hl.color,
        section: 'safety-check'
      });
    });
  });

  // 4. 隐患整改标准对照表
  hazardFixStandards.forEach((hf, i) => {
    results.push({
      id: `fix-std-${i}`,
      title: `${hf.item} - ${hf.hazardContent}`,
      content: `整改标准：${hf.fixStandard}`,
      category: '整改标准',
      categoryColor: hf.level === 1 ? '#EF4444' : '#3B82F6',
      section: 'safety-check',
      highlight: `一级隐患` // 简化
    });
  });

  // 5. 锈蚀等级
  rustLevels.forEach((rl, i) => {
    results.push({
      id: `rust-${i}`,
      title: `${rl.level}级 - ${rl.name}`,
      content: `${rl.desc}。处置：${rl.action}`,
      category: '锈蚀标准',
      categoryColor: i >= 4 ? '#EF4444' : i >= 2 ? '#F59E0B' : '#3B82F6',
      section: 'safety-check'
    });
  });

  // 6. 工单时限
  workOrderDeadlines.forEach((wo, i) => {
    results.push({
      id: `wo-${i}`,
      title: wo.type,
      content: `派单时限：${wo.dispatch}，处理时限：${wo.process}，总时长：${wo.total}`,
      category: '工单时限',
      categoryColor: '#38BDF8',
      section: 'workflow'
    });
  });

  // 7. 安检制度条款
  inspectionSystem.articles.forEach((article, i) => {
    results.push({
      id: `inspect-article-${i}`,
      title: article.title,
      content: article.content.join(' '),
      category: '安检制度',
      categoryColor: '#22D3EE',
      section: 'safety-check'
    });
  });

  // 8. 服务承诺
  serviceCommitment.articles.forEach((article, i) => {
    results.push({
      id: `svc-${i}`,
      title: `${serviceCommitment.chapter} - ${article.title}`,
      content: article.content.join(' '),
      category: '服务承诺',
      categoryColor: '#818CF8',
      section: 'org-hierarchy'
    });
  });

  // 9. 培训要求
  trainingRequirements.forEach((tr, i) => {
    results.push({
      id: `train-${i}`,
      title: `${tr.category}`,
      content: `要求：${tr.requirements.join('，')}。课时：${tr.hours}。认证：${tr.certification}`,
      category: '培训认证',
      categoryColor: '#A78BFA',
      section: 'org-hierarchy'
    });
  });

  // 10. 稽查标准
  inspectionAuditStandards.forEach((ia, i) => {
    results.push({
      id: `audit-${i}`,
      title: ia.item,
      content: `频率：${ia.frequency}。范围：${ia.scope}`,
      category: '稽查标准',
      categoryColor: '#F472B6',
      section: 'kpi-dashboard'
    });
  });

  // 11. 财年指标
  kpiData.forEach((kpi, i) => {
    results.push({
      id: `kpi-${i}`,
      title: kpi.name,
      content: `当前值：${kpi.value}${kpi.unit}，目标：${kpi.target}`,
      category: '财年指标',
      categoryColor: '#3B82F6',
      section: 'kpi-dashboard'
    });
  });

  // 12. 考核标准
  penaltyStandards.forEach((ps, i) => {
    results.push({
      id: `penalty-${i}`,
      title: ps.violation,
      content: `处罚：${ps.penalty}，严重程度：${ps.level}`,
      category: '考核标准',
      categoryColor: ps.level === '严重' ? '#EF4444' : '#F59E0B',
      section: 'kpi-dashboard'
    });
  });

  // 13. 制度体系模块
  systemModules.forEach((sm, i) => {
    results.push({
      id: `sysmod-${i}`,
      title: sm.name,
      content: sm.desc,
      category: '制度模块',
      categoryColor: '#60A5FA',
      section: 'kpi-dashboard'
    });
  });

  // 14. 安检检查项
  safetyCheckItems.forEach((sci, i) => {
    results.push({
      id: `checkitem-${i}`,
      title: `${sci.category}检查`,
      content: sci.items.join('，'),
      category: '检查内容',
      categoryColor: '#38BDF8',
      section: 'safety-check'
    });
    sci.items.forEach((item, j) => {
      results.push({
        id: `checksub-${i}-${j}`,
        title: `${sci.category} - ${item}`,
        content: item,
        category: '检查子项',
        categoryColor: '#38BDF8',
        section: 'safety-check'
      });
    });
  });

  // 15. 国标/规范标准 (GBStandardsSection)
  const standards = [
    { code: '0.', name: '南宁市管道燃气工程技术标准（2019年修编版）', desc: '南宁市地方燃气工程技术标准', tags: ['地方标准', '工程技术'] },
    { code: '1.', name: '燃气工程项目规范 GB55009-2021', desc: '燃气工程项目全过程技术规范，含设计、施工、验收等环节基本要求', tags: ['国标', '项目规范'] },
    { code: '2.', name: '城镇燃气设计规范(2020年版) GB50028-2006', desc: '城镇燃气输配系统、用户燃气系统设计的基本要求和标准', tags: ['国标', '设计规范'] },
    { code: '3.', name: '城镇燃气室内工程施工与质量验收规范 CJJ94-2009', desc: '城镇燃气室内工程施工质量验收标准', tags: ['行业标准', '施工验收'] },
    { code: '4.', name: '城镇燃气报警控制系统技术规程 CJJT146-2011', desc: '城镇燃气报警控制系统设计、安装、验收及维护的技术要求', tags: ['行业标准', '报警控制'] },
    { code: '5.', name: '家用燃气燃烧器具安装及验收规程 CJJ12-2013', desc: '家用燃气灶、热水器等燃烧器具的安装与验收技术要求', tags: ['行业标准', '燃烧器具'] },
    { code: '6.', name: '城镇燃气设施运行、维护和抢修安全技术规程 CJJ51-2016', desc: '城镇燃气设施运行维护和安全抢修的技术规程', tags: ['行业标准', '运行维护', '抢修规程'] },
  ];
  standards.forEach((s, i) => {
    results.push({
      id: `gb-std-${i}`,
      title: `${s.code} ${s.name}`,
      content: `${s.desc} ${s.tags.join(' ')}`,
      category: '规范标准',
      categoryColor: '#8B5CF6',
      section: 'standards'
    });
  });

  // 16. 地方法规 (LocalStandardsSection)
  const localRegulations = [
    { name: '广西壮族自治区燃气管理条例', desc: '广西行政区域内燃气规划、建设、经营、使用和管理的条例', tags: ['广西', '管理条例'] },
    { name: '南宁市燃气管理条例', desc: '南宁市燃气设施建设和用户服务管理的地方性法规', tags: ['南宁', '管理条例'] },
    { name: '关于明确燃气设施保护范围及有关要求的通知', desc: '南宁市燃气设施保护范围界定及相关管理要求', tags: ['南宁', '设施保护'] },
    { name: '南宁市市区管道燃气价格联动有关事项的通知', desc: '南宁市发改委关于管道燃气价格联动机制的实施通知', tags: ['南宁', '价格联动'] },
  ];
  localRegulations.forEach((r, i) => {
    results.push({
      id: `local-reg-${i}`,
      title: r.name,
      content: `${r.desc} ${r.tags.join(' ')}`,
      category: '地方法规',
      categoryColor: '#F59E0B',
      section: 'standards'
    });
  });

  // 17. 法律法规 (LawsSection)
  const laws = [
    { name: '城镇燃气管理条例', level: '国务院令第583号', desc: '燃气发展规划与应急保障、燃气经营与服务、燃气使用、燃气设施保护、燃气安全事故预防与处理等', tags: ['国务院令', '燃气管理'] },
    { name: '安全生产法', level: '法律', desc: '生产经营单位的安全生产保障、从业人员的安全生产权利义务、安全生产的监督管理等', tags: ['安全生产', '法律责任'] },
    { name: '消防法', level: '法律', desc: '火灾预防、消防组织、灭火救援、监督检查、法律责任等', tags: ['消防', '火灾预防'] },
    { name: '特种设备安全法', level: '法律', desc: '特种设备的生产、经营、使用、检验、检测和监督管理等', tags: ['特种设备', '检验检测'] },
    { name: '刑法（涉及燃气安全相关条款）', level: '法律', desc: '危害公共安全罪、重大责任事故罪等涉及燃气安全的刑事责任条款', tags: ['刑事责任', '公共安全'] },
  ];
  laws.forEach((l, i) => {
    results.push({
      id: `law-${i}`,
      title: l.name,
      content: `${l.level} ${l.desc} ${l.tags.join(' ')}`,
      category: '法律法规',
      categoryColor: '#EF4444',
      section: 'scores'
    });
  });

  // 18. HSE安全记分 (SafetyScoreSection)
  const safetyScores = [
    { category: '严重违章', score: '12分/次', examples: ['违章指挥强令冒险作业', '瞒报谎报安全事故', '破坏事故现场', '无票证从事高危作业'], desc: '直接导致人身伤亡或重大财产损失的行为' },
    { category: '重大违章', score: '6分/次', examples: ['擅自拆除安全装置', '特种作业无证上岗', '重大隐患未整改继续作业', '违规动火'], desc: '可能导致严重事故但尚未造成后果的行为' },
    { category: '一般违章', score: '3分/次', examples: ['未按规定佩戴防护用品', '安全培训缺席', '台账记录不完整', '消防器材失效未报'], desc: '违反安全管理制度的一般性行为' },
    { category: '轻微违章', score: '1分/次', examples: ['劳保用品穿戴不规范', '安全标识损坏未更换', '培训签到代签', '应急物资未定期检查'], desc: '安全管理不到位但不直接威胁安全的行为' },
  ];
  safetyScores.forEach((s, i) => {
    results.push({
      id: `safety-score-${i}`,
      title: `HSE安全记分 - ${s.category}`,
      content: `${s.score} ${s.desc} 示例：${s.examples.join('，')}`,
      category: '安全记分',
      categoryColor: '#EF4444',
      section: 'scores'
    });
  });

  // 19. 客服质量记分 (ServiceScoreSection)
  const serviceScores = [
    { category: '服务质量严重事件', score: '12分/次', examples: ['与用户发生肢体冲突', '收受用户财物', '泄露用户隐私信息', '伪造服务记录'], desc: '严重损害公司形象和用户信任的行为' },
    { category: '服务质量重大事件', score: '6分/次', examples: ['服务态度恶劣被投诉', '工单超期未处理', '虚假安检/虚假维修', '违规收费'], desc: '影响用户体验和公司声誉的行为' },
    { category: '服务质量一般事件', score: '3分/次', examples: ['未按预约时间上门', '服务后未清理现场', '用户回访不满意', '着装不规范'], desc: '服务标准执行不到位的行为' },
    { category: '服务质量轻微事件', score: '1分/次', examples: ['未佩戴工牌', '未主动出示证件', '服务用语不规范', '未及时回复用户咨询'], desc: '服务细节不到位但不影响整体体验的行为' },
  ];
  serviceScores.forEach((s, i) => {
    results.push({
      id: `service-score-${i}`,
      title: `客服记分 - ${s.category}`,
      content: `${s.score} ${s.desc} 示例：${s.examples.join('，')}`,
      category: '客服记分',
      categoryColor: '#F472B6',
      section: 'scores'
    });
  });

  // 20. 集团管理规范 (GroupStandardsSection)
  const groupStandards = [
    { code: '1', name: '中燃集团客服业务红黄线及负面清单记分管理规定', desc: '中燃集团客服业务红线、黄线行为界定及负面清单记分管理要求', tags: ['集团', '红黄线', '记分管理'] },
    { code: '2', name: '中燃集团客服条口红黄线考核细则', desc: '中燃集团客服条线各岗位红黄线行为考核具体细则和记分标准', tags: ['集团', '红黄线', '考核细则'] },
    { code: '3', name: '客户服务部负面清单记分标准', desc: '客户服务部负面清单记分标准，明确各违规行为对应的扣分分值', tags: ['集团', '负面清单', '记分标准'] },
  ];
  groupStandards.forEach((s, i) => {
    results.push({
      id: `group-std-${i}`,
      title: `附件${s.code}.${s.name}`,
      content: `${s.desc} ${s.tags.join(' ')}`,
      category: '集团管理规范',
      categoryColor: '#3B82F6',
      section: 'standards'
    });
  });

  // 21. 南宁中燃管理规范 (NNZRStandardsSection)
  const nnzrStandards = [
    { code: '1', name: '南宁中燃客户服务部管理组织架构及岗位职责', desc: '客户服务部组织架构、各部门职责及岗位说明书', tags: ['组织架构', '岗位职责'] },
    { code: '2', name: '南宁中燃客户服务部管理制度', desc: '客户服务部综合管理制度，涵盖服务标准、工作流程及管理要求', tags: ['管理制度', '服务标准'] },
    { code: '3', name: '南宁中燃客户服务部安检管理制度', desc: '客户服务部安检工作管理制度、安检流程及检查标准', tags: ['安检', '管理制度'] },
    { code: '4', name: '南宁中燃客户服务部隐患管理制度', desc: '客户服务部隐患排查、分级、整改及闭环管理制度', tags: ['隐患', '管理制度'] },
  ];
  nnzrStandards.forEach((s, i) => {
    results.push({
      id: `nnzr-std-${i}`,
      title: `附件：${s.code}.${s.name}`,
      content: `${s.desc} ${s.tags.join(' ')}`,
      category: '南宁中燃管理规范',
      categoryColor: '#10B981',
      section: 'standards'
    });
  });

  searchIndex = results;
  return results;
}

export function search(query: string): SearchResult[] {
  if (!query || query.length < 1) return [];

  const index = buildSearchIndex();
  const q = query.toLowerCase().trim();
  const qChars = q.split('');

  // 匹配分数计算
  const scored = index.map(item => {
    let score = 0;
    const titleLower = item.title.toLowerCase();
    const contentLower = item.content.toLowerCase();
    const categoryLower = item.category.toLowerCase();

    // 标题完全匹配 +100
    if (titleLower === q) score += 100;
    // 标题开头匹配 +50
    else if (titleLower.startsWith(q)) score += 50;
    // 标题包含 +30
    else if (titleLower.includes(q)) score += 30;

    // 内容包含
    if (contentLower.includes(q)) score += 15;

    // 分类名匹配 +20
    if (categoryLower.includes(q)) score += 20;

    // 逐字匹配（支持模糊搜索）
    let charMatchCount = 0;
    let lastIdx = 0;
    for (const ch of qChars) {
      const idx = contentLower.indexOf(ch, lastIdx);
      if (idx >= 0) {
        charMatchCount++;
        lastIdx = idx + 1;
      }
    }
    if (charMatchCount === qChars.length) score += 10;
    score += charMatchCount * 2;

    return { item, score };
  });

  return scored
    .filter(s => s.score > 5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 50)
    .map(s => s.item);
}

// ============================================
// PDF 全文搜索
// ============================================

export interface PdfSearchResult {
  id: string;
  title: string;         // PDF 显示名称
  content: string;        // 匹配文本片段
  pdfLink: string;        // PDF 文件链接
  category: string;       // 规范标准/地方法规/法律法规
  categoryColor: string;
  section: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  '规范标准': '#8B5CF6',
  '地方法规': '#F59E0B',
  '法律法规': '#EF4444',
  '集团管理规范': '#3B82F6',
  '南宁中燃管理规范': '#10B981',
};

let pdfIndexCache: { entries: any[] } | null = null;

async function loadPdfIndex(): Promise<{ entries: any[] }> {
  if (pdfIndexCache) return pdfIndexCache;
  try {
    const resp = await fetch('./pdf-search-index.json');
    pdfIndexCache = await resp.json();
    return pdfIndexCache!;
  } catch {
    return { entries: [] };
  }
}

export async function searchPdf(query: string): Promise<PdfSearchResult[]> {
  if (!query || query.length < 1) return [];

  const data = await loadPdfIndex();
  if (!data.entries || data.entries.length === 0) return [];

  const q = query.toLowerCase().trim();
  const qChars = q.split('');
  const results: Array<{ result: PdfSearchResult; score: number }> = [];

  // 搜索文件名
  data.entries.forEach((entry, ei) => {
    // 文件名也参与搜索
    let titleMatchScore = 0;
    const titleLower = entry.displayName.toLowerCase();
    if (titleLower === q) titleMatchScore += 100;
    else if (titleLower.startsWith(q)) titleMatchScore += 50;
    else if (titleLower.includes(q)) titleMatchScore += 30;

    // 搜索文本片段
    entry.chunks.forEach((chunk: string, ci: number) => {
      const chunkLower = chunk.toLowerCase();
      let score = 0;

      // 标题匹配
      if (titleMatchScore > 0) score += titleMatchScore;

      // 内容完全匹配
      if (chunkLower.includes(q)) {
        score += 30;
      }

      // 逐字模糊匹配
      let charMatchCount = 0;
      let lastIdx = 0;
      for (const ch of qChars) {
        const idx = chunkLower.indexOf(ch, lastIdx);
        if (idx >= 0) {
          charMatchCount++;
          lastIdx = idx + 1;
        }
      }
      if (charMatchCount === qChars.length) score += 5;
      score += charMatchCount;

      if (score >= 10) {
        // 截取匹配位置前后约 80 字作为上下文
        const matchIdx = chunkLower.indexOf(q[0]);
        const start = Math.max(0, matchIdx - 80);
        const end = Math.min(chunk.length, matchIdx + q.length + 80);
        let snippet = chunk.slice(start, end);
        if (start > 0) snippet = '...' + snippet;
        if (end < chunk.length) snippet = snippet + '...';

        results.push({
          result: {
            id: `pdf-${ei}-${ci}`,
            title: entry.displayName,
            content: snippet,
            pdfLink: entry.pdfLink,
            category: entry.category,
            categoryColor: CATEGORY_COLORS[entry.category] || '#8B5CF6',
            section: entry.section,
          },
          score,
        });
      }
    });
  });

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map(r => r.result);
}
