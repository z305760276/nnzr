import { type Easing } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Cpu, ShieldAlert, Gauge, BookOpen, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';
import DataDashboard, { DEFAULT_TABS } from '../components/DataDashboard';
import { motion } from 'framer-motion';

const easeOut = [0.22, 1, 0.36, 1] as Easing;

function handleCardMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
  const card = e.currentTarget;
  card.style.transition = 'none';
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const rotateY = ((x - rect.width / 2) / rect.width) * 12;
  const rotateX = -((y - rect.height / 2) / rect.height) * 12;
  card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.02)`;
}

function handleCardMouseLeave(e: React.MouseEvent<HTMLButtonElement>) {
  const card = e.currentTarget;
  card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
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
    desc: '基于《安检管理制度》V2.0 与《隐患管理制度》V2.0。三级隐患分级体系、管道锈蚀6级判定、安检24项检查内容。',
    icon: ShieldAlert,
    stats: '3级隐患',
  },
  {
    id: 'kpi',
    title: '财年指标',
    subtitle: '4项核心指标 · 目标值/权重/公式',
    desc: '基于《客户服务部管理制度》考核指标。抄表率、安检完成率、投诉响应时效、隐患整改率。每项含目标值、权重、数据来源、计算公式。',
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
};

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: easeOut }}
      className="min-h-screen"
      style={{ background: 'var(--gradient-page)', color: 'var(--text-primary)' }}
    >
      <section className="relative min-h-[65vh] flex items-center overflow-hidden" style={{ background: 'var(--page-bg)' }}>
        <div
          className="absolute inset-0 bg-cover bg-[center_30%] bg-no-repeat scale-105"
          style={{ backgroundImage: 'image-set(url(./banner-bg.webp) type("image/webp"), url(./banner-bg.jpeg) type("image/jpeg"))' }}
        />

        <div className="absolute inset-0" style={{ background: 'var(--hero-gradient-overlay)' }} />

        <div
          className="absolute pointer-events-none"
          style={{
            top: '15%', left: '50%', width: '700px', height: '500px',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(ellipse, var(--glow-primary-strong) 0%, transparent 60%)',
            filter: 'blur(100px)',
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.03,
            backgroundImage: 'linear-gradient(var(--hero-grid) 1px, transparent 1px), linear-gradient(90deg, var(--hero-grid) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 pt-24 pb-28 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-[2px]" style={{ background: 'var(--brand-primary)' }} />
              <span className="hero-tagline text-xs tracking-[0.2em] uppercase font-medium">AI-Powered Management System</span>
            </div>

            <h1
              className="text-4xl md:text-5xl font-bold mb-3 leading-tight"
              style={{
                color: 'var(--text-primary)',
                textShadow: '0 0 40px var(--glow-primary-strong)',
              }}
            >
              南宁中燃客户服务部
              <span className="block text-2xl md:text-3xl font-light mt-2 tracking-wide" style={{ color: 'var(--brand-primary)' }}>
                管理图谱
              </span>
            </h1>

            <p className="hero-desc text-base md:text-lg mb-8 max-w-xl leading-relaxed">
              基于四份真实管理制度文件构建的智能化管理体系全景透视。<br />
              目标让新人来了也能看懂、会用、能查。
            </p>
          </motion.div>
        </div>
      </section>

      <DataDashboard tabs={DEFAULT_TABS} />

      <section className="relative py-12" style={{ background: 'var(--page-bg)' }}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>五大管理模块</h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>点击卡片进入详情页，查看全量内容</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div key={card.id} variants={cardVariants}>
                  <button
                    onClick={() => navigate(`/detail/${card.id}`)}
                    onMouseMove={handleCardMouseMove}
                    onMouseLeave={handleCardMouseLeave}
                    className="group relative overflow-hidden rounded-[20px] border text-left w-full will-change-transform glass-shimmer"
                    style={{
                      background: 'var(--card-nvidia-bg)',
                      borderColor: 'var(--card-nvidia-border)',
                      boxShadow: 'var(--card-nvidia-shadow)',
                      backdropFilter: 'blur(16px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                    }}
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b pointer-events-none"
                      style={{
                        background: 'linear-gradient(to bottom, var(--card-nvidia-glow), transparent)',
                      }}
                    />

                    <div className="relative z-10 p-7 pb-0">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{
                            background: 'var(--card-nvidia-icon-bg)',
                            border: '1px solid var(--border-accent)',
                          }}
                        >
                          <Icon className="w-5 h-5" style={{ color: 'var(--card-nvidia-cta-text)' }} />
                        </div>
                        <span
                          className="text-[10px] px-2.5 py-1 rounded-full border"
                          style={{
                            color: 'var(--card-nvidia-badge-text)',
                            background: 'var(--card-nvidia-badge-bg)',
                            borderColor: 'var(--border-subtle)',
                          }}
                        >
                          {card.stats}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--card-nvidia-text)' }}>{card.title}</h3>
                      <p className="text-xs mb-2" style={{ color: 'var(--card-nvidia-text-secondary)' }}>{card.subtitle}</p>
                      <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--card-nvidia-text-desc)' }}>{card.desc}</p>
                    </div>

                    <div className="relative h-16 overflow-hidden">
                      <div
                        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[130%] h-16 rounded-[50%]"
                        style={{
                          background: 'linear-gradient(to top, var(--card-nvidia-glow), transparent)',
                          opacity: 0.5,
                        }}
                      />
                    </div>

                    <div className="relative z-10 px-7 pb-6">
                      <div
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all duration-300"
                        style={{
                          color: 'var(--card-nvidia-cta-text)',
                          borderColor: 'var(--card-nvidia-cta-border)',
                          background: 'var(--card-nvidia-cta-bg)',
                        }}
                      >
                        <span>查看详情</span>
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
}
