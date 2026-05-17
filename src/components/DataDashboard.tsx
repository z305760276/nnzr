import { Gauge, ShieldAlert, ClipboardCheck, BookOpen, AlertTriangle, CheckCircle2, type LucideIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { motion } from 'framer-motion';

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
    label: '业务图谱',
    icon: Gauge,
    iframeSrc: '',
    description: '业务图谱展示',
  },
  {
    id: 'safety',
    label: '服务管理',
    icon: ShieldAlert,
    iframeSrc: 'https://alidocs.dingtalk.com/notable/share/dashboard/471f7ca52979ea12d31b18bcff4bc570_XNkOM5jAK3wv3OY7',
    description: '服务管理相关数据展示',
  },
  {
    id: 'workflow',
    label: '抄收管理',
    icon: ClipboardCheck,
    iframeSrc: 'https://alidocs.dingtalk.com/notable/share/dashboard/cebe13b5fda7df0fc78ec57d6cc9cc4e_WgZOZA8Aa0BB8qLX',
    description: '抄收管理相关数据展示',
  },
  {
    id: 'docs',
    label: '核算管理',
    icon: BookOpen,
    iframeSrc: '',
    description: '核算管理相关数据展示',
  },
  {
    id: 'hidden-danger',
    label: '隐患管理',
    icon: AlertTriangle,
    iframeSrc: '',
    description: '隐患管理相关数据展示',
  },
  {
    id: 'inspection-rate',
    label: '安检管理',
    icon: CheckCircle2,
    iframeSrc: '',
    description: '安检管理相关数据展示',
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
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative py-12 ${className}`}
      style={{ background: 'var(--page-bg)' }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>数据看板</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>实时指标数据展示</p>
        </motion.div>

        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList
            className="inline-flex h-auto w-auto flex-wrap gap-1.5 bg-transparent p-0 mb-5"
            style={{ background: 'transparent' }}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-300 data-[state=active]:shadow-sm glass-shimmer"
                  style={{
                    background: 'var(--glass-bg)',
                    borderColor: 'var(--glass-border)',
                    color: 'var(--text-secondary)',
                    backdropFilter: 'blur(12px)',
                  }}
                  onMouseEnter={(e) => {
                    const isActive = e.currentTarget.getAttribute('data-state') === 'active';
                    if (!isActive) {
                      e.currentTarget.style.background = 'var(--glass-bg-strong)';
                      e.currentTarget.style.borderColor = 'var(--glass-border-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const isActive = e.currentTarget.getAttribute('data-state') === 'active';
                    if (!isActive) {
                      e.currentTarget.style.background = 'var(--glass-bg)';
                      e.currentTarget.style.borderColor = 'var(--glass-border)';
                    }
                  }}
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
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>{tab.description}</p>
              )}
              <div
                className="w-full h-[80vh] lg:min-h-[600px] rounded-2xl overflow-hidden transition-all duration-500"
                style={{
                  background: 'var(--glass-bg-strong)',
                  border: '1px solid var(--glass-border)',
                  boxShadow: 'var(--glass-shadow)',
                  backdropFilter: 'blur(16px) saturate(180%)',
                }}
              >
                {tab.iframeSrc ? (
                  <iframe
                    src={tab.iframeSrc}
                    className="w-full h-full"
                    title={tab.label}
                    scrolling="yes"
                    allow="fullscreen"
                    style={{ background: 'white' }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4" style={{ color: 'var(--text-muted)' }}>
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
    </motion.section>
  );
}
