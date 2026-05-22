import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Users, Cpu, ShieldAlert, Gauge, BookOpen, Skull, AlertOctagon, AlertCircle, Info, Eye, FileText, Gavel, Scale, ChevronDown, ChevronUp, ExternalLink, Bookmark, Layers, FileWarning, Library, Search } from 'lucide-react';
import TopNav from '../components/TopNav';
import { useSearch } from '../App';
import OrgHierarchySection from '../sections/OrgHierarchySection';
import WorkFlowSection from '../sections/WorkFlowSection';
import SafetyCheckSection from '../sections/SafetyCheckSection';
import KpiDashboardSection from '../sections/KpiDashboardSection';
import FilePreview from '../components/FilePreview';

const MODULE_META: Record<string, { title: string; subtitle: string; icon: React.FC<{className?: string; style?: React.CSSProperties}> }> = {
  org: { title: '组织架构全景图谱', subtitle: '基于《管理组织架构及岗位职责》V2.0', icon: Users },
  workflow: { title: 'CRM工单流转', subtitle: '基于《客户服务部管理制度》工单管理规范', icon: Cpu },
  safety: { title: '安检与隐患分级管理', subtitle: '基于《安检管理制度》V2.0 与《隐患管理制度》V2.0', icon: ShieldAlert },
  kpi: { title: '财年指标', subtitle: '基于《客户服务部管理制度》考核指标', icon: Gauge },
  standards: { title: '规范及记分执行标准', subtitle: '国标 · 地方规范 · 法规 · 偷盗气 · 安全记分 · 客服记分', icon: BookOpen },
};

const COMPONENT_MAP: Record<string, React.FC> = {
  org: OrgHierarchySection,
  workflow: WorkFlowSection,
  safety: SafetyCheckSection,
  kpi: KpiDashboardSection,
  standards: StandardsCombined,
};

export { StandardsCombined };

// ===== 数据层 =====

type SeverityKey = 'critical' | 'major' | 'general' | 'minor';

interface FileRef {
  name: string;
  desc: string;
  path: string;
  fileType: 'pdf' | 'xlsx' | 'docx';
  tags: string[];
}

interface FileCategory {
  id: string;
  label: string;
  subtitle: string;
  icon: React.FC<{className?: string; style?: React.CSSProperties}>;
  color: string;
  files: FileRef[];
}

interface ScoringItem {
  category: string;
  severity: SeverityKey;
  score: string;
  examples: string[];
  desc: string;
}

const SEV = {
  critical: { color: 'var(--score-critical)', bg: 'var(--score-critical-bg)', border: 'var(--score-critical-border)', glow: 'var(--score-critical-glow)', icon: Skull },
  major:    { color: 'var(--score-major)',    bg: 'var(--score-major-bg)',    border: 'var(--score-major-border)',    glow: 'var(--score-major-glow)',    icon: AlertOctagon },
  general:  { color: 'var(--score-general)',  bg: 'var(--score-general-bg)',  border: 'var(--score-general-border)',  glow: 'var(--score-general-glow)',  icon: AlertCircle },
  minor:    { color: 'var(--score-minor)',    bg: 'var(--score-minor-bg)',    border: 'var(--score-minor-border)',    glow: 'var(--score-minor-glow)',    icon: Info },
} as const;

