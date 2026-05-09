import { useNavigate, useParams } from 'react-router-dom';
import { Users, Cpu, ShieldAlert, Gauge, BookOpen, ClipboardCheck } from 'lucide-react';
import TopNav from '../components/TopNav';
import { useSearch } from '../App';
import OrgHierarchySection from '../sections/OrgHierarchySection';
import WorkFlowSection from '../sections/WorkFlowSection';
import SafetyCheckSection from '../sections/SafetyCheckSection';
import KpiDashboardSection from '../sections/KpiDashboardSection';
import GBStandardsSection from '../sections/GBStandardsSection';
import LocalStandardsSection from '../sections/LocalStandardsSection';
import LawsSection from '../sections/LawsSection';
import SafetyScoreSection from '../sections/SafetyScoreSection';
import ServiceScoreSection from '../sections/ServiceScoreSection';

const MODULE_META: Record<string, { title: string; subtitle: string; icon: React.FC<{className?: string}> }> = {
  org: { title: '组织架构全景图谱', subtitle: '基于《管理组织架构及岗位职责》V2.0', icon: Users },
  workflow: { title: 'AI 数智化工单流转', subtitle: '基于《客户服务部管理制度》工单管理规范', icon: Cpu },
  safety: { title: '安检与隐患分级管理', subtitle: '基于《安检管理制度》V2.0 与《隐患管理制度》V2.0', icon: ShieldAlert },
  kpi: { title: '财年指标', subtitle: '基于《客户服务部管理制度》考核指标', icon: Gauge },
  standards: { title: '规范标准', subtitle: '国家标准 · 地方规范 · 行政法规', icon: BookOpen },
  scores: { title: '记分标准', subtitle: 'HSE安全记分 · 客服质量记分', icon: ClipboardCheck },
};

const COMPONENT_MAP: Record<string, React.FC> = {
  org: OrgHierarchySection,
  workflow: WorkFlowSection,
  safety: SafetyCheckSection,
  kpi: KpiDashboardSection,
  standards: StandardsCombined,
  scores: ScoresCombined,
};

function StandardsCombined() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#C8102E]" /> 国家标准
        </h3>
        <p className="text-xs text-[var(--text-secondary)] mb-4">客户服务部日常作业须遵循的国家标准清单</p>
        <GBStandardsSection />
      </div>
      <div className="border-t border-[var(--border-light)] pt-8">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#C8102E]" /> 地方规范
        </h3>
        <p className="text-xs text-[var(--text-secondary)] mb-4">广西壮族自治区及南宁市地方性燃气管理规范</p>
        <LocalStandardsSection />
      </div>
      <div className="border-t border-[var(--border-light)] pt-8">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#C8102E]" /> 法规
        </h3>
        <p className="text-xs text-[var(--text-secondary)] mb-4">与客户服务部作业直接相关的国家法律和行政法规</p>
        <LawsSection />
      </div>
    </div>
  );
}

function ScoresCombined() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#C8102E]" /> HSE安全记分标准
        </h3>
        <p className="text-xs text-[var(--text-secondary)] mb-4">员工安全记分满12分将暂停上岗资格</p>
        <SafetyScoreSection />
      </div>
      <div className="border-t border-[var(--border-light)] pt-8">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1 flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-[#C8102E]" /> 客服记分标准
        </h3>
        <p className="text-xs text-[var(--text-secondary)] mb-4">服务质量记分与绩效考核、评优评先直接挂钩</p>
        <ServiceScoreSection />
      </div>
    </div>
  );
}

export default function DetailPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();

  const meta = moduleId ? MODULE_META[moduleId] : null;
  const Component = moduleId ? COMPONENT_MAP[moduleId] : null;

  if (!meta || !Component) {
    return (
      <div className="min-h-screen bg-[var(--page-bg)] text-[var(--text-primary)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">模块不存在</p>
          <button onClick={() => navigate('/')} className="px-4 py-2 bg-[#C8102E] rounded-lg text-sm">
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const Icon = meta.icon;
  const { searchQuery, setSearchQuery, setShowSearchResults } = useSearch();

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--text-primary)]">
      <TopNav
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setShowSearchResults(q.length > 0); }}
        title={meta.title}
        TitleIcon={Icon}
      />

      {/* Content */}
      <main className="pt-14">
        {/* Header */}
        <div className="border-b border-[var(--border-light)] bg-[var(--brand-bg)]">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#C8102E]/15 flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#C8102E]" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">{meta.title}</h1>
              </div>
            </div>
            <p className="text-sm text-[var(--text-secondary)] ml-[52px]">{meta.subtitle}</p>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8">
          <Component />
        </div>
      </main>
    </div>
  );
}
