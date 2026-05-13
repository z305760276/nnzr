import { useNavigate } from 'react-router-dom';
import { Users, Cpu, ShieldAlert, Gauge, BookOpen, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';
import DataDashboard, { DEFAULT_TABS } from '../components/DataDashboard';

// 卡片 3D 鼠标跟随倾斜效果
function handleCardMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
  const card = e.currentTarget;
  card.style.transition = 'none';
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const rotateY = ((x - rect.width / 2) / rect.width) * 20;
  const rotateX = -((y - rect.height / 2) / rect.height) * 20;
  card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
}

function handleCardMouseLeave(e: React.MouseEvent<HTMLButtonElement>) {
  const card = e.currentTarget;
  card.style.transition = 'transform 0.4s ease';
  card.style.transform = '';
}

const CARDS = [
  {
    id: 'org',
    title: '组织架构全景图谱',
    subtitle: '四级管理层级 · 15个岗位完整职责',
    desc: '基于《管理组织架构及岗位职责》V2.0。点击岗位名称查看完整职责、汇报关系、协作链路。',
    icon: Users,
    stats: '15个岗位',
  },
  {
    id: 'workflow',
    title: 'CRM工单流转',
    subtitle: '五步闭环流程 · 全链路可追溯',
    desc: '基于《客户服务部管理制度》工单管理规范。从工单发起到服务回访的完整流程，含步骤说明、责任岗位、系统操作要点、时限要求。',
    icon: Cpu,
    stats: '5个步骤',
  },
  {
    id: 'safety',
    title: '安检与隐患分级管理',
    subtitle: '三级隐患分级 · 27项整改对照',
    desc: '基于《安检管理制度》V2.0 与《隐患管理制度》V2.0。三级隐患分级体系、管道锈蚀6级判定、安检24项检查内容。目标是让新人来了也能看懂、会判、会处理。',
    icon: ShieldAlert,
    stats: '3级隐患',
  },
  {
    id: 'kpi',
    title: '财年指标',
    subtitle: '4项核心指标 · 目标值/权重/公式',
    desc: '基于《客户服务部管理制度》考核指标。抄表率、安检完成率、投诉响应时效、隐患整改率。每项含目标值、权重、数据来源、计算公式、注意事项。',
    icon: Gauge,
    stats: '4项财年指标',
  },
  {
    id: 'standards',
    title: '规范及记分执行标准',
    subtitle: '国标 · 规范 · 法规 · 安全记分 · 客服记分',
    desc: '国家标准、地方规范、行政法规、中燃集团规范，以及HSE安全记分与客服质量记分标准。规范和记分一体呈现，方便对照执行。',
    icon: BookOpen,
    stats: '6项国标+',
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--text-primary)]">
      {/* Hero Banner - 大气高端 */}
      <section className="relative min-h-[65vh] flex items-center overflow-hidden bg-[var(--page-bg)]">
        {/* 背景图片 */}
        <div
          className="absolute inset-0 bg-cover bg-[center_30%] bg-no-repeat scale-105"
          style={{ backgroundImage: 'image-set(url(./banner-bg.webp) type("image/webp"), url(./banner-bg.jpeg) type("image/jpeg"))' }}
        />

        {/* 灰色渐变覆盖层 - 80%→35%→100%，实现灰色渐变 + 底部渐隐 */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(var(--page-bg-rgb), 0.80) 0%, rgba(var(--page-bg-rgb), 0.35) 50%, rgba(var(--page-bg-rgb), 1) 100%)' }} />

        {/* 微光效 */}
        <div className="absolute pointer-events-none"
          style={{ top: '15%', left: '50%', width: '600px', height: '400px',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(ellipse, var(--glow-red) 0%, transparent 60%)', filter: 'blur(80px)' }} />

        {/* 极简网格线 - 更淡 */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(var(--hero-grid) 1px, transparent 1px), linear-gradient(90deg, var(--hero-grid) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 pt-24 pb-28 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-[2px] bg-[#C8102E]" />
              <span className="hero-tagline text-[#C8102E] text-xs tracking-[0.2em] uppercase font-medium">AI-Powered Management System</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-3 leading-tight" style={{ textShadow: '0 0 30px var(--glow-red-strong)' }}>
              南宁中燃客户服务部
              <span className="block text-2xl md:text-3xl font-light text-[var(--accent)] mt-2 tracking-wide">管理图谱</span>
            </h1>

            <p className="hero-desc text-[var(--text-secondary)] text-base md:text-lg mb-8 max-w-xl leading-relaxed">
              基于四份真实管理制度文件构建的智能化管理体系全景透视。<br />
              目标让新人来了也能看懂、会用、能查。<br />
            </p>
          </div>
        </div>
      </section>

      {/* 数据看板 - 多Tab切换 */}
      <DataDashboard tabs={DEFAULT_TABS} />

      {/* 6 Cards Grid - 玻璃质感 */}
      <section className="relative py-12 bg-[var(--page-bg)]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">五大管理模块</h2>
            <p className="text-sm text-[var(--text-secondary)]">点击卡片进入详情页，查看全量内容</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  onClick={() => navigate(`/detail/${card.id}`)}
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  className="group relative overflow-hidden rounded-[20px] border border-[var(--card-nvidia-border)] bg-[var(--card-nvidia-bg)] text-left transition-all duration-300 will-change-transform"
                  style={{ boxShadow: 'var(--card-nvidia-shadow)' }}
                >
                  {/* 顶部渐变光晕 */}
                  <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[var(--card-nvidia-glow)] to-transparent pointer-events-none" />

                  {/* 内容区 */}
                  <div className="relative z-10 p-7 pb-0">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[var(--card-nvidia-icon-bg)] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[var(--card-nvidia-cta-text)]" />
                      </div>
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-[var(--card-nvidia-badge-bg)] border border-[var(--card-nvidia-border)]" style={{ color: 'var(--card-nvidia-badge-text)' }}>
                        {card.stats}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--card-nvidia-text)' }}>{card.title}</h3>
                    <p className="text-xs mb-2" style={{ color: 'var(--card-nvidia-text-secondary)' }}>{card.subtitle}</p>
                    <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--card-nvidia-text-desc)' }}>{card.desc}</p>
                  </div>

                  {/* 底部装饰 - 抽象渐变球体 */}
                  <div className="relative h-16 overflow-hidden">
                    <div
                      className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[130%] h-16 rounded-[50%] opacity-40"
                      style={{
                        background: 'linear-gradient(to top, rgba(99,102,241,0.15), transparent)',
                      }}
                    />
                  </div>

                  {/* CTA 按钮 */}
                  <div className="relative z-10 px-7 pb-6">
                    <div className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full border border-[var(--card-nvidia-cta-border)] bg-[var(--card-nvidia-cta-bg)]" style={{ color: 'var(--card-nvidia-cta-text)' }}>
                      <span>查看详情</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