const fileCategories: FileCategory[] = [
  {
    id: 'gb', label: '国家标准', subtitle: '客户服务部日常作业须遵循', icon: BookOpen, color: '#3B82F6',
    files: [
      { name: '南宁市管道燃气工程技术标准（2019修编版）', desc: '南宁市地方燃气工程技术标准', path: './docs/0.《南宁市管道燃气工程技术标准》（2019年修编版）.pdf', fileType: 'pdf', tags: ['地方标准', '工程技术'] },
      { name: '燃气工程项目规范 GB55009-2021', desc: '设计、施工、验收等环节基本要求', path: './docs/1.《燃气工程项目规范》GB55009-2021.pdf', fileType: 'pdf', tags: ['国标', '项目规范'] },
      { name: '城镇燃气设计规范 GB50028-2006(2020版)', desc: '输配系统与用户燃气系统设计要求', path: './docs/2.《城镇燃气设计规范》(2020年版)GB50028-2006.pdf', fileType: 'pdf', tags: ['国标', '设计规范'] },
      { name: '城镇燃气室内工程施工与质量验收规范 CJJ94-2009', desc: '室内工程施工质量验收标准', path: './docs/3.《城镇燃气室内工程施工与质量验收规范》CJJ94-2009.pdf', fileType: 'pdf', tags: ['行业标准', '施工验收'] },
      { name: '城镇燃气报警控制系统技术规程 CJJT146-2011', desc: '报警控制系统的设计安装验收要求', path: './docs/4.《城镇燃气报警控制系统技术规程》CJJT146-2011.pdf', fileType: 'pdf', tags: ['行业标准', '报警控制'] },
      { name: '家用燃气燃烧器具安装及验收规程 CJJ12-2013', desc: '灶具热水器等燃具安装验收技术要求', path: './docs/5.《家用燃气燃烧器具安装及验收规程》CJJ12-2013.pdf', fileType: 'pdf', tags: ['行业标准', '安装验收'] },
      { name: '城镇燃气设施运行维护和抢修安全技术规程 CJJ51-2016', desc: '设施运行维护和抢修安全技术规程', path: './docs/6.《城镇燃气设施运行、维护和抢修安全技术规程》CJJ51-2016.pdf', fileType: 'pdf', tags: ['行业标准', '运行维护'] },
    ],
  },
  {
    id: 'group', label: '集团管理规范', subtitle: '中燃集团红黄线及记分规定', icon: FileWarning, color: '#E31837',
    files: [
      { name: '客服业务红黄线及负面清单记分管理规定', desc: '红线黄线行为界定及记分管理要求', path: './docs/附件1.《中燃集团客服业务红黄线及负面清单记分管理规定》.pdf', fileType: 'pdf', tags: ['红黄线', '记分管理'] },
      { name: '客服条口红黄线考核细则', desc: '各岗位红黄线行为考核具体细则', path: './docs/附件2.《中燃集团客服条口红黄线考核细则》.xlsx', fileType: 'xlsx', tags: ['红黄线', '考核细则'] },
      { name: '客户服务部负面清单记分标准', desc: '各违规行为扣分分值明细', path: './docs/附件3.《客户服务部负面清单记分标准》.xlsx', fileType: 'xlsx', tags: ['负面清单', '记分标准'] },
    ],
  },
  {
    id: 'nnzr', label: '南宁中燃制度', subtitle: '客户服务部内部管理制度', icon: FileText, color: '#10B981',
    files: [
      { name: '管理组织架构及岗位职责', desc: '部门组织架构、职责及岗位说明书', path: './docs/附件：1.南宁中燃客户服务部管理组织架构及岗位职责.pdf', fileType: 'pdf', tags: ['组织架构', '岗位职责'] },
      { name: '客户服务部管理制度', desc: '服务标准、工作流程及管理要求', path: './docs/附件：2.南宁中燃客户服务部管理制度.docx', fileType: 'docx', tags: ['管理制度', '服务标准'] },
      { name: '安检管理制度', desc: '安检工作流程及检查标准', path: './docs/附件：3.南宁中燃客户服务部安检管理制度.pdf', fileType: 'pdf', tags: ['安检', '管理制度'] },
      { name: '隐患管理制度', desc: '隐患排查、分级、整改闭环管理', path: './docs/附件：4.南宁中燃客户服务部隐患管理制度.pdf', fileType: 'pdf', tags: ['隐患', '管理制度'] },
    ],
  },
  {
    id: 'local', label: '地方规范', subtitle: '广西及南宁地方燃气规范', icon: Scale, color: '#F59E0B',
    files: [
      { name: '广西壮族自治区燃气管理条例', desc: '广西行政区域内燃气管理条例', path: './docs/广西燃气管理条例（公告+文本）2023-3-30.pdf', fileType: 'pdf', tags: ['广西', '管理条例'] },
      { name: '南宁市燃气管理条例', desc: '南宁市燃气设施建设与用户服务管理', path: './docs/南宁市燃气管理条例（2021-08-06发布实施）.doc', fileType: 'pdf', tags: ['南宁', '管理条例'] },
      { name: '燃气设施保护范围及有关要求', desc: '南宁市燃气设施保护范围界定', path: './docs/关于明确燃气设施保护范围及有关要求的通知 (南宁住建).pdf', fileType: 'pdf', tags: ['南宁', '设施保护'] },
      { name: '管道燃气价格联动通知', desc: '南宁市管道燃气价格联动机制', path: './docs/南宁市发展和改革委员会关于南宁市市区管道燃气价格联动有关事项的通知_南发改规〔2025〕4号.pdf', fileType: 'pdf', tags: ['价格联动', '发改委'] },
    ],
  },
  {
    id: 'law', label: '法律法规', subtitle: '国家法律与行政法规', icon: Gavel, color: '#6366F1',
    files: [
      { name: '城镇燃气管理条例', desc: '国务院令第583号 · 燃气规划与应急保障', path: './docs/法规_城镇燃气管理条例.pdf', fileType: 'pdf', tags: ['国务院令', '燃气管理'] },
      { name: '安全生产法', desc: '2021年修订 · 安全生产保障与监督', path: './docs/中华人民共和国安全生产法（2021年6月修订）.pdf', fileType: 'pdf', tags: ['安全生产', '法律责任'] },
      { name: '消防法', desc: '火灾预防、灭火救援与监督检查', path: './docs/法规_消防法.pdf', fileType: 'pdf', tags: ['消防', '火灾预防'] },
      { name: '特种设备安全法', desc: '特种设备生产、使用与监督管理', path: './docs/法规_特种设备安全法.pdf', fileType: 'pdf', tags: ['特种设备', '检验检测'] },
      { name: '刑法（燃气安全相关条款）', desc: '危害公共安全罪等刑事责任条款', path: './docs/法规_刑法.pdf', fileType: 'pdf', tags: ['刑事责任', '公共安全'] },
    ],
  },
  {
    id: 'theft', label: '偷盗气专项', subtitle: '偷盗气稽查与处置规范', icon: Search, color: '#DC2626',
    files: [
      { name: '关于建立常态化打击偷盗气管理工作机制的方案（通知）', desc: '发布《关于建立常态化打击偷盗气管理工作机制的方案》的通知', path: './docs/关于发布《关于建立常态化打击偷盗气管理工作机制的方案》的通知.pdf', fileType: 'pdf', tags: ['偷盗气', '通知'] },
      { name: '关于建立常态化打击偷盗气管理工作机制的方案', desc: '常态化打击偷盗气管理工作机制的总体方案', path: './docs/附件1：关于建立常态化打击偷盗气管理工作机制的方案.pdf', fileType: 'pdf', tags: ['偷盗气', '工作机制'] },
      { name: '中燃集团偷盗气现场排查流程与办法', desc: '偷盗气现场排查的标准流程与具体办法', path: './docs/附件1-1：中燃集团偷盗气现场排查流程与办法.pdf', fileType: 'pdf', tags: ['偷盗气', '排查流程'] },
      { name: '发现偷盗气行为后的应对指引', desc: '发现偷盗气行为后的应急处置与后续处置指引', path: './docs/附件1-2：发现偷盗气行为后的应对指引.pdf', fileType: 'pdf', tags: ['偷盗气', '应对指引'] },
      { name: '盗窃燃气相关法律法规', desc: '盗窃燃气行为涉及的法律法规及司法解释汇编', path: './docs/附件1-3：盗窃燃气相关法律法规.pdf', fileType: 'pdf', tags: ['偷盗气', '法律法规'] },
      { name: '中燃集团打击偷盗气案例汇总', desc: '中燃集团内部打击偷盗气的典型案例汇总', path: './docs/附件1-4：中燃集团打击偷盗气案例汇总.pdf', fileType: 'pdf', tags: ['偷盗气', '案例汇总'] },
      { name: '违章用气检查记录表（范本）', desc: '违章用气现场检查记录表示范模板', path: './docs/附件1-5：违章用气检查记录表（范本）.docx', fileType: 'docx', tags: ['偷盗气', '检查记录'] },
      { name: '停气通知书', desc: '对违章用气用户下达的停气通知书范本', path: './docs/附件1-6：停气通知书.docx', fileType: 'docx', tags: ['偷盗气', '停气通知'] },
    ],
  },
];

