import { Gauge, ShieldAlert, ClipboardCheck, BookOpen, type LucideIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';

export interface DashboardTab {
  id: string;
  label: string;
  icon: LucideIcon;
  iframeSrc: string;
  description?: string;
}

export const DEFAULT_TABS: DashboardTab[] = [
  {
    id: 'kpi',
    label: '财年指标',
    icon: Gauge,
    iframeSrc: 'https://alidocs.dingtalk.com/i/nodes/14lgGw3P8vveaqQ0FQdNqbD385daZ90D?utm_scene=person_space',
    description: '财年核心指标完成进度',
  },
  {
    id: 'safety',
    label: '安检进度',
    icon: ShieldAlert,
    iframeSrc: '',
    description: '各片区安检完成情况',
  },
  {
    id: 'workflow',
    label: '工单状态',
    icon: ClipboardCheck,
    iframeSrc: '',
    description: '工单处理实时状态',
  },
  {
    id: 'docs',
    label: '资料下载',
    icon: BookOpen,
    iframeSrc: '',
    description: '制度文件目录索引',
  },
];

interface DataDashboardProps {
  tabs?: DashboardTab[];
  defaultTab?: string;
  className?: string;
}

export default function DataDashboard({
  tabs = DEFAULT_TABS,
  defaultTab,
  className = '',
}: DataDashboardProps) {
  const activeTab = defaultTab ?? tabs[0]?.id;

  return (
    <section className={`relative py-12 bg-[var(--page-bg)] ${className}`}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">数据看板</h2>
          <p className="text-sm text-[var(--text-secondary)]">实时指标数据展示</p>
        </div>

        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList className="inline-flex h-auto w-auto flex-wrap gap-1 bg-transparent p-0 mb-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-[var(--card-solid)] data-[state=active]:text-[#C8102E] data-[state=active]:border-[#C8102E]/30 data-[state=active]:shadow-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center gap-2 rounded-lg border border-transparent px-4 py-2 text-sm font-medium transition-all"
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              {tab.description && (
                <p className="text-xs text-[var(--text-secondary)] mb-3">{tab.description}</p>
              )}
              <div className="w-full h-[80vh] lg:min-h-[600px] rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--card-solid)]">
                {tab.iframeSrc ? (
                  <iframe
                    src={tab.iframeSrc}
                    className="w-full h-full"
                    title={tab.label}
                    scrolling="yes"
                    allow="fullscreen"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-[var(--text-secondary)]">
                    <BookOpen className="w-12 h-12 opacity-30" />
                    <div className="text-center">
                      <p className="text-sm font-medium">数据暂缺</p>
                      <p className="text-xs mt-1 opacity-60">
                        暂无数据，请后续关注
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
