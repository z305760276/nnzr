import { Gauge, ShieldAlert, ClipboardCheck, BookOpen, AlertTriangle, CheckCircle2, type LucideIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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
    iframeSrc: 'https://alidocs.dingtalk.com/notable/share/dashboard/3b22435afa0700e57394e035afb4b92a_XNkOM5jAK3wv3OY7',
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
    iframeSrc: 'https://alidocs.dingtalk.com/notable/share/dashboard/818b8e5f5db3b9b2483f94d57c108242_eYVOL5jekyjN4lpz',
    description: '核算管理相关数据展示',
  },
  {
    id: 'hidden-danger',
    label: '隐患管理',
    icon: AlertTriangle,
    iframeSrc: 'https://alidocs.dingtalk.com/notable/share/dashboard/6a9f8fe1e1987d64bcf63839533024ae_AJdl65APA8aB9Oke',
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

const LAYER_DATA = [
  { label: '战略', count: 4, colors: ['#FFD700', '#FF6B6B'], shape: 'diamond' as const },
  { label: '板块', count: 5, colors: ['#3B82F6', '#1D4ED8'], shape: 'rect' as const },
  { label: '执行', count: 6, colors: ['#14B8A6', '#0D9488'], shape: 'circle' as const },
  { label: '岗位', count: 5, colors: ['#8B5CF6', '#6D28D9'], shape: 'hex' as const },
  { label: '指标', count: 4, colors: ['#F97316', '#EA580C'], shape: 'rect2' as const },
  { label: '来源', count: 3, colors: ['#6B7280', '#4B5563'], shape: 'rect2' as const },
];

export default function DataDashboard({
  tabs = DEFAULT_TABS,
  defaultTab,
  className = '',
}: DataDashboardProps) {
  const activeTab = defaultTab ?? tabs[0]?.id;
  const navigate = useNavigate();

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
                  colorScheme: 'light',
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
                  <div className="w-full h-full relative overflow-hidden">
                    {tab.id === 'kpi' ? (
                      <>
                        {/* 动态光效背景层 */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              'radial-gradient(ellipse at 40% 30%, rgba(99,102,241,0.08) 0%, transparent 55%), radial-gradient(ellipse at 65% 70%, rgba(139,92,246,0.06) 0%, transparent 50%), linear-gradient(170deg, rgba(240,245,255,0.92) 0%, rgba(230,235,250,0.88) 50%, rgba(220,225,245,0.92) 100%)',
                          }}
                        >
                          {/* 流动锥形渐变光束 */}
                          <motion.div
                            className="absolute pointer-events-none"
                            style={{
                              top: '-10%',
                              left: '-10%',
                              width: '120%',
                              height: '120%',
                              background:
                                'conic-gradient(from 200deg at 35% 35%, transparent 0deg, rgba(99,102,241,0.05) 60deg, transparent 90deg, rgba(139,92,246,0.04) 150deg, transparent 180deg, rgba(20,184,166,0.04) 260deg, transparent 300deg, transparent 360deg)',
                            }}
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                          />
                          {/* 垂直扫描线 */}
                          <motion.div
                            className="absolute pointer-events-none"
                            style={{
                              top: 0,
                              left: 0,
                              right: 0,
                              height: '2px',
                              background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.14), transparent)',
                            }}
                            animate={{ top: ['-5%', '105%'] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                          />
                          {/* 浮动粒子群 */}
                          {[...Array(8)].map((_, i) => (
                            <motion.div
                              key={`p-${i}`}
                              className="absolute rounded-full pointer-events-none"
                              style={{
                                width: 2 + (i % 3),
                                height: 2 + (i % 3),
                                background: ['#3B82F6', '#6366F1', '#14B8A6', '#8B5CF6'][i % 4],
                                left: `${15 + (i * 11) % 75}%`,
                                top: `${10 + (i * 17) % 80}%`,
                              }}
                              animate={{
                                opacity: [0.15, 0.5, 0.15],
                                y: [0, -12 - (i % 4) * 4, 0],
                                scale: [1, 1.3, 1],
                              }}
                              transition={{
                                duration: 3 + (i % 3) * 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: i * 0.4,
                              }}
                            />
                          ))}
                        </div>

                        {/* 朦胧图谱预览（保留6层结构） */}
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ filter: 'blur(16px)' }}
                          animate={{ opacity: [0.48, 0.6, 0.48], scale: [1.03, 1.05, 1.03] }}
                          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <div className="flex flex-col items-center gap-2.5 w-full max-w-[420px]">
                            {LAYER_DATA.map((layer, li) => (
                              <div key={li} className="flex items-center justify-center gap-2.5">
                                <span
                                  className="text-[9px] font-semibold w-12 text-right shrink-0"
                                  style={{ color: '#6B7280', opacity: 0.55 }}
                                >
                                  {layer.label}
                                </span>
                                {[...Array(layer.count)].map((_, i) => {
                                  const base =
                                    layer.shape === 'diamond'
                                      ? 24
                                      : layer.shape === 'circle'
                                        ? 13 + i * 2
                                        : layer.shape === 'hex'
                                          ? 18
                                          : layer.shape === 'rect'
                                            ? 26 + i * 4
                                            : 22 + i * 6;
                                  const h =
                                    layer.shape === 'rect' || layer.shape === 'rect2'
                                      ? layer.shape === 'rect' ? 18 : 16
                                      : base;
                                  return (
                                    <div
                                      key={i}
                                      style={{
                                        width: base,
                                        height: h,
                                        background: `linear-gradient(135deg, ${layer.colors[0]}, ${layer.colors[1]})`,
                                        borderRadius:
                                          layer.shape === 'circle'
                                            ? '50%'
                                            : layer.shape === 'hex'
                                              ? 0
                                              : layer.shape === 'diamond'
                                                ? 3
                                                : layer.shape === 'rect'
                                                  ? 5
                                                  : 3,
                                        clipPath:
                                          layer.shape === 'hex'
                                            ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                                            : undefined,
                                        transform: layer.shape === 'diamond' ? 'rotate(45deg)' : undefined,
                                        opacity: 0.5 + i * 0.07,
                                      }}
                                    />
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        </motion.div>

                        {/* 磨砂遮罩 */}
                        <div
                          className="absolute inset-0"
                          style={{
                            backdropFilter: 'blur(3px) saturate(150%)',
                            background:
                              'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(240,243,255,0.32) 50%, rgba(230,235,250,0.28) 100%)',
                          }}
                        />

                        {/* 内容层 */}
                        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-7">

                          {/* 精致按钮 */}
                          <motion.button
                            onClick={() => navigate('/business-graph')}
                            className="group relative inline-flex items-center justify-center rounded-2xl text-sm font-bold cursor-pointer overflow-hidden"
                            style={{
                              width: 164,
                              height: 48,
                              background: 'transparent',
                              color: '#fff',
                              border: '1.5px solid rgba(99,102,241,0.5)',
                            }}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
                            whileHover={{ scale: 1.03, borderColor: 'rgba(99,102,241,0.9)' }}
                            whileTap={{ scale: 0.97 }}
                          >
                            {/* 按钮填充渐变 */}
                            <motion.div
                              className="absolute inset-0 rounded-2xl"
                              style={{ background: 'linear-gradient(135deg, #3B82F6, #6366F1)' }}
                              initial={{ opacity: 0.85 }}
                              whileHover={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                            {/* hover扫描线 */}
                            <motion.div
                              className="absolute inset-0 rounded-2xl overflow-hidden"
                              style={{
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                                transform: 'translateX(-100%)',
                              }}
                              whileHover={{ x: ['100%', '-100%'] }}
                              transition={{ duration: 0.6, ease: 'easeOut' }}
                            />
                            <span className="relative z-10 tracking-wide">点击打开业务图谱</span>
                          </motion.button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-full h-full flex flex-col items-center justify-center gap-4" style={{ color: 'var(--text-muted)' }}>
                          <BookOpen className="w-12 h-12 opacity-30" />
                          <div className="text-center">
                            <p className="text-sm font-medium">数据暂缺</p>
                            <p className="text-xs mt-1 opacity-60">
                              暂无数据，请后续关注
                            </p>
                          </div>
                        </div>
                      </>
                    )}
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