const hseScores: ScoringItem[] = [
  { category: '严重违章', severity: 'critical', score: '12分/次', examples: ['违章指挥强令冒险作业', '瞒报谎报安全事故', '破坏事故现场', '无票证从事高危作业'], desc: '直接导致人身伤亡或重大财产损失' },
  { category: '重大违章', severity: 'major', score: '6分/次', examples: ['擅自拆除安全装置', '特种作业无证上岗', '重大隐患未整改继续作业', '违规动火'], desc: '可能导致严重事故但尚未造成后果' },
  { category: '一般违章', severity: 'general', score: '3分/次', examples: ['未按规定佩戴防护用品', '安全培训缺席', '台账记录不完整', '消防器材失效未报'], desc: '违反安全管理制度的一般性行为' },
  { category: '轻微违章', severity: 'minor', score: '1分/次', examples: ['劳保用品穿戴不规范', '安全标识损坏未更换', '培训签到代签', '应急物资未定期检查'], desc: '安全管理不到位但不直接威胁安全' },
];

const serviceScores: ScoringItem[] = [
  { category: '恶性违规行为', severity: 'critical', score: '12分/次', examples: ['安检入户造假（虚假照片）', '通气点火未做严密性试验', '违规置换/室内放散', '抄表弄虚作假乱填表数', '勾结偷盗气', '乱收费'], desc: '严重损害公司利益和形象的恶意违规' },
  { category: '严重违规行为', severity: 'major', score: '6分/次', examples: ['隐患未整改却显示已整改', '到访不遇工单造假', '漏抄/错抄/未按计划抄表', '隐瞒包庇偷盗气', '泄漏客户信息', '使用他人账号操作'], desc: '违反操作规范可能导致严重后果' },
  { category: '一般违规行为', severity: 'general', score: '3分/次', examples: ['安检照片缺失/无用户签名', '未按约定时间上门', '未及时上报处置用户诉求', '服务态度导致投诉'], desc: '违反服务标准和工作流程的一般性行为' },
  { category: '轻微违规行为', severity: 'minor', score: '2分/次', examples: ['户内作业后未做安全宣传'], desc: '服务细节不到位但不直接影响安全' },
];

const totalFileCount = fileCategories.reduce((s, c) => s + c.files.length, 0);
const totalScoreCategories = hseScores.length + serviceScores.length;
const totalExamples = hseScores.reduce((s, i) => s + i.examples.length, 0) + serviceScores.reduce((s, i) => s + i.examples.length, 0);

const statCards = [
  { label: '制度文件', value: totalFileCount, unit: '份', icon: Library, color: 'var(--score-general)', bg: 'var(--score-general-bg)', desc: '6个类别全覆盖' },
  { label: '记分等级', value: totalScoreCategories, unit: '级', icon: Layers, color: 'var(--score-critical)', bg: 'var(--score-critical-bg)', desc: 'HSE + 客服双体系' },
  { label: '违规示例', value: totalExamples, unit: '条', icon: Bookmark, color: 'var(--score-major)', bg: 'var(--score-major-bg)', desc: '覆盖全业务场景' },
  { label: '最高记分', value: '12', unit: '分/次', icon: Skull, color: 'var(--score-critical)', bg: 'var(--score-critical-bg)', desc: '一票否决红线' },
];

// ===== 子组件 =====

function SeverityBar({ item: s }: { item: ScoringItem }) {
  const cfg = SEV[s.severity];
  const SevIcon = cfg.icon;
  const w = s.severity === 'critical' ? 'w-full' : s.severity === 'major' ? 'w-3/4' : s.severity === 'general' ? 'w-1/2' : 'w-1/4';
  return (
    <li className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <SevIcon className="w-3.5 h-3.5 shrink-0" style={{ color: cfg.color }} />
        <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{s.category}</span>
        <span className="text-[10px] font-bold ml-auto" style={{ color: cfg.color }}>{s.score}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--card-inner-bg)' }}>
        <div className={`h-full rounded-full transition-all duration-700 ${w}`} style={{ background: cfg.color }} />
      </div>
      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{s.desc}</p>
    </li>
  );
}

function ScoringPanel({ title, subtitle, items, icon: PanelIcon, hseRefs, serviceRefs, onPreview }: {
  title: string; subtitle: string; items: ScoringItem[]; icon: React.FC<{className?: string; style?: React.CSSProperties}>;
  hseRefs?: FileRef[]; serviceRefs?: FileRef[]; onPreview: (f: FileRef) => void;
}) {
  const [open, setOpen] = useState(false);
  const refs = hseRefs || serviceRefs || [];

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all duration-300 glass-shimmer"
      style={{
        background: 'var(--score-gradient-panel)',
        borderColor: 'var(--score-panel-border)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors"
        style={{ background: open ? 'var(--score-panel-hover)' : 'transparent' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--score-panel-hover)'; }}
        onMouseLeave={(e) => {
          if (!open) e.currentTarget.style.background = 'transparent';
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'var(--score-critical-bg)' }}
          >
            <PanelIcon className="w-5 h-5" style={{ color: 'var(--score-critical)' }} />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{ background: 'var(--score-critical-bg)', color: 'var(--score-critical)' }}
          >
            {items.length}级·{items.reduce((s, i) => s + i.examples.length, 0)}例
          </span>
          {open ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
        </div>
      </button>
      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: open ? '4000px' : '0px', opacity: open ? 1 : 0 }}
      >
        <div className="px-5 pb-5 pt-1" style={{ borderTop: '1px solid var(--score-divider)' }}>
          <ul className="space-y-3 mt-4">
            {items.map((s, i) => <SeverityBar key={i} item={s} />)}
          </ul>
          <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--score-divider)' }}>
            <div className="flex flex-wrap gap-2">
              {items.flatMap(s => s.examples).slice(0, 8).map((ex, j) => {
                const parent = items.find(s => s.examples.includes(ex))!;
                const cfg = SEV[parent.severity];
                return (
                  <span
                    key={j}
                    className="text-[10px] px-2.5 py-1 rounded-lg border transition-colors"
                    style={{
                      background: cfg.bg,
                      color: cfg.color,
                      borderColor: cfg.border,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = cfg.glow; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = cfg.bg; }}
                  >
                    {ex}
                  </span>
                );
              })}
              {items.flatMap(s => s.examples).length > 8 && (
                <span className="text-[10px] px-2.5 py-1 rounded-lg" style={{ background: 'var(--card-inner-bg)', color: 'var(--text-muted)' }}>
                  +{items.flatMap(s => s.examples).length - 8} 更多
                </span>
              )}
            </div>
          </div>
          {refs.length > 0 && (
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--score-divider)' }}>
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--score-minor)' }}>参考文件</span>
              {refs.map((ref, j) => (
                <button key={j} onClick={() => onPreview(ref)}
                  className="block mt-2 text-xs font-medium hover:underline cursor-pointer transition-colors"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  <Eye className="w-3 h-3 inline mr-1" />
                  {ref.fileType === 'xlsx' ? '附件' + (j + 2) + '. ' : ''}{ref.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FileCard({ cat, onPreview }: { cat: FileCategory; onPreview: (f: FileRef) => void }) {
  const [open, setOpen] = useState(false);
  const Icon = cat.icon;

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all duration-300 glass-shimmer"
      style={{
        background: 'var(--glass-bg)',
        borderColor: open ? 'var(--glass-border-active)' : 'var(--glass-border)',
        backdropFilter: 'blur(16px) saturate(180%)',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3.5 flex items-center justify-between text-left transition-colors"
        style={{ background: open ? 'var(--glass-bg-strong)' : 'transparent' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--glass-bg-strong)'; }}
        onMouseLeave={(e) => {
          if (!open) e.currentTarget.style.background = 'transparent';
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: cat.color + '18',
              border: '1px solid ' + cat.color + '22',
            }}
          >
            <Icon className="w-4 h-4" style={{ color: cat.color }} />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{cat.label}</h4>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{cat.subtitle} · {cat.files.length}项</p>
          </div>
        </div>
        {open ? <ChevronUp className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--text-muted)' }} /> : <ChevronDown className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--text-muted)' }} />}
      </button>
      <div
        className="overflow-hidden transition-all duration-400 ease-in-out"
        style={{ maxHeight: open ? '3000px' : '0px', opacity: open ? 1 : 0 }}
      >
        <div className="px-4 pb-4 pt-0" style={{ borderTop: '1px solid var(--glass-border)' }}>
          <ul className="space-y-1 mt-3">
            {cat.files.map((f, j) => (
              <li
                key={j}
                className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 group transition-colors"
                style={{ background: 'transparent' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--glass-bg-strong)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{f.name}</p>
                  <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
                </div>
                {!f.path ? (
                  <span
                    className="text-[10px] px-2 py-1 rounded-md shrink-0 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{
                      background: 'var(--card-inner-bg)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    待上传
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 shrink-0">
                    {f.fileType === 'docx' ? (
                      <a
                        href={f.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] px-2 py-1 rounded-md font-medium inline-flex items-center gap-1"
                        style={{
                          background: 'var(--brand-bg)',
                          color: 'var(--brand-primary)',
                        }}
                      >
                        <Eye className="w-3 h-3" />预览
                      </a>
                    ) : (
                      <button
                        onClick={() => onPreview(f)}
                        className="text-[10px] px-2 py-1 rounded-md font-medium inline-flex items-center gap-1"
                        style={{
                          background: 'var(--brand-bg)',
                          color: 'var(--brand-primary)',
                        }}
                      >
                        <Eye className="w-3 h-3" />预览
                      </button>
                    )}
                    <a
                      href={f.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] px-2 py-1 rounded-md font-medium inline-flex items-center gap-1"
                      style={{
                        background: 'var(--card-inner-bg)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <ExternalLink className="w-3 h-3" />下载
                    </a>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StandardsCombined() {
  const [preview, setPreview] = useState<{ filePath: string; fileName: string; fileType: 'pdf' | 'xlsx' } | null>(null);

  const handlePreview = (f: FileRef) => {
    if (f.fileType === 'docx') return;
    setPreview({ filePath: f.path, fileName: f.name + (f.fileType === 'xlsx' ? '.xlsx' : '.pdf'), fileType: f.fileType as 'pdf' | 'xlsx' });
  };

  const hseRefs = fileCategories.find(c => c.id === 'group')!.files.filter(f => f.name.includes('红黄线') && f.fileType === 'pdf');
  const serviceRefs = fileCategories.find(c => c.id === 'group')!.files.filter(f => f.fileType === 'xlsx');

  return (
    <div className="space-y-12">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border p-5 transition-all duration-500 glass-shimmer"
              style={{
                background: 'var(--score-gradient-stat-' + (i + 1) + ')',
                borderColor: 'var(--score-panel-border)',
                animation: 'glass-fade-in-up 0.5s ease-out both',
                animationDelay: (i * 0.08) + 's',
              }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: stat.bg }}>
                <Icon className="w-4 h-4" style={{ color: stat.color }} />
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
            记分执行标准
          </span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, var(--score-critical), transparent)' }} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ScoringPanel title="HSE 安全记分" subtitle="员工安全记分满12分将暂停上岗资格" items={hseScores}
            icon={ShieldAlert} hseRefs={hseRefs} onPreview={handlePreview} />
          <ScoringPanel title="客服质量记分" subtitle="服务质量记分与绩效考核、评优评先直接挂钩" items={serviceScores}
            icon={Bookmark} serviceRefs={serviceRefs} onPreview={handlePreview} />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, var(--score-general), transparent)' }} />
          <span
            className="text-xs font-bold uppercase tracking-widest shrink-0 px-3 py-1 rounded-full border"
            style={{
              color: 'var(--score-general)',
              borderColor: 'var(--score-general-border)',
              background: 'var(--score-general-soft)',
            }}
          >
            规范制度文件
          </span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, var(--score-general), transparent)' }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {fileCategories.map((cat) => (
            <FileCard key={cat.id} cat={cat} onPreview={handlePreview} />
          ))}
        </div>
      </div>

      {preview && (
        <FilePreview open={!!preview} onClose={() => setPreview(null)}
          fileName={preview.fileName} filePath={preview.filePath} fileType={preview.fileType} />
      )}
    </div>
  );
}

export default function DetailPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const searchCtx = useSearch();

  const meta = moduleId ? MODULE_META[moduleId] : null;
  const Component = moduleId ? COMPONENT_MAP[moduleId] : null;

  if (!meta || !Component) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-page)', color: 'var(--text-primary)' }}>
        <div className="text-center">
          <p className="text-lg mb-4">模块不存在</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-lg text-sm transition-all"
            style={{
              background: 'var(--brand-primary)',
              color: 'white',
            }}
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const Icon = meta.icon;
  const { searchQuery, setSearchQuery, setShowSearchResults } = searchCtx;

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-page)', color: 'var(--text-primary)' }}>
      <TopNav
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setShowSearchResults(q.length > 0); }}
        title={meta.title}
        TitleIcon={Icon}
      />

      <main className="pt-14">
        <div
          className="border-b"
          style={{
            borderColor: 'var(--glass-border)',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'var(--brand-bg)',
                  border: '1px solid var(--border-accent)',
                }}
              >
                <Icon className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{meta.title}</h1>
              </div>
            </div>
            <p className="text-sm ml-[52px]" style={{ color: 'var(--text-secondary)' }}>{meta.subtitle}</p>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8">
          <Component />
        </div>
      </main>
    </div>
  );
}
